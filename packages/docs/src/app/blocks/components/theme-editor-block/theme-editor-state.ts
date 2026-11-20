import { declareStorage, NbComponentDefaults } from '@liquid-js/lyr-core';

import { EXAMPLE_APPS } from '../example-gallery-block/example-apps';

export const THEME_STATUSES = ['primary', 'success', 'info', 'warning', 'danger'] as const;
export type NgdThemeStatus = (typeof THEME_STATUSES)[number];

export const BASE_THEMES = ['default', 'dark', 'cosmic', 'corporate', 'material-light', 'material-dark'] as const;

/** A screen the preview shows the theme on: a playground page by its example id, and the devices it's shown on. */
export interface NgdPreviewScreen {
  id: string;
  title: string;
  group: string;
  devices: 'both' | 'laptop' | 'phone';
}

/** The screens the preview shows the theme on: a sheet of components, and the example apps' but the showcase's. */
export const PREVIEW_SCREENS: NgdPreviewScreen[] = [
  { id: 'theme-editor/theme-editor-preview.component', title: 'Components', group: 'Components', devices: 'laptop' },
  // Each control in every status and state, from the theme's own styles.
  { id: 'theme-editor/theme-editor-states.component', title: 'States', group: 'Components', devices: 'laptop' },
  ...EXAMPLE_APPS.filter(({ showcase }) => !showcase).flatMap(({ name, devices, screens }) =>
    screens.map(({ id, title }) => ({
      id,
      title,
      group: name,
      devices: devices.length > 1 ? ('both' as const) : devices[0],
    })),
  ),
];

/** A theme the editor keeps: what differs from its base theme. */
export interface NgdThemeDraft {
  id: string;
  name: string;
  base: string;
  /** The 500 shade of each status; the others are generated from it. */
  colors: Record<NgdThemeStatus, string>;
  /**
   * The basic colour, the greys' 600 shade, which tints the others; none keeps the base theme's greys. The backgrounds,
   * borders and text follow them.
   */
  basic?: string;
  fontPrimary: string;
  fontSecondary: string;
  /** In rem. */
  radius: number;
  /** The text sizes, as a share of the base theme's. */
  textScale: number;
  /** The components' default shape, size, appearance and icon style; none in themes saved before they could. */
  defaults?: NbComponentDefaults;
  /**
   * Theme variables set one by one, by name, as CSS values: the backgrounds and text colours the editor has controls
   * for, and others, e.g. a showcase's shadows, which it keeps and puts in the theme's code.
   */
  variables?: Record<string, string>;
  /** The Google Fonts families the fonts come from, as the API's family specs, loaded wherever the theme shows. */
  fonts?: string[];
}

/**
 * The theme being edited, with its unsaved changes: kept apart from the saved themes, so the editor and full-screen
 * examples edit the same one, and it survives a reload. `start` is how a theme that isn't saved yet started.
 */
export interface NgdWorkingTheme {
  draft: NgdThemeDraft;
  start?: NgdThemeDraft;
}

interface ThemeEditorState {
  drafts: NgdThemeDraft[];
  /** The theme being edited and its unsaved changes, if it has any or isn't saved yet. */
  working?: NgdWorkingTheme;
  /** The draft being edited, by id. */
  selected?: string;
  /** The screen the preview shows, by its id in `PREVIEW_SCREENS`. */
  screen?: string;
}

/** The editor's themes, kept in the browser and in step across the docs' tabs. */
export const themeEditorState = declareStorage<ThemeEditorState>('docs-theme-editor', {
  defaults: { drafts: [] },
});
