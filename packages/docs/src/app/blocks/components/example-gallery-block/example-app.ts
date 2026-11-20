import type { NbComponentDefaults } from '@liquid-js/lyr-core';

/**
 * A theme made for one example: a base theme and what it changes, as the theme editor's themes are. Customising the
 * example starts a theme from it; the theme editor doesn't list it.
 */
export interface NgdExampleTheme {
  id: string;
  name: string;
  base: string;
  /** The 500 shade of the statuses it changes. */
  colors?: Partial<Record<'primary' | 'success' | 'info' | 'warning' | 'danger', string>>;
  fontPrimary?: string;
  fontSecondary?: string;
  /** In rem. */
  radius?: number;
  textScale?: number;
  defaults?: NbComponentDefaults;
  /** Any other theme variables it sets, by name, as CSS values, e.g. `var(--color-basic-100)`. */
  variables?: Record<string, string>;
  /** The Google Fonts families its fonts come from, as the API's family specs, e.g. `Fraunces:ital,wght@0,400;1,400`. */
  fonts?: string[];
}

/** A screen of an example app: a playground page by its example id, and the files to show as its code. */
export interface NgdExampleScreen {
  id: string;
  title: string;
  /** What the app itself would call the page, in its title, when its title doesn't say, e.g. Book an appointment. */
  pageTitle?: string;
  files: string[];
}

/**
 * An example app: its screens, the theme it looks best in, which the gallery's pictures show and it opens with, and the
 * devices it's made for, the first of which the gallery shows it on. A showcase app has a theme of its own and shows
 * what Lyra can look like; the theme editor previews only the others.
 */
export interface NgdExampleApp {
  id: string;
  name: string;
  /** The made-up company or product the app is for, as it names itself, e.g. Acme Hub; its pages' titles use it. */
  brand: string;
  summary: string;
  /** One of Lyra's themes by its name, or the app's own. */
  theme: string | NgdExampleTheme;
  showcase?: boolean;
  devices: ['laptop' | 'phone', ...('laptop' | 'phone')[]];
  screens: NgdExampleScreen[];
  /** Files every screen uses, e.g. the app's frame, shown after the screen's own. */
  files: string[];
}

/** A component's files, by its path without the extension. */
export const component = (path: string, ...extensions: string[]) => extensions.map((extension) => `${path}.${extension}`);
/** A component's TypeScript, template and styles, by its path without the extension. */
export const all = (path: string) => component(path, 'ts', 'html', 'scss');
