import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core';

/** @internal */
declare const $localize: NbLocalize;

/**
 * The texts of the markdown viewer. `provideNbTexts({ markdownViewer: { ... } })` changes them, and they're translated
 * with Angular's i18n, as `$localize` messages with ids like `@@nb.markdownViewer.footnotes`.
 */
export interface NbMarkdownViewerTexts {
  /** Names the footnotes at the end of the text. */
  footnotes: string;
  /** Names the link at the end of a footnote back to where the text refers to it. */
  backToText: string;
}

declare module '@liquid-js/lyr-core' {
  interface NbTexts {
    markdownViewer: NbMarkdownViewerTexts;
  }
}

/** @internal */
export function injectNbMarkdownViewerTexts() {
  return injectNbTexts('markdownViewer', () => ({
    footnotes: $localize`:@@nb.markdownViewer.footnotes:Footnotes`,
    backToText: $localize`:@@nb.markdownViewer.backToText:Back to the text`,
  }));
}
