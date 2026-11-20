import { createEnvironmentInjector, EnvironmentInjector, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  declareStorage,
  NbIndexedDbStore,
  NbMemoryStore,
  NbStorageChange,
  nbStoreDatabaseName,
} from '@liquid-js/lyr-core';

interface Draft {
  name: string;
  primary: string;
  radius?: string;
}

interface State {
  sidebarOpen: boolean;
  drafts: Draft[];
  lastSearch?: string;
}

const deleteDatabase = (name: string) =>
  new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(nbStoreDatabaseName(name));
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  });

const tick = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('declareStorage', () => {
  let name: string;
  const injectors = new Array<EnvironmentInjector>();

  // A storage of its own, as another tab would have, sharing the database and the channel.
  const open = (options: Partial<Parameters<typeof declareStorage<State>>[1]> = {}) => {
    const declaration = declareStorage<State>(name, { defaults: { sidebarOpen: true, drafts: [] }, ...options });
    const injector = createEnvironmentInjector([declaration.providers], TestBed.inject(EnvironmentInjector));
    injectors.push(injector);
    return { declaration, injector, storage: injector.get(declaration.token) };
  };

  beforeEach(() => {
    name = `spec-${Math.random().toString(36).slice(2)}`;
  });

  afterEach(async () => {
    // As an app closes: each storage stops following the others and closes its database.
    injectors.splice(0).forEach((injector) => injector.destroy());
    await tick();
    await deleteDatabase(name);
  });

  it('should start a signal with its default, then load the stored value', async () => {
    const first = open().storage;
    await first.set('drafts', [{ name: 'Ocean', primary: '#0077be' }]);

    const drafts = open().storage.signal('drafts');
    expect(drafts()).toEqual([]);
    expect(drafts.loading()).toBe(true);
    // Real JavaScript values, as stored, not strings.
    expect(await drafts.loaded).toEqual([{ name: 'Ocean', primary: '#0077be' }]);
    expect(drafts()).toEqual([{ name: 'Ocean', primary: '#0077be' }]);
    expect(drafts.loading()).toBe(false);
  });

  it('should give everything that asks for a key the same signal', () => {
    const { declaration, injector, storage } = open();
    const fromStorage = storage.signal('sidebarOpen');
    const fromDeclaration = runInInjectionContext(injector, () => declaration.signal('sidebarOpen'));
    expect(fromDeclaration).toBe(fromStorage);
  });

  it('should keep a value set while the stored one loads', async () => {
    await open().storage.set('lastSearch', 'stored');
    const search = open().storage.signal('lastSearch');
    void search.set('typed');

    await search.loaded;
    expect(search()).toBe('typed');
  });

  it('should migrate what an older version stored as it loads', async () => {
    await open().storage.set('drafts', [{ name: 'Old', primary: '#000' }]);

    const { storage } = open({
      migrate: { drafts: (stored) => (stored as Draft[]).map((draft) => ({ radius: '0.25rem', ...draft })) },
    });
    expect(await storage.get('drafts')).toEqual([{ name: 'Old', primary: '#000', radius: '0.25rem' }]);
  });

  it("should follow another tab's changes without writing them again", async () => {
    const here = open().storage;
    const there = open().storage;
    const open$ = here.signal('sidebarOpen');
    await open$.loaded;
    const changes = new Array<NbStorageChange<State>>();
    here.changes.subscribe((change) => changes.push(change));

    await there.signal('sidebarOpen').set(false);
    await tick();
    expect(open$()).toBe(false);
    expect(changes).toEqual([{ key: 'sidebarOpen', value: false, removed: false, remote: true }]);

    await there.remove('sidebarOpen');
    await tick();
    expect(open$()).toBe(true);
  });

  it('should go back to the defaults when a key is removed or the storage cleared', async () => {
    const { storage } = open();
    const search = storage.signal('lastSearch');
    await search.set('shoes');
    expect(await storage.keys()).toEqual(['lastSearch']);

    await search.remove();
    expect(search()).toBeUndefined();
    expect(await storage.keys()).toEqual([]);

    await storage.set('sidebarOpen', false);
    await storage.clear();
    expect(storage.signal('sidebarOpen')()).toBe(true);
    expect(await storage.keys()).toEqual([]);
  });

  it('should keep values in memory with another backend, e.g. on the server', async () => {
    const backend = new NbMemoryStore();
    const { storage } = open({ backend: () => backend });
    await storage.set('lastSearch', 'shoes');
    expect(await backend.get('lastSearch')).toBe('shoes');
    expect(await new NbIndexedDbStore(name).keys()).toEqual([]);
  });

  it('should work on the server without keeping anything, so each request starts from the defaults', async () => {
    const declaration = declareStorage<State>(name, { defaults: { sidebarOpen: true, drafts: [] } });
    const request = () =>
      createEnvironmentInjector(
        [{ provide: PLATFORM_ID, useValue: 'server' }, declaration.providers],
        TestBed.inject(EnvironmentInjector),
      );
    const first = request();
    injectors.push(first);
    const sidebar = first.get(declaration.token).signal('sidebarOpen');
    await sidebar.set(false);
    expect(sidebar()).toBe(false);

    const second = request();
    injectors.push(second);
    expect(await second.get(declaration.token).signal('sidebarOpen').loaded).toBe(true);
    expect(await new NbIndexedDbStore(name).keys()).toEqual([]);
  });

  it('should report a failure to store, and keep the value it was set to', async () => {
    const backend = new NbMemoryStore();
    backend.set = () => Promise.reject(new Error('Quota exceeded'));
    const search = open({ backend: () => backend }).storage.signal('lastSearch');

    await expect(search.set('shoes')).rejects.toThrow('Quota exceeded');
    expect(search()).toBe('shoes');
    expect(search.error()).toEqual(new Error('Quota exceeded'));
  });
});
