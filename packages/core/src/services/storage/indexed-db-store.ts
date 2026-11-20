/** The values of a store: real JavaScript values, as IndexedDB keeps them (structured clone). */
export interface NbStoreBackend {
  get(key: string): Promise<unknown>;
  has(key: string): Promise<boolean>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  keys(): Promise<string[]>;
  clear(): Promise<void>;
  /** Lets go of the backend's resources, e.g. its database connection. */
  close?(): Promise<void>;
}

const OBJECT_STORE = 'values';

/** The IndexedDB database of a store, `nb-storage-<name>`, which a web worker can open as well. */
export function nbStoreDatabaseName(name: string): string {
  return `nb-storage-${name}`;
}

const promise = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

/**
 * A store in IndexedDB: one database per store name, holding its values by key. It has no Angular dependency, so a web
 * worker can read and write the values an app keeps with `declareStorage`.
 */
export class NbIndexedDbStore implements NbStoreBackend {
  protected readonly db: Promise<IDBDatabase>;

  constructor(name: string, factory: IDBFactory = indexedDB) {
    this.db = new Promise((resolve, reject) => {
      const request = factory.open(nbStoreDatabaseName(name), 1);
      request.onupgradeneeded = () => request.result.createObjectStore(OBJECT_STORE);
      request.onsuccess = () => {
        // Another tab's newer version of the database asks this one to let go.
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error(`The ${nbStoreDatabaseName(name)} database is open in an older version`));
    });
  }

  async get(key: string): Promise<unknown> {
    return promise((await this.store('readonly')).get(key));
  }

  async has(key: string): Promise<boolean> {
    return (await promise((await this.store('readonly')).count(key))) > 0;
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.write((store) => store.put(value, key));
  }

  async delete(key: string): Promise<void> {
    await this.write((store) => store.delete(key));
  }

  async keys(): Promise<string[]> {
    const keys = await promise((await this.store('readonly')).getAllKeys());
    return keys.map(String);
  }

  async clear(): Promise<void> {
    await this.write((store) => store.clear());
  }

  /** Closes the database; the store can't be used after. */
  async close(): Promise<void> {
    (await this.db).close();
  }

  protected async store(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    return (await this.db).transaction(OBJECT_STORE, mode).objectStore(OBJECT_STORE);
  }

  // Resolves once the transaction commits, so a value is in the database before other tabs hear of it.
  protected async write(change: (store: IDBObjectStore) => void): Promise<void> {
    const transaction = (await this.db).transaction(OBJECT_STORE, 'readwrite');
    change(transaction.objectStore(OBJECT_STORE));
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error ?? new Error('The write was aborted'));
    });
  }
}

/** A store that keeps nothing, used on the server: each request starts from the defaults, and nothing is written. */
export class NbNoStore implements NbStoreBackend {
  async get(): Promise<unknown> {
    return undefined;
  }

  async has(): Promise<boolean> {
    return false;
  }

  async set(): Promise<void> {}

  async delete(): Promise<void> {}

  async keys(): Promise<string[]> {
    return [];
  }

  async clear(): Promise<void> {}
}

/** A store in memory, for a browser without IndexedDB. Values last as long as the page does. */
export class NbMemoryStore implements NbStoreBackend {
  protected readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> {
    return this.values.get(key);
  }

  async has(key: string): Promise<boolean> {
    return this.values.has(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.values.delete(key);
  }

  async keys(): Promise<string[]> {
    return [...this.values.keys()];
  }

  async clear(): Promise<void> {
    this.values.clear();
  }
}
