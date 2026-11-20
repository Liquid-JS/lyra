import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideHighlightOptions } from 'nxt-highlightjs';
import { userEvent } from 'vitest/browser';

import {
  NbComponentOrCustomStatus,
  NbIconLibraries,
  NbInputModule,
  NbThemeModule,
  NbValidationModule,
  provideNbComponentDefaults,
  provideNbTexts,
} from '@liquid-js/lyr-core';
import { NbMarkdownEditorComponent } from '@liquid-js/lyr-extras/markdown-editor';
import type { EditorType, PreviewStyle } from '@liquid-js/underflow';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" dir="ltr">
      <nb-markdown-editor
        [formControl]="text"
        [status]="status()"
        [(mode)]="mode"
        [readonly]="readonly()"
        [autoDirection]="autoDirection()"
        [previewStyle]="previewStyle()"
        placeholder="Write here"
        aria-label="Description"
      />
      <button class="after">After</button>
      <!-- The input the editor's colours are compared with. -->
      <input nbInput class="reference" [status]="status()" aria-label="Reference" />
    </div>
  `,
  styleUrl: '../../styles/spec-theme.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbInputModule, NbMarkdownEditorComponent, ReactiveFormsModule],
})
class EditorHostComponent {
  readonly text = new FormControl('# Title\n\nSome **bold** text');
  readonly status = signal<NbComponentOrCustomStatus>('basic');
  readonly mode = signal<EditorType>('markdown');
  readonly readonly = signal(false);
  readonly autoDirection = signal(false);
  readonly previewStyle = signal<PreviewStyle>('tab');
}

@Component({
  template: `
    <div class="nb-theme-default" dir="ltr">
      <label nbLabel [for]="validation">Description</label>
      <nb-markdown-editor [formControl]="text" nbValidation #validation="nbValidation" />
      <nb-validation-errors [for]="validation" />
      <button class="after">After</button>
    </div>
  `,
  styleUrl: '../../styles/spec-theme.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbMarkdownEditorComponent, ReactiveFormsModule, NbValidationModule],
})
class ValidatedEditorHostComponent {
  readonly text = new FormControl('', Validators.required);
}

const render = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
};

describe('NbMarkdownEditorComponent', () => {
  let fixture: ComponentFixture<EditorHostComponent>;
  let host: EditorHostComponent;
  let element: HTMLElement;
  let component: NbMarkdownEditorComponent;

  const editor = () => component.editor() as NonNullable<ReturnType<NbMarkdownEditorComponent['editor']>>;
  const query = (selector: string) => element.querySelector(selector) as HTMLElement;
  const queryAll = (selector: string) => Array.from(element.querySelectorAll<HTMLElement>(selector));
  /** The markdown and the WYSIWYG text. */
  const texts = () => queryAll('.ProseMirror');
  /** The colour a theme variable has in the editor. */
  const color = (variable: string) => {
    const probe = document.createElement('span');
    probe.style.color = `var(${variable})`;
    element.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };
  const reference = () => getComputedStyle(fixture.nativeElement.querySelector('input.reference') as HTMLElement);
  /** A style's value once it has stopped changing, as after a transition. */
  const settled = async (read: () => string) => {
    let last = '';
    await expect
      .poll(
        () => {
          const now = read();
          const done = now === last;
          last = now;
          return done;
        },
        { interval: 100 },
      )
      .toBe(true);
    return last;
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [provideNbTexts({ markdownEditor: { bold: 'Fett', headingLevel: (level) => `Ebene ${level}` } })],
    });
    fixture = TestBed.createComponent(EditorHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('nb-markdown-editor');
    component = fixture.debugElement.children[0].children[0].componentInstance;
    await render(fixture);
    await vi.waitFor(() => expect(component.editor()).toBeTruthy());
    await render(fixture);
  });

  afterEach(() => fixture.destroy());

  it('should draw its icons from the essentials pack', () => {
    const bold = TestBed.inject(NbIconLibraries).getSvgIcon('bold-outline', 'essentials')?.icon.getContent();
    const paths = (svg: Element | null) => [...(svg?.querySelectorAll('path') ?? [])].map((path) => path.getAttribute('d'));
    const drawn = new DOMParser().parseFromString(bold ?? '', 'image/svg+xml').documentElement;
    expect(paths(drawn).length).toBeGreaterThan(0);
    expect(paths(query('.uf-toolbar button.bold .uf-icon svg'))).toEqual(paths(drawn));
  });

  it('should give the scroll sync switch the toggle\'s checkmark, in the vertical preview', async () => {
    host.previewStyle.set('vertical');
    await render(fixture);
    await vi.waitFor(() => expect(query('.scroll-sync .switch .nb-markdown-switch-checkmark svg')).toBeTruthy());
  });

  it('should edit the form value', async () => {
    expect(editor().getMarkdown()).toBe('# Title\n\nSome **bold** text');

    editor().moveCursorToEnd(false);
    editor().insertText(' here');
    expect(host.text.value).toBe('# Title\n\nSome **bold** text here');
    expect(host.text.dirty).toBe(true);
  });

  it('should show a new form value without reporting it as a change', async () => {
    host.text.setValue('Other text');
    host.text.markAsPristine();
    await render(fixture);

    expect(editor().getMarkdown()).toBe('Other text');
    expect(host.text.value).toBe('Other text');
    expect(host.text.dirty).toBe(false);
  });

  it('should format the markdown with its Format button, which Undo takes back', async () => {
    host.text.setValue('* one\n* it’s two\n\n<hr>\n\n__bold__');
    const format = query('.uf-toolbar button.nb-markdown-format');
    expect(format.getAttribute('aria-label')).toBe('Format (Shift+Alt+F)');
    // It looks like the editor's own buttons.
    const looks = (button: Element | null) =>
      button && ['width', 'height', 'margin', 'background-color', 'color'].map((property) =>
        getComputedStyle(button).getPropertyValue(property),
      );
    const italic = query('.uf-toolbar button.italic');
    expect(looks(format)).toEqual(looks(italic));
    expect(looks(format.querySelector('svg'))).toEqual(looks(italic.querySelector('svg')));
    // Edits closer together are one step of the history.
    await new Promise((resolve) => setTimeout(resolve, 600));

    format.click();
    await vi.waitFor(() => expect(host.text.value).toBe("- one\n- it's two\n\n---\n\n**bold**\n"));
    expect(host.text.dirty).toBe(true);

    editor().exec('undo');
    expect(host.text.value).toBe('* one\n* it’s two\n\n<hr>\n\n__bold__');
  });

  it('should format the markdown with Shift+Alt+F, unless it is read-only', async () => {
    host.text.setValue('* one');
    editor().moveCursorToEnd(true);
    await userEvent.keyboard('{Shift>}{Alt>}F{/Alt}{/Shift}');
    await vi.waitFor(() => expect(host.text.value).toBe('- one\n'));

    host.text.setValue('* one');
    host.readonly.set(true);
    await render(fixture);
    texts()[0].focus();
    await userEvent.keyboard('{Shift>}{Alt>}F{/Alt}{/Shift}');
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(host.text.value).toBe('* one');
  });

  it('should show typographic punctuation in the preview, and keep the markdown as written', async () => {
    host.previewStyle.set('vertical');
    host.text.setValue('"It\'s" -- one... `"code"`');
    await render(fixture);

    await vi.waitFor(() =>
      expect(query('.uf-md-preview .uf-contents')?.textContent?.trim()).toBe('“It’s” – one… "code"'),
    );
    expect(editor().getMarkdown()).toBe('"It\'s" -- one... `"code"`');
  });

  it('should take its texts from the texts service', () => {
    // With the shortcut.
    expect(query('button.bold').getAttribute('aria-label')).toMatch(/^Fett \(/);
    expect(query('button.italic').getAttribute('aria-label')).toMatch(/^Italic \(/);

    // The level where the text puts it.
    query('button.heading').click();
    expect(queryAll('.uf-popup [role="menuitem"]').map((item) => item.textContent?.trim())).toContain('Ebene 2');
  });

  it('should name the text areas', async () => {
    expect(texts().length).toBe(2);
    texts().forEach((text) => expect(text.getAttribute('aria-label')).toBe('Description'));

    host.readonly.set(true);
    await render(fixture);
    texts().forEach((text) => expect(text.getAttribute('aria-label')).toBe('Description'));
  });

  it('should have the colours of a field with its status', async () => {
    const frame = query('.uf-default-ui');
    expect(getComputedStyle(frame).borderTopColor).toBe(reference().borderTopColor);
    expect(getComputedStyle(frame).backgroundColor).toBe(reference().backgroundColor);
    expect(getComputedStyle(query('.ProseMirror')).color).toBe(color('--text-basic-color'));

    const basic = reference().borderTopColor;
    host.status.set('danger');
    await render(fixture);
    // The input's border changes colour over a moment.
    await expect.poll(() => reference().borderTopColor).not.toBe(basic);
    const danger = await settled(() => reference().borderTopColor);
    await expect.poll(() => getComputedStyle(frame).borderTopColor).toBe(danger);
  });

  it('should have a field\'s colours under the pointer', async () => {
    // The input's colours under the pointer, once it has them.
    const rest = reference().backgroundColor;
    await userEvent.hover(fixture.nativeElement.querySelector('.reference'));
    await expect.poll(() => reference().backgroundColor).not.toBe(rest);
    const hovered = {
      border: await settled(() => reference().borderTopColor),
      background: await settled(() => reference().backgroundColor),
    };

    const frame = query('.uf-default-ui');
    await userEvent.hover(element);
    await expect.poll(() => getComputedStyle(frame).backgroundColor).toBe(hovered.background);
    await expect.poll(() => getComputedStyle(frame).borderTopColor).toBe(hovered.border);
  });

  it('should show the toolbar disabled, in the preview and while disabled, in the theme\'s disabled colour', async () => {
    const bold = () => query('.uf-toolbar button.bold');
    const tab = (index: number) => element.querySelectorAll<HTMLElement>('.uf-md-tab-container .tab-item')[index];
    expect(getComputedStyle(bold()).color).toBe(color('--text-basic-color'));
    expect(getComputedStyle(tab(1)).color).toBe(color('--text-basic-color'));

    tab(1).click();
    await render(fixture);
    expect((bold() as HTMLButtonElement).disabled).toBe(true);
    expect(getComputedStyle(bold()).color).toBe(color('--text-disabled-color'));

    tab(0).click();
    host.text.disable();
    await render(fixture);
    expect((bold() as HTMLButtonElement).disabled).toBe(true);
    expect(getComputedStyle(bold()).color).toBe(color('--text-disabled-color'));
    expect(getComputedStyle(tab(1)).color).toBe(color('--text-disabled-color'));
  });

  it('should switch between the markdown and WYSIWYG modes', async () => {
    host.mode.set('wysiwyg');
    await render(fixture);
    expect(editor().isWysiwygMode()).toBe(true);

    editor().changeMode('markdown');
    await render(fixture);
    expect(host.mode()).toBe('markdown');
  });

  it('should be read-only and out of the Tab order while the form control is disabled', async () => {
    host.text.disable();
    await render(fixture);
    // Screen readers still read the text.
    expect(element.inert).toBe(false);
    expect(element.getAttribute('aria-disabled')).toBe('true');
    expect(editor().isDisabled()).toBe(true);
    texts().forEach((text) => {
      expect(text.getAttribute('contenteditable')).toBe('false');
      expect(text.getAttribute('aria-disabled')).toBe('true');
      expect(text.getAttribute('tabindex')).toBe('-1');
    });
    expect(getComputedStyle(query('.ProseMirror')).color).toBe(color('--text-disabled-color'));
    queryAll('[role="tab"]').forEach((tab) => expect(tab.getAttribute('tabindex')).toBe('-1'));

    fixture.nativeElement.querySelector('.after').focus();
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(element.contains(document.activeElement)).toBe(false);

    // The text stays out of reach when it changes.
    host.text.setValue('changed');
    await render(fixture);
    expect(query('.ProseMirror').getAttribute('tabindex')).toBe('-1');

    host.text.enable();
    await render(fixture);
    expect(element.hasAttribute('aria-disabled')).toBe(false);
    expect(editor().isDisabled()).toBe(false);
    texts().forEach((text) => {
      expect(text.getAttribute('contenteditable')).toBe('true');
      expect(text.hasAttribute('aria-disabled')).toBe(false);
      expect(text.hasAttribute('tabindex')).toBe(false);
    });
    expect(query('.uf-mode-switch [role="tab"][aria-selected="true"]').getAttribute('tabindex')).toBe('0');
  });

  it('should let the text be read, but not changed, while read-only', async () => {
    const tab = (index: number) => queryAll('.uf-md-tab-container .tab-item')[index];
    host.readonly.set(true);
    await render(fixture);
    expect(element.hasAttribute('aria-disabled')).toBe(false);
    texts().forEach((text) => {
      expect(text.getAttribute('contenteditable')).toBe('false');
      expect(text.getAttribute('aria-readonly')).toBe('true');
      expect(text.getAttribute('tabindex')).toBe('0');
    });
    expect(getComputedStyle(query('.ProseMirror')).color).toBe(color('--text-basic-color'));
    expect((query('.uf-toolbar button.bold') as HTMLButtonElement).disabled).toBe(true);
    expect(getComputedStyle(query('.uf-toolbar button.bold')).color).toBe(color('--text-disabled-color'));
    queryAll('.uf-mode-switch [role="tab"]').forEach((modeTab) =>
      expect(modeTab.getAttribute('aria-disabled')).toBe('true'),
    );

    // The text is reached by Tab, and typing doesn't change it.
    fixture.nativeElement.querySelector('.after').focus();
    await userEvent.keyboard('{Shift>}{Tab}{Tab}{/Shift}');
    expect(document.activeElement).toBe(texts()[0]);
    await userEvent.keyboard('x');
    expect(host.text.value).toBe('# Title\n\nSome **bold** text');

    // The preview still shows.
    tab(1).click();
    await render(fixture);
    expect(tab(1).classList).toContain('active');

    // Disabled and enabled again, it's still read-only.
    host.text.disable();
    await render(fixture);
    host.text.enable();
    await render(fixture);
    expect(editor().isReadonly()).toBe(true);
    expect(query('.ProseMirror').getAttribute('tabindex')).toBe('0');

    host.readonly.set(false);
    await render(fixture);
    expect(query('.ProseMirror').getAttribute('contenteditable')).toBe('true');
  });

  it('should leave the text with Escape and Tab, as Tab alone indents', async () => {
    host.text.setValue('- item');
    editor().moveCursorToEnd(true);
    await userEvent.keyboard('{Tab}');
    expect(host.text.value).toBe('    - item');
    expect(document.activeElement?.closest('nb-markdown-editor')).toBe(element);

    // Out of the text to the mode switch, then out of the editor.
    await userEvent.keyboard('{Escape}{Tab}');
    expect(document.activeElement).toBe(element.querySelector('.uf-mode-switch [role="tab"][aria-selected="true"]'));
    expect(host.text.value).toBe('    - item');
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.after'));
  });

  it('should give the blocks the direction of their own text with autoDirection', async () => {
    host.text.setValue('# Title\n\nمرحبا بالعالم.\n\n```\ncode\n```');
    await render(fixture);
    const preview = () => queryAll('.uf-md-preview .uf-contents > *');
    const wysiwyg = () => queryAll('.uf-ww-container .ProseMirror > *');
    const markdown = () => queryAll('.uf-md-container .ProseMirror > *');
    // Off by default.
    expect(element.querySelector('[dir]')).toBeNull();

    const previous = component.editor();
    host.autoDirection.set(true);
    await render(fixture);
    await vi.waitFor(() => expect(component.editor()).not.toBe(previous));
    host.mode.set('wysiwyg');
    await render(fixture);
    await vi.waitFor(() => expect(wysiwyg().length).toBe(3));

    // The heading and the paragraph, but not the code.
    for (const blocks of [preview(), wysiwyg()]) {
      expect(blocks.map((block) => block.getAttribute('dir'))).toEqual(['auto', 'auto', null]);
    }
    expect(getComputedStyle(preview()[1]).direction).toBe('rtl');
    expect(getComputedStyle(wysiwyg()[1]).direction).toBe('rtl');
    // The lines of the markdown, but not those of the code.
    expect(markdown().map((line) => line.getAttribute('dir'))).toEqual(['auto', 'auto', 'auto', 'auto', null, null, null]);
    expect(editor().getMarkdown()).toBe('# Title\n\nمرحبا بالعالم.\n\n```\ncode\n```');
  });

  it('should show code left to right in a right-to-left page', async () => {
    (fixture.nativeElement.querySelector('[dir]') as HTMLElement).setAttribute('dir', 'rtl');
    host.text.setValue('Text\n\n```\ncode\n```');
    await render(fixture);
    const leftToRight = (block: HTMLElement) => {
      expect(getComputedStyle(block).direction).toBe('ltr');
      expect(getComputedStyle(block).textAlign).toBe('left');
    };
    const lines = queryAll('.uf-md-container .ProseMirror > *');
    expect(getComputedStyle(lines[0]).direction).toBe('rtl');
    lines.slice(2).forEach(leftToRight);
    leftToRight(query('.uf-md-preview pre'));

    host.mode.set('wysiwyg');
    await render(fixture);
    await vi.waitFor(() => expect(element.querySelector('.uf-ww-container pre')).toBeTruthy());
    leftToRight(query('.uf-ww-container pre'));
  });

  it('should mark the control as touched when the text loses focus', async () => {
    editor().focus();
    editor().blur();
    expect(host.text.touched).toBe(true);
  });
});

describe('NbMarkdownEditorComponent with the app\'s defaults', () => {
  it('should take the shape of fields, only as round as a textarea', async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [provideNbComponentDefaults({ input: { shape: 'round' } })],
    });
    const fixture = TestBed.createComponent(EditorHostComponent);
    document.body.appendChild(fixture.nativeElement);
    const component = fixture.debugElement.query((node) => node.componentInstance instanceof NbMarkdownEditorComponent)
      .componentInstance as NbMarkdownEditorComponent;
    await render(fixture);
    await vi.waitFor(() => expect(component.editor()).toBeTruthy());
    await render(fixture);

    const frame = fixture.nativeElement.querySelector('.uf-default-ui') as HTMLElement;
    expect(component.shape()).toBe('round');
    // `input-textarea-max-border-radius`, 1rem.
    expect(getComputedStyle(frame).borderTopLeftRadius).toBe('16px');
    fixture.destroy();
  });
});

describe('NbMarkdownEditorComponent with nbValidation', () => {
  it('should be named by its nbLabel, show its errors in the text and the status, and focus from the label', async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    const fixture = TestBed.createComponent(ValidatedEditorHostComponent);
    const element = fixture.nativeElement.querySelector('nb-markdown-editor') as HTMLElement;
    const component = fixture.debugElement.query((node) => node.componentInstance instanceof NbMarkdownEditorComponent)
      .componentInstance as NbMarkdownEditorComponent;
    document.body.appendChild(fixture.nativeElement);
    await render(fixture);
    await vi.waitFor(() => expect(component.editor()).toBeTruthy());
    await render(fixture);
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const texts = Array.from(element.querySelectorAll<HTMLElement>('.ProseMirror'));

    for (const text of texts) {
      expect(text.getAttribute('aria-labelledby')).toBe(label.id);
      expect(text.getAttribute('aria-required')).toBe('true');
    }
    expect(element.hasAttribute('aria-labelledby')).toBe(false);

    fixture.componentInstance.text.markAsTouched();
    await render(fixture);
    const errors = fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement;
    for (const text of texts) {
      expect(text.getAttribute('aria-invalid')).toBe('true');
      expect(text.getAttribute('aria-describedby')?.split(' ')).toContain(errors.id);
    }
    expect(element.getAttribute('style')).toContain('--input-danger-border-color');

    label.click();
    expect(document.activeElement).toBe(texts[0]);
    fixture.destroy();
  });
});

describe('NbMarkdownEditorComponent with highlight.js', () => {
  let fixture: ComponentFixture<EditorHostComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [
        provideHighlightOptions({
          coreLibraryLoader: () => import('highlight.js/lib/core').then((m) => m.default),
          languages: { typescript: () => import('highlight.js/lib/languages/typescript').then((m) => m.default) },
        }),
      ],
    });
    fixture = TestBed.createComponent(EditorHostComponent);
    fixture.componentInstance.text.setValue('```ts\nconst answer = 42;\n```');
    element = fixture.nativeElement.querySelector('nb-markdown-editor');
    await render(fixture);
  });

  afterEach(() => fixture.destroy());

  it('should highlight code in the preview and the WYSIWYG mode', async () => {
    await vi.waitFor(() => expect(element.querySelector('.uf-md-preview .hljs-keyword')?.textContent).toBe('const'));

    fixture.componentInstance.mode.set('wysiwyg');
    await render(fixture);
    await vi.waitFor(() => expect(element.querySelector('.uf-ww-container .hljs-keyword')?.textContent).toBe('const'));
  });
});
