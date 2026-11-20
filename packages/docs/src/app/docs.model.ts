import type { Observable } from 'rxjs';
import type { NgdMdSection } from './@theme/services/text.service';

/**
 * The API docs and themes `yarn docs:prepare` writes to `output.json` (see scripts/docs), the docs structure
 * (src/structure.ts) and what the structure service prepares from both.
 */

export interface NgdDocMember {
  name: string;
  isDocsPrivate?: boolean;
  inherited?: string;
  shortDescription?: string;
  description?: string;
}

export interface NgdDocProp extends NgdDocMember {
  kind: 'input' | 'output' | 'property';
  type: string;
  isStatic: boolean;
}

export interface NgdDocParam {
  name: string;
  type: string;
  shortDescription: string;
  description: string;
}

export interface NgdDocMethod extends NgdDocMember {
  params: NgdDocParam[];
  type: (string | null)[];
  isStatic: boolean;
}

export interface NgdDocStyle {
  shortDescription: string;
  /** Each variable with its value in the default theme and the variable it follows there, from `docs:prepare`. */
  styles: { name: string; description: string; value?: string; parent?: string }[];
}

export interface NgdExampleContent {
  name: string;
  id: string;
  firstLine?: number;
  lastLine?: number;
  /** The example's source files; `yarn docs:prepare` resolves them for every example. */
  files: string[];
}

export interface NgdTextNode {
  type: 'text';
  content: string;
}

export interface NgdExampleNode {
  type: 'inline-example' | 'live-example' | 'stacked-example' | 'additional-example';
  content: NgdExampleContent;
}

export type NgdOverviewNode = NgdTextNode | NgdExampleNode;

export interface NgdDocClass {
  kind: 'component' | 'directive' | 'service' | 'class' | 'interface';
  name: string;
  description: string;
  shortDescription: string;
  props: NgdDocProp[];
  methods: NgdDocMethod[];
  styles: NgdDocStyle[];
  liveExamples: NgdExampleNode[];
  overview: NgdOverviewNode[];
}

export interface NgdThemePropLink {
  theme: string;
  prop: string;
}

export interface NgdThemeProp {
  name: string;
  value: unknown;
  parents: NgdThemePropLink[];
  childs: NgdThemePropLink[];
}

export interface NgdTheme {
  name: string;
  parent: string | null;
  data: Record<string, NgdThemeProp>;
}

export interface NgdDocs {
  classes: NgdDocClass[];
  themes: Record<string, NgdTheme>;
}

/** A base theme's resolved value of a variable, and the variable it follows, if any. */
export interface NgdThemeValue {
  value: unknown;
  parent?: string;
}

/** A base theme's resolved values, by variable: `theme-values/<name>.json`, loaded when a theme starts from it. */
export type NgdThemeValues = Record<string, NgdThemeValue>;

/** The file `docs:prepare` writes for a base theme. */
export interface NgdThemeValuesFile {
  name: string;
  parent: string | null;
  data: NgdThemeValues;
}

export type NgdTabs = Record<string, boolean>;

/*
 * The docs structure as src/structure.ts writes it: areas (the header's top sections, each with its own sidebar) hold
 * pages, tabs pages and menu groups, and sections where nesting means something (e.g. the CDK); sections hold pages,
 * tabs pages and menu groups, pages hold blocks.
 */

/** A top section of the docs, at `/<path>`, with its own sidebar. */
export interface NgdAreaEntry {
  type: 'area';
  name: string;
  /** The URL segment, e.g. `components`. */
  path: string;
  children: NgdAreaChildEntry[];
}

/** A page at `/<area>/<page>`, a menu group heading, or a section whose pages are at `/<area>/<section>/<page>`. */
export type NgdAreaChildEntry = NgdSectionEntry | NgdSectionChildEntry;

export interface NgdSectionEntry {
  type: 'section';
  name: string;
  children: NgdSectionChildEntry[];
}

export type NgdSectionChildEntry = NgdPageEntry | NgdTabsEntry | NgdGroupEntry;

export interface NgdPageEntry {
  type: 'page';
  name: string;
  /** What the page is, for search engines and link previews; an article's first paragraph otherwise. */
  description?: string;
  /**
   * What the page's table of contents lists: its sections, each card's title, by default; with `headings`, an article's
   * `h2` headings, for one that is a single card under its title.
   */
  toc?: 'headings';
  children: NgdBlockEntry[];
}

/** A component page with overview, API, theme and examples tabs. */
export interface NgdTabsEntry {
  type: 'tabs';
  name: string;
  icon: string;
  /** The names of the documented classes. */
  source: string[];
}

/** A heading between the menu's pages. */
export interface NgdGroupEntry {
  type: 'group';
  name: string;
}

export type NgdBlockEntry =
  /** `source` is an article's path under public/articles. */
  | { type: 'block'; block: 'markdown'; source: string }
  /** `source` is a documented class name. */
  | { type: 'block'; block: 'component'; source: string }
  /** `source` is a theme name. */
  | { type: 'block'; block: 'theme'; name?: string; source: string }
  | { type: 'block'; block: 'components-overview' | 'icons' | 'theme-editor' | 'example-gallery' };

export type NgdStructureEntry = NgdSectionEntry | NgdSectionChildEntry | NgdBlockEntry;

/* The structure the structure service prepares from it. */

/** A documented class with its slag and its overview's text split into markdown sections. */
export interface NgdPreparedComponent extends Omit<NgdDocClass, 'overview'> {
  slag: string;
  overview: NgdPreparedOverviewNode[];
}

export type NgdPreparedOverviewNode = { type: 'text'; content: NgdMdSection[] } | NgdExampleNode;

export interface NgdPreparedArea {
  type: 'area';
  name: string;
  path: string;
  children: NgdPreparedAreaChild[];
}

export type NgdPreparedAreaChild = NgdPreparedSection | NgdPreparedSectionChild;

export interface NgdPreparedSection {
  type: 'section';
  name: string;
  children: NgdPreparedSectionChild[];
}

export type NgdPreparedSectionChild = NgdPreparedPage | NgdPreparedTabs | NgdGroupEntry;

export interface NgdPreparedPage {
  type: 'page';
  name: string;
  description?: string;
  toc?: 'headings';
  slag: string;
  children: NgdPreparedBlock[];
}

export interface NgdPreparedTabs {
  type: 'tabs';
  name: string;
  icon: string;
  slag: string;
  source: NgdPreparedComponent[];
  tabs: NgdTabs;
  /** A tabbed block emulated from the source. */
  children: [NgdTabbedBlock];
}

export interface NgdMarkdownBlock {
  type: 'block';
  block: 'markdown';
  source: string;
  sections: Observable<NgdMdSection[]>;
}

export interface NgdComponentBlock {
  type: 'block';
  block: 'component';
  source: NgdPreparedComponent;
}

export interface NgdThemeBlock {
  type: 'block';
  block: 'theme';
  name?: string;
  source: NgdTheme;
}

export interface NgdTabbedBlock {
  type: 'block';
  block: 'tabbed';
  children: NgdPreparedComponent[];
}

export type NgdPreparedBlock =
  | NgdMarkdownBlock
  | NgdComponentBlock
  | NgdThemeBlock
  | NgdTabbedBlock
  | { type: 'block'; block: 'components-overview' | 'icons' | 'theme-editor' | 'example-gallery' };

/** A page the router opens. */
export type NgdPreparedPageEntry = NgdPreparedPage | NgdPreparedTabs;

/** An entry the menu and the pagination list. */
export type NgdPreparedMenuEntry = NgdPreparedSection | NgdPreparedSectionChild;

export type NgdPreparedEntry = NgdPreparedMenuEntry | NgdPreparedBlock;
