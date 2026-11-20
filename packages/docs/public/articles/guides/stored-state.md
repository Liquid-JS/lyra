# Stored State

`declareStorage` keeps an app's state, a cache or settings in IndexedDB, and in step across the app's tabs. Values are
whatever IndexedDB keeps (objects, arrays, `Date`s, `Blob`s), and a web worker can open the same database.

## Declare a storage

A storage has a name and a key map: an interface of its keys and their values. An app can have several, e.g. one for its
state and one for an API cache. The name is the IndexedDB database's, `nb-storage-<name>`.

```ts
import { declareStorage } from '@liquid-js/lyr-core';

interface AppState {
  sidebarOpen: boolean;
  customThemes: ThemeDraft[];
  lastSearch?: string;
}

export const appState = declareStorage<AppState>('app-state', {
  defaults: { sidebarOpen: true, customThemes: [] },
});
```

A key whose value can't be `undefined` needs a default, which its signal has until the stored value loads; optional keys
can do without.

Then provide it, in the app's providers or a lazy route's:

```ts
bootstrapApplication(AppComponent, {
  providers: [appState.providers],
});
```

## Read and write a key

`signal(key)` gives a key's value as a signal, in an injection context. Everything that asks for the key while it's in
use shares one signal, which is released once nothing holds it.

```ts
@Component({
  template: `
    @for (theme of themes(); track theme.name) {
      <p>{{ theme.name }}</p>
    }
  `,
})
export class ThemeListComponent {
  readonly themes = appState.signal('customThemes');

  save(draft: ThemeDraft) {
    void this.themes.update((themes) => [...themes, draft]);
  }
}
```

The signal starts with the key's default and takes the stored value once it loads; `loading()` says whether it's still
loading, and `loaded` resolves with the value. `set` and `update` change the value at once and resolve once it's stored,
so `error()` holds the last failure, e.g. a full or unavailable IndexedDB. `remove()` gives the key its default again.

## The whole storage

`inject(appState.token)` gives the storage itself, typed by its key map: `get`, `set` and `remove` a key, list its
`keys()`, `clear()` it, or follow its `changes`, from this tab and the others.

```ts
const storage = inject(appState.token);
const search = await storage.get('lastSearch');
storage.changes.subscribe((change) => console.log(change));
```

## Other tabs

A change is stored first, then the other tabs hear of it over a `BroadcastChannel` and update their signals, without
writing it again. When two tabs change a key at once, the last write wins.

## Older stored values

What an older version of the app stored may not have the shape the current one expects. `migrate` turns it into the
current shape as it loads, e.g. adding fields a newer version has:

```ts
export const appState = declareStorage<AppState>('app-state', {
  defaults: { sidebarOpen: true, customThemes: [] },
  migrate: {
    customThemes: (stored) => (stored as ThemeDraft[]).map((theme) => ({ radius: '0.25rem', ...theme })),
  },
});
```

## On the server and in workers

On the server, stored signals work but nothing is kept: each request renders with the defaults, and a value set while
it renders lasts only in its signal. In a browser without IndexedDB, values are kept in memory for as long as the page
is open. `backend` swaps in another store.

A web worker reads and writes the same values with `NbIndexedDbStore`, which has no Angular dependency:

```ts
import { NbIndexedDbStore } from '@liquid-js/lyr-core';

const store = new NbIndexedDbStore('app-state');
const themes = await store.get('customThemes');
```

Open tabs hear of a worker's change when it posts it on the storage's channel, as the tabs do:

```ts
await store.set('lastSearch', 'shoes');
new BroadcastChannel('nb-storage-app-state').postMessage({ key: 'lastSearch', value: 'shoes' });
```
