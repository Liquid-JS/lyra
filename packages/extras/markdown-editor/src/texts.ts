import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core';

/** @internal */
declare const $localize: NbLocalize;

/**
 * The texts of the markdown editor's toolbar, tabs and popups. `provideNbTexts({ markdownEditor: { ... } })` changes
 * them, and they're translated with Angular's i18n, as `$localize` messages with ids like
 * `@@nb.markdownEditor.bold`.
 */
export interface NbMarkdownEditorTexts {
  /** The markdown mode's tab. */
  markdown: string;
  /** The WYSIWYG mode's tab. */
  wysiwyg: string;
  /** The tab with the markdown, when the preview is a tab. */
  write: string;
  preview: string;
  /** The toolbar button that opens the headings. */
  headings: string;
  /** A level in the list of headings, given the level, e.g. "Heading 2". */
  headingLevel: (level: string) => string;
  paragraph: string;
  bold: string;
  italic: string;
  strike: string;
  code: string;
  line: string;
  blockquote: string;
  unorderedList: string;
  orderedList: string;
  task: string;
  indent: string;
  outdent: string;
  insertLink: string;
  insertCodeBlock: string;
  insertTable: string;
  insertImage: string;
  /** The toolbar button that writes the markdown in one style, with its shortcut. */
  format: string;
  /** The toolbar button that shows the items that don't fit. */
  more: string;
  /** Names the toolbar. */
  textFormatting: string;
  /** Describes the toolbar button whose format the text at the cursor has. */
  activeButton: string;
  autoScrollEnabled: string;
  autoScrollDisabled: string;

  imageUrl: string;
  selectImageFile: string;
  chooseFile: string;
  noFile: string;
  description: string;
  file: string;
  url: string;
  linkText: string;
  linkTextRequired: string;
  urlRequired: string;
  ok: string;
  cancel: string;
  edit: string;
  editLink: string;
  removeLink: string;
  editImage: string;
  removeImage: string;
  /** Asked when tabular text is pasted. */
  pasteAsTable: string;
  textColor: string;
  /** Edits the language of a code block. */
  chooseLanguage: string;

  addRowAbove: string;
  addRowBelow: string;
  addColumnLeft: string;
  addColumnRight: string;
  removeRow: string;
  removeColumn: string;
  alignColumnLeft: string;
  alignColumnCenter: string;
  alignColumnRight: string;
  removeTable: string;
}

declare module '@liquid-js/lyr-core' {
  interface NbTexts {
    markdownEditor: NbMarkdownEditorTexts;
  }
}

/** The editor's names of its texts; the Format button is the component's. */
const keys: Record<Exclude<keyof NbMarkdownEditorTexts, 'format'>, string> = {
  markdown: 'Markdown',
  wysiwyg: 'WYSIWYG',
  write: 'Write',
  preview: 'Preview',
  headings: 'Headings',
  headingLevel: 'Heading {level}',
  paragraph: 'Paragraph',
  bold: 'Bold',
  italic: 'Italic',
  strike: 'Strike',
  code: 'Code',
  line: 'Line',
  blockquote: 'Blockquote',
  unorderedList: 'Unordered list',
  orderedList: 'Ordered list',
  task: 'Task',
  indent: 'Indent',
  outdent: 'Outdent',
  insertLink: 'Insert link',
  insertCodeBlock: 'Insert CodeBlock',
  insertTable: 'Insert table',
  insertImage: 'Insert image',
  more: 'More',
  textFormatting: 'Text Formatting',
  activeButton: 'Active Button',
  autoScrollEnabled: 'Auto scroll enabled',
  autoScrollDisabled: 'Auto scroll disabled',
  imageUrl: 'Image URL',
  selectImageFile: 'Select image file',
  chooseFile: 'Choose a file',
  noFile: 'No file',
  description: 'Description',
  file: 'File',
  url: 'URL',
  linkText: 'Link text',
  linkTextRequired: 'Link text required',
  urlRequired: 'URL required',
  ok: 'OK',
  cancel: 'Cancel',
  edit: 'Edit',
  editLink: 'Edit link',
  removeLink: 'Remove link',
  editImage: 'Edit image',
  removeImage: 'Remove image',
  pasteAsTable: 'Would you like to paste as table?',
  textColor: 'Text color',
  chooseLanguage: 'Choose language',
  addRowAbove: 'Add row to up',
  addRowBelow: 'Add row to down',
  addColumnLeft: 'Add column to left',
  addColumnRight: 'Add column to right',
  removeRow: 'Remove row',
  removeColumn: 'Remove column',
  alignColumnLeft: 'Align column to left',
  alignColumnCenter: 'Align column to center',
  alignColumnRight: 'Align column to right',
  removeTable: 'Remove table',
};

/** The texts under the editor's names, to register as its language. @internal */
export function nbMarkdownEditorLanguage(texts: NbMarkdownEditorTexts): Record<string, string> {
  return Object.fromEntries(
    Object.entries(keys).map(([key, name]) => {
      const text = texts[key as keyof typeof keys];
      // The editor puts the level where `{level}` is.
      return [name, typeof text === 'function' ? text('{level}') : text];
    }),
  );
}

/** @internal */
export function injectNbMarkdownEditorTexts() {
  return injectNbTexts('markdownEditor', () => ({
    markdown: $localize`:@@nb.markdownEditor.markdown:Markdown`,
    wysiwyg: $localize`:@@nb.markdownEditor.wysiwyg:WYSIWYG`,
    write: $localize`:@@nb.markdownEditor.write:Write`,
    preview: $localize`:@@nb.markdownEditor.preview:Preview`,
    headings: $localize`:@@nb.markdownEditor.headings:Headings`,
    headingLevel: (level: string) => $localize`:@@nb.markdownEditor.headingLevel:Heading ${level}:level:`,
    paragraph: $localize`:@@nb.markdownEditor.paragraph:Paragraph`,
    bold: $localize`:@@nb.markdownEditor.bold:Bold`,
    italic: $localize`:@@nb.markdownEditor.italic:Italic`,
    strike: $localize`:@@nb.markdownEditor.strike:Strikethrough`,
    code: $localize`:@@nb.markdownEditor.code:Inline code`,
    line: $localize`:@@nb.markdownEditor.line:Horizontal line`,
    blockquote: $localize`:@@nb.markdownEditor.blockquote:Blockquote`,
    unorderedList: $localize`:@@nb.markdownEditor.unorderedList:Unordered list`,
    orderedList: $localize`:@@nb.markdownEditor.orderedList:Ordered list`,
    task: $localize`:@@nb.markdownEditor.task:Task list`,
    indent: $localize`:@@nb.markdownEditor.indent:Indent`,
    outdent: $localize`:@@nb.markdownEditor.outdent:Outdent`,
    insertLink: $localize`:@@nb.markdownEditor.insertLink:Insert link`,
    insertCodeBlock: $localize`:@@nb.markdownEditor.insertCodeBlock:Insert code block`,
    insertTable: $localize`:@@nb.markdownEditor.insertTable:Insert table`,
    insertImage: $localize`:@@nb.markdownEditor.insertImage:Insert image`,
    format: $localize`:@@nb.markdownEditor.format:Format (Shift+Alt+F)`,
    more: $localize`:@@nb.markdownEditor.more:More`,
    textFormatting: $localize`:@@nb.markdownEditor.textFormatting:Text formatting`,
    activeButton: $localize`:@@nb.markdownEditor.activeButton:Active`,
    autoScrollEnabled: $localize`:@@nb.markdownEditor.autoScrollEnabled:Auto scroll enabled`,
    autoScrollDisabled: $localize`:@@nb.markdownEditor.autoScrollDisabled:Auto scroll disabled`,

    imageUrl: $localize`:@@nb.markdownEditor.imageUrl:Image URL`,
    selectImageFile: $localize`:@@nb.markdownEditor.selectImageFile:Select image file`,
    chooseFile: $localize`:@@nb.markdownEditor.chooseFile:Choose a file`,
    noFile: $localize`:@@nb.markdownEditor.noFile:No file`,
    description: $localize`:@@nb.markdownEditor.description:Description`,
    file: $localize`:@@nb.markdownEditor.file:File`,
    url: $localize`:@@nb.markdownEditor.url:URL`,
    linkText: $localize`:@@nb.markdownEditor.linkText:Link text`,
    linkTextRequired: $localize`:@@nb.markdownEditor.linkTextRequired:The field "Link text" is required`,
    urlRequired: $localize`:@@nb.markdownEditor.urlRequired:The field "URL" is required`,
    ok: $localize`:@@nb.markdownEditor.ok:OK`,
    cancel: $localize`:@@nb.markdownEditor.cancel:Cancel`,
    edit: $localize`:@@nb.markdownEditor.edit:Edit`,
    editLink: $localize`:@@nb.markdownEditor.editLink:Edit link`,
    removeLink: $localize`:@@nb.markdownEditor.removeLink:Remove link`,
    editImage: $localize`:@@nb.markdownEditor.editImage:Edit image`,
    removeImage: $localize`:@@nb.markdownEditor.removeImage:Remove image`,
    pasteAsTable: $localize`:@@nb.markdownEditor.pasteAsTable:Paste as a table?`,
    textColor: $localize`:@@nb.markdownEditor.textColor:Text color`,
    chooseLanguage: $localize`:@@nb.markdownEditor.chooseLanguage:Choose language`,

    addRowAbove: $localize`:@@nb.markdownEditor.addRowAbove:Add row above`,
    addRowBelow: $localize`:@@nb.markdownEditor.addRowBelow:Add row below`,
    addColumnLeft: $localize`:@@nb.markdownEditor.addColumnLeft:Add column left`,
    addColumnRight: $localize`:@@nb.markdownEditor.addColumnRight:Add column right`,
    removeRow: $localize`:@@nb.markdownEditor.removeRow:Remove row`,
    removeColumn: $localize`:@@nb.markdownEditor.removeColumn:Remove column`,
    alignColumnLeft: $localize`:@@nb.markdownEditor.alignColumnLeft:Align column left`,
    alignColumnCenter: $localize`:@@nb.markdownEditor.alignColumnCenter:Align column center`,
    alignColumnRight: $localize`:@@nb.markdownEditor.alignColumnRight:Align column right`,
    removeTable: $localize`:@@nb.markdownEditor.removeTable:Remove table`,
  }));
}
