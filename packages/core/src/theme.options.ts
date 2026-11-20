import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { NbMediaBreakpoint } from './services/breakpoints.service';
import { NbJSThemeOptions } from './services/js-themes/theme.options';
import { DEFAULT_THEME } from './services/js-themes/default.theme';
import { COSMIC_THEME } from './services/js-themes/cosmic.theme';
import { CORPORATE_THEME } from './services/js-themes/corporate.theme';
import { DARK_THEME } from './services/js-themes/dark.theme';
import { MATERIAL_DARK_THEME } from './services/js-themes/material-dark.theme';
import { MATERIAL_LIGHT_THEME } from './services/js-themes/material-light.theme';

/** A theme of the app, with what it's for, so the system's preferences can pick it and `nb-theme-select` offer it. */
export interface NbThemeDescription {
  /** The theme's name, as registered with `nb-register-theme`. */
  name: string;
  /** Its colour scheme, matched with the system's `prefers-color-scheme`. */
  scheme?: 'light' | 'dark';
  /** Its contrast, matched with the system's `prefers-contrast`: `more` for a high-contrast theme. */
  contrast?: 'more' | 'less';
  /** Names it in `nb-theme-select`; the name with a capital otherwise. */
  label?: string;
}

export interface NbThemeOptions {
  /** The theme to start with, and to fall back on when no declared theme fits the system's preferences. */
  name: string;
  /**
   * The app's themes: with nothing chosen, the one that fits the system's colour scheme and contrast is used, shown
   * as "System" in `nb-theme-select`.
   */
  themes?: NbThemeDescription[];
  /**
   * Remembers the theme and content size the user chooses, in `NB_PREFERENCE_STORAGE` (`localStorage` by default),
   * under keys starting with `key` (`nb` by default).
   */
  preferences?: boolean | { key?: string };
}

/**
 * Where the user's theme and content size are kept: `localStorage` by default. Provide your own, e.g. to keep them in
 * the user's profile on a server; its methods may return promises.
 */
export interface NbPreferenceStorage {
  /** The kept value; `null` or `undefined` when there's none, as `Storage.getItem` gives it. */
  get(key: string): string | null | undefined | Promise<string | null | undefined>;
  /** Keeps a value; `null` clears it, like `Storage.removeItem`. */
  set(key: string, value: string | null): void | Promise<void>;
}

/** Keeps preferences in `localStorage`, where it's available. @internal */
export function nbLocalPreferenceStorage(): NbPreferenceStorage {
  const storage = (): Storage | undefined => {
    try {
      return isPlatformBrowser(inject(PLATFORM_ID)) ? globalThis.localStorage : undefined;
    } catch {
      return undefined;
    }
  };
  const local = storage();
  return {
    get: (key) => {
      try {
        return local?.getItem(key);
      } catch {
        return undefined;
      }
    },
    set: (key, value) => {
      try {
        if (value === null) {
          local?.removeItem(key);
        } else {
          local?.setItem(key, value);
        }
      } catch {
        // Storage that's full or blocked keeps nothing.
      }
    },
  };
}

export const NB_PREFERENCE_STORAGE = new InjectionToken<NbPreferenceStorage>('Lyra Preference Storage', {
  factory: nbLocalPreferenceStorage,
});

export const DEFAULT_MEDIA_BREAKPOINTS: NbMediaBreakpoint[] = [
  {
    name: 'xs',
    width: 0,
  },
  {
    name: 'is',
    width: 400,
  },
  {
    name: 'sm',
    width: 576,
  },
  {
    name: 'md',
    width: 768,
  },
  {
    name: 'lg',
    width: 992,
  },
  {
    name: 'xl',
    width: 1200,
  },
  {
    name: 'xxl',
    width: 1400,
  },
  {
    name: 'xxxl',
    width: 1600,
  },
];

export const BUILT_IN_THEMES: NbJSThemeOptions[] = [
  DEFAULT_THEME,
  COSMIC_THEME,
  CORPORATE_THEME,
  DARK_THEME,
  MATERIAL_LIGHT_THEME,
  MATERIAL_DARK_THEME,
];

// The defaults apply when `provideNbTheme()` doesn't set a value, so the theme services work without it.
export const NB_THEME_OPTIONS = new InjectionToken<NbThemeOptions>('Lyra Theme Options', {
  factory: () => ({ name: 'default' }),
});
export const NB_MEDIA_BREAKPOINTS = new InjectionToken<NbMediaBreakpoint[]>('Lyra Media Breakpoints', {
  factory: () => DEFAULT_MEDIA_BREAKPOINTS,
});
export const NB_BUILT_IN_JS_THEMES = new InjectionToken<NbJSThemeOptions[]>('Lyra Built-in JS Themes', {
  factory: () => BUILT_IN_THEMES,
});
export const NB_JS_THEMES = new InjectionToken<NbJSThemeOptions[]>('Lyra JS Themes', { factory: () => [] });

/**
 * The browser's window, as a token so tests can replace it. It's `undefined` outside the browser (e.g. when
 * rendering on the server), so code that uses it checks for it; a server app can provide a window of its own.
 */
export const NB_WINDOW = new InjectionToken<(Window & typeof globalThis) | undefined>('Window', {
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? window : undefined),
});
export const NB_DOCUMENT = new InjectionToken<Document>('Document', { factory: () => inject(DOCUMENT) });
