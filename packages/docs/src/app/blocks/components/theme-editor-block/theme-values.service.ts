import { computed, inject, PendingTasks, Service, signal } from '@angular/core';

import { NGD_DATA_LOADER } from '../../../docs-data';
import { NgdThemeValues, NgdThemeValuesFile } from '../../../docs.model';

/**
 * The base themes' resolved values, loaded from `theme-values/<name>.json` when a theme starts from one of them, and
 * kept: a theme's file is a few hundred kilobytes, so the app doesn't carry all of them from the start.
 */
@Service()
export class NgdThemeValuesService {
  private readonly load = inject(NGD_DATA_LOADER);
  private readonly tasks = inject(PendingTasks);
  private readonly themes = signal<Record<string, NgdThemeValues>>({});
  private readonly pending = new Map<string, Promise<void>>();

  /** The theme's values, once they're loaded; none until then, so what reads them follows the loading. */
  valuesOf(name: string): NgdThemeValues {
    return this.themes()[name] ?? {};
  }

  /** Whether a theme's values are loaded. */
  readonly has = computed(() => {
    const themes = this.themes();
    return (name: string) => name in themes;
  });

  /** Loads the themes' values, unless they are already; a prerendered page waits for them. */
  async loadThemes(...names: string[]): Promise<void> {
    await Promise.all(names.map((name) => this.loadTheme(name)));
  }

  private loadTheme(name: string): Promise<void> {
    if (name in this.themes()) {
      return Promise.resolve();
    }
    let pending = this.pending.get(name);
    if (!pending) {
      // A prerendered page waits for it, as for anything the app has pending.
      const done = this.tasks.add();
      pending = this.load<NgdThemeValuesFile>(`theme-values/${name}.json`)
        .then((file) => this.themes.update((themes) => ({ ...themes, [name]: file.data })))
        .finally(done);
      this.pending.set(name, pending);
    }
    return pending;
  }
}
