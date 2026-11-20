import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  PLATFORM_ID,
  Signal,
  signal,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { NbIndexedDbStore, NbMemoryStore, NbNoStore, NbStoreBackend } from './indexed-db-store';

/**
 * The defaults of a storage's keys: required for a key whose value can't be `undefined`, so its signal has a value
 * before the stored one loads, optional for the others.
 */
export type NbStorageDefaults<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]-?: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
};

export interface NbStorageOptions<T> {
  /** The value of a key that holds none, and of its signal until the stored one loads. */
  defaults: NbStorageDefaults<T>;
  /**
   * Turns what's stored for a key into its current shape as it loads, e.g. adding fields a newer version has. What's
   * stored is what an older version of the app wrote, so it's `unknown`.
   */
  migrate?: { [K in keyof T]?: (stored: unknown) => T[K] };
  /**
   * Where the values are kept. By default, IndexedDB in the browser (memory where it's unavailable), and nowhere on the
   * server, so each request renders with the defaults.
   */
  backend?: (name: string) => NbStoreBackend;
}

/** A change to a storage's values, from this tab or another one. */
export type NbStorageChange<T> =
  | { [K in keyof T]: { key: K; value: T[K]; removed: false; remote: boolean } }[keyof T]
  | { [K in keyof T]: { key: K; value: T[K]; removed: true; remote: boolean } }[keyof T]
  | { cleared: true; remote: boolean };

/**
 * A stored value as a signal, shared by everything that reads it: it starts as the key's default, takes the stored
 * value once it loads, and follows changes from other tabs.
 */
export type NbStoredSignal<V> = Signal<V> & {
  /** Sets the value now; resolves once it's stored and other tabs have heard of it. */
  set(value: V): Promise<void>;
  update(change: (value: V) => V): Promise<void>;
  /** Removes the stored value, so the key has its default again. */
  remove(): Promise<void>;
  /** Whether the stored value is still loading. */
  readonly loading: Signal<boolean>;
  /** The last failure to load or store the value, e.g. a full or unavailable IndexedDB. */
  readonly error: Signal<unknown>;
  /** Resolves with the value once it has loaded. */
  readonly loaded: Promise<V>;
};

type Message = { key: string; value?: unknown; removed?: boolean } | { cleared: true };

interface Live {
  readonly state: ReturnType<typeof signal<unknown>>;
  // Changes since the load started, which the loaded value mustn't overwrite.
  changed: boolean;
}

/**
 * The values of a storage `declareStorage` declares, typed by its key map `T`: read and written by key, or as shared
 * signals, and kept in step with the other tabs.
 */
export class NbStorage<T> {
  /** Changes to the values, from this tab and the others. */
  readonly changes: Observable<NbStorageChange<T>>;

  protected readonly changes$ = new Subject<NbStorageChange<T>>();
  // The signals in use, by key, held weakly: a signal goes once nothing holds it. Their state lives as long as they do.
  protected readonly live = new Map<string, WeakRef<NbStoredSignal<unknown>>>();
  protected readonly states = new WeakMap<NbStoredSignal<unknown>, Live>();
  protected readonly released = new FinalizationRegistry<{ key: string; ref: WeakRef<NbStoredSignal<unknown>> }>(
    ({ key, ref }) => {
      if (this.live.get(key) === ref) {
        this.live.delete(key);
      }
    },
  );

  constructor(
    readonly name: string,
    protected readonly options: NbStorageOptions<T>,
    protected readonly backend: NbStoreBackend,
    protected readonly channel?: BroadcastChannel,
  ) {
    this.changes = this.changes$.asObservable();
    channel?.addEventListener('message', ({ data }: MessageEvent<Message>) => this.receive(data));
  }

  /** The value of a key: what's stored, migrated, or its default. */
  async get<K extends keyof T & string>(key: K): Promise<T[K]> {
    if (!(await this.backend.has(key))) {
      return this.defaultOf(key);
    }
    const stored = await this.backend.get(key);
    const migrate = this.options.migrate?.[key];
    return migrate ? migrate(stored) : (stored as T[K]);
  }

  /** Stores a value, then tells the other tabs. */
  async set<K extends keyof T & string>(key: K, value: T[K]): Promise<void> {
    this.apply(key, value);
    this.changes$.next({ key, value, removed: false, remote: false } as NbStorageChange<T>);
    await this.backend.set(key, value);
    this.post({ key, value });
  }

  /** Removes a key's value, so it has its default again. */
  async remove<K extends keyof T & string>(key: K): Promise<void> {
    const value = this.defaultOf(key);
    this.apply(key, value);
    this.changes$.next({ key, value, removed: true, remote: false } as NbStorageChange<T>);
    await this.backend.delete(key);
    this.post({ key, removed: true });
  }

  /** The keys that hold a value. */
  async keys(): Promise<(keyof T & string)[]> {
    return (await this.backend.keys()) as (keyof T & string)[];
  }

  /** Removes every value. */
  async clear(): Promise<void> {
    for (const [key] of this.live) {
      this.apply(key, this.defaultOf(key as keyof T & string));
    }
    this.changes$.next({ cleared: true, remote: false });
    await this.backend.clear();
    this.post({ cleared: true });
  }

  /**
   * A key's value as a signal. It's shared: everything that asks for the key while it's in use gets the same one, and
   * it's released once nothing holds it.
   */
  signal<K extends keyof T & string>(key: K): NbStoredSignal<T[K]> {
    const existing = this.live.get(key)?.deref();
    if (existing) {
      return existing as NbStoredSignal<T[K]>;
    }
    const stored = this.createSignal(key);
    const ref = new WeakRef<NbStoredSignal<unknown>>(stored);
    this.live.set(key, ref);
    this.released.register(stored, { key, ref });
    return stored;
  }

  /** Stops following the other tabs and closes the backend; the storage can't be used after. */
  destroy() {
    this.channel?.close();
    this.changes$.complete();
    void this.backend.close?.().catch(() => undefined);
  }

  protected createSignal<K extends keyof T & string>(key: K): NbStoredSignal<T[K]> {
    const state = signal<unknown>(this.defaultOf(key));
    const loading = signal(true);
    const error = signal<unknown>(undefined);
    const stored = state.asReadonly() as NbStoredSignal<T[K]>;
    const live: Live = { state, changed: false };
    this.states.set(stored as NbStoredSignal<unknown>, live);
    const write = (action: Promise<void>) =>
      action.then(
        () => error.set(undefined),
        (failure: unknown) => {
          error.set(failure);
          throw failure;
        },
      );
    const loaded = this.get(key).then(
      (value) => {
        if (!live.changed) {
          state.set(value);
        }
        return state() as T[K];
      },
      (failure: unknown) => {
        error.set(failure);
        return state() as T[K];
      },
    );
    void loaded.finally(() => loading.set(false));
    Object.assign(stored, {
      set: (value: T[K]) => write(this.set(key, value)),
      update: (change: (value: T[K]) => T[K]) => write(this.set(key, change(state() as T[K]))),
      remove: () => write(this.remove(key)),
      loading: loading.asReadonly(),
      error: error.asReadonly(),
      loaded,
    });
    return stored;
  }

  // Sets a live signal's value, from a change here or in another tab.
  protected apply(key: string, value: unknown) {
    const stored = this.live.get(key)?.deref();
    const live = stored && this.states.get(stored);
    if (live) {
      live.changed = true;
      live.state.set(value);
    }
  }

  protected receive(message: Message) {
    if ('cleared' in message) {
      for (const [key] of this.live) {
        this.apply(key, this.defaultOf(key as keyof T & string));
      }
      this.changes$.next({ cleared: true, remote: true });
      return;
    }
    const key = message.key as keyof T & string;
    const value = message.removed ? this.defaultOf(key) : (message.value as T[typeof key]);
    this.apply(key, value);
    this.changes$.next({ key, value, removed: !!message.removed, remote: true } as NbStorageChange<T>);
  }

  protected post(message: Message) {
    try {
      this.channel?.postMessage(message);
    } catch {
      // A value BroadcastChannel can't clone is still stored; other tabs read it when they next load it.
    }
  }

  protected defaultOf<K extends keyof T>(key: K): T[K] {
    // Each key's default, required where its value can't be undefined; the mapped type hides that from indexing.
    const defaults: Partial<T> = this.options.defaults as unknown as Partial<T>;
    return defaults[key] as T[K];
  }
}

/** What `declareStorage` gives: the providers, a token for the storage, and its keys' signals. */
export interface NbStorageDeclaration<T> {
  readonly name: string;
  /** The storage, typed by its key map: `inject(appState.token)`. */
  readonly token: InjectionToken<NbStorage<T>>;
  /** Provides the storage, e.g. in the app's providers or a lazy route's. */
  readonly providers: EnvironmentProviders;
  /**
   * A key's shared signal, in an injection context: `readonly themes = appState.signal('customThemes')`. It isn't a
   * token, which the injector would keep for good; the signal is released once nothing holds it.
   */
  signal<K extends keyof T & string>(key: K): NbStoredSignal<T[K]>;
}

/**
 * Declares a storage of typed values, kept in IndexedDB (so a web worker can open them too), and in step across tabs.
 * An app can have several, e.g. one for its state and one for an API cache:
 *
 * ```ts
 * interface AppState {
 *   sidebarOpen: boolean;
 *   customThemes: ThemeDraft[];
 *   lastSearch?: string;
 * }
 *
 * export const appState = declareStorage<AppState>('app-state', {
 *   defaults: { sidebarOpen: true, customThemes: [] },
 *   migrate: { customThemes: (stored) => (stored as ThemeDraft[]).map(withNewFields) },
 * });
 *
 * // app.config.ts
 * providers: [appState.providers]
 *
 * // a component
 * readonly themes = appState.signal('customThemes');
 * save(draft: ThemeDraft) {
 *   void this.themes.update((themes) => [...themes, draft]);
 * }
 * ```
 */
export function declareStorage<T>(name: string, options: NbStorageOptions<T>): NbStorageDeclaration<T> {
  const token = new InjectionToken<NbStorage<T>>(`NbStorage ${name}`);
  return {
    name,
    token,
    providers: makeEnvironmentProviders([
      {
        provide: token,
        useFactory: () => {
          const browser = isPlatformBrowser(inject(PLATFORM_ID));
          // On the server, nothing is kept, so each request renders the defaults.
          const fallback = typeof indexedDB !== 'undefined' ? new NbIndexedDbStore(name) : new NbMemoryStore();
          const backend = options.backend?.(name) ?? (browser ? fallback : new NbNoStore());
          const channel =
            browser && typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(`nb-storage-${name}`) : undefined;
          const storage = new NbStorage<T>(name, options, backend, channel);
          inject(DestroyRef).onDestroy(() => storage.destroy());
          return storage;
        },
      },
    ]),
    signal: (key) => inject(token).signal(key),
  };
}
