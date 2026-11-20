import { Component, EnvironmentProviders, PLATFORM_ID, Provider, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemarkModule } from 'ngx-remark';
import { provideHighlightOptions } from 'nxt-highlightjs';

import { NbThemeModule } from '@liquid-js/lyr-core';
import { NbMarkdownViewerComponent } from '@liquid-js/lyr-extras/markdown-viewer';

@Component({
  template: `
    <div class="nb-theme-default" dir="ltr">
      <nb-markdown-viewer [markdown]="markdown()" [autoDirection]="autoDirection()">
        @if (customLinks()) {
          <a *remarkTemplate="'link'; let node" class="custom" [href]="node.url" [remarkNode]="node"></a>
        }
      </nb-markdown-viewer>
    </div>
  `,
  styleUrl: '../../styles/spec-theme.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbMarkdownViewerComponent, RemarkModule],
})
class ViewerHostComponent {
  readonly markdown = signal(
    [
      '# Title',
      '',
      '- [x] done',
      '- [ ] to do',
      '',
      'Press <kbd>Ctrl</kbd> and <b onclick="alert(1)">**bold**</b> [text][ref].[^note]',
      '',
      '<div onclick="alert(1)">block</div>',
      '',
      '[ref]: https://example.com "Example"',
      '[^note]: A note.',
    ].join('\n'),
  );
  readonly customLinks = signal(false);
  readonly autoDirection = signal(false);
}

const render = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
};

describe('NbMarkdownViewerComponent', () => {
  let fixture: ComponentFixture<ViewerHostComponent>;
  let host: ViewerHostComponent;
  let element: HTMLElement;

  const setup = async (platform: string, providers = new Array<Provider | EnvironmentProviders>()) => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: PLATFORM_ID, useValue: platform }, ...providers],
    });
    fixture = TestBed.createComponent(ViewerHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('nb-markdown-viewer');
    await render(fixture);
  };

  afterEach(() => fixture.destroy());

  ['browser', 'server'].forEach((platform) => {
    it(`should render the markdown with templates, without unsafe HTML, in the ${platform}`, async () => {
      await setup(platform);

      expect(element.querySelector('.uf-contents > h1')?.textContent).toBe('Title');
      const tasks = element.querySelectorAll('li.task-list-item');
      expect(tasks.length).toBe(2);
      expect(tasks[0].classList).toContain('checked');
      expect(tasks[0].querySelector('input')?.checked).toBe(true);
      expect(tasks[1].querySelector('input')?.checked).toBe(false);
      expect(tasks[0].textContent?.trim()).toBe('done');
      // A tight list's items hold their text without paragraphs.
      expect(element.querySelector('.uf-contents > ul p')).toBeNull();

      expect(element.querySelector('kbd')?.textContent).toBe('Ctrl');
      expect(element.querySelector('b > strong')?.textContent).toBe('bold');
      expect(element.querySelector('b')?.hasAttribute('onclick')).toBe(false);
      expect(element.querySelector('div > div')?.textContent).toBe('block');
      expect(element.querySelector('[onclick]')).toBeNull();

      const link = element.querySelector<HTMLAnchorElement>('p > a');
      expect(link?.href).toBe('https://example.com/');
      expect(link?.title).toBe('Example');
      expect(link?.textContent).toBe('text');

      const footnote = element.querySelector('.nb-markdown-footnotes li');
      expect(footnote?.textContent?.trim()).toBe('A note.\u21A9\uFE0E');
      expect(element.querySelector('sup a')?.getAttribute('href')).toBe(`#${footnote?.id}`);
      expect(element.querySelector('.nb-markdown-footnotes')?.getAttribute('aria-label')).toBe('Footnotes');
      // And back, from the footnote to its reference.
      const back = element.querySelector('.nb-markdown-footnote-back') as HTMLAnchorElement;
      expect(back.getAttribute('aria-label')).toBe('Back to the text');
      expect(back.getAttribute('href')).toBe(`#${element.querySelector('sup a')?.id}`);
      expect(element.textContent).not.toContain('Unknown node type');
    });
  });

  it('should show the markdown in the theme text styles', async () => {
    await setup('browser');

    const heading = element.querySelector('h1') as HTMLElement;
    expect(getComputedStyle(heading).fontFamily).toContain('Inter');
    expect(getComputedStyle(element.querySelector('.task-list-item input') as HTMLElement).width).toBe('1px');

    // Links and tables as the theme's are.
    host.markdown.set('[Docs](https://example.com)\n\n| Name |\n| --- |\n| Ada |');
    await render(fixture);
    const probe = (variable: string) => {
      const span = document.createElement('span');
      span.style.color = `var(${variable})`;
      element.append(span);
      const value = getComputedStyle(span).color;
      span.remove();
      return value;
    };
    expect(getComputedStyle(element.querySelector('a') as HTMLElement).color).toBe(probe('--link-text-color'));
    expect(getComputedStyle(element.querySelector('td') as HTMLElement).borderTopColor).toBe(
      probe('--table-cell-border-color'),
    );
  });

  it('should show new markdown', async () => {
    await setup('browser');

    host.markdown.set('## Other');
    await render(fixture);
    expect(element.querySelector('h2')?.textContent).toBe('Other');
    expect(element.querySelector('h1')).toBeNull();
  });

  it('should show the plain quotes, dashes and ellipses of the text as typographic ones, and leave code as it is', async () => {
    await setup('browser');

    host.markdown.set('It\'s "quoted" --- 1--2... `"code" -- ...`');
    await render(fixture);
    expect(element.querySelector('p')?.textContent).toBe('It’s “quoted” — 1–2… "code" -- ...');
  });

  it('should render nodes with the templates it is given', async () => {
    await setup('browser');

    host.customLinks.set(true);
    await render(fixture);
    expect(element.querySelector('a.custom')?.textContent).toBe('text');
  });

  it('should move to a footnote without leaving the page', async () => {
    await setup('browser');

    const reference = element.querySelector('sup a') as HTMLAnchorElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    reference.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should give the blocks of the document the direction of their own text with autoDirection', async () => {
    await setup('browser');
    host.markdown.set(
      [
        '# Title',
        '',
        'مرحبا بالعالم.',
        '',
        '- item',
        '',
        '1. item',
        '',
        '> quote',
        '>',
        '> - item',
        '',
        '| Column |',
        '| --- |',
        '| cell |',
        '',
        '<div>block</div>',
        '',
        '```',
        'مرحبا',
        '```',
        '',
        'Text.[^note]',
        '',
        '[^note]: A note.',
      ].join('\n'),
    );
    await render(fixture);
    // Off by default.
    expect(element.querySelector('[dir]')).toBeNull();

    host.autoDirection.set(true);
    await render(fixture);
    const blocks = ['h1', 'p', 'ul', 'ol', 'blockquote', 'table', 'div', 'section'];
    blocks.forEach((block) =>
      expect(element.querySelector(`.uf-contents > ${block}`)?.getAttribute('dir'), block).toBe('auto'),
    );
    expect(getComputedStyle(element.querySelector('.uf-contents > p') as HTMLElement).direction).toBe('rtl');
    expect(getComputedStyle(element.querySelector('.uf-contents > h1') as HTMLElement).direction).toBe('ltr');
    // Blocks in a quote share its direction, and code reads left to right.
    expect(element.querySelectorAll('[dir]').length).toBe(element.querySelectorAll('.uf-contents > [dir]').length);
    expect(element.querySelector('blockquote > p')?.hasAttribute('dir')).toBe(false);
    const code = element.querySelector('.uf-contents > pre') as HTMLElement;
    expect(code.hasAttribute('dir')).toBe(false);
    expect(getComputedStyle(code).direction).toBe('ltr');

    host.autoDirection.set(false);
    await render(fixture);
    expect(element.querySelector('[dir]')).toBeNull();
  });

  describe('code', () => {
    const code = ['```ts', 'const answer = 42;', '```', '', '```text', 'plain <text>', '```'].join('\n');
    const highlight = provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core').then((m) => m.default),
      languages: { typescript: () => import('highlight.js/lib/languages/typescript').then((m) => m.default) },
    });
    const blocks = () => element.querySelectorAll('pre code');

    ['browser', 'server'].forEach((platform) => {
      it(`should highlight code in the languages the app loads, in the ${platform}`, async () => {
        await setup(platform, [highlight]);
        host.markdown.set(code);
        await render(fixture);
        await vi.waitFor(() => expect(blocks()[0].querySelector('.hljs-keyword')?.textContent).toBe('const'));

        expect(blocks()[0].textContent).toBe('const answer = 42;');
        // A language that isn't loaded shows as text.
        expect(blocks()[1].innerHTML).toBe('plain &lt;text&gt;');
      });
    });

    it('should show code as text when the app does not load highlight.js', async () => {
      await setup('browser');
      host.markdown.set(code);
      await render(fixture);

      expect(blocks()[0].textContent).toBe('const answer = 42;');
      expect(blocks()[0].querySelector('span')).toBeNull();
      expect(blocks()[0].getAttribute('data-language')).toBe('ts');
    });

    it('should show code left to right in a right-to-left page', async () => {
      await setup('browser');
      (fixture.nativeElement.querySelector('[dir]') as HTMLElement).setAttribute('dir', 'rtl');
      host.markdown.set(code);
      await render(fixture);

      const block = element.querySelector('pre') as HTMLElement;
      expect(getComputedStyle(element).direction).toBe('rtl');
      expect(getComputedStyle(block).direction).toBe('ltr');
      expect(getComputedStyle(block).textAlign).toBe('left');
    });

    it('should colour code with the theme', async () => {
      await setup('browser', [highlight]);
      host.markdown.set(code);
      await render(fixture);
      await vi.waitFor(() => expect(blocks()[0].querySelector('.hljs-keyword')).toBeTruthy());

      const keyword = blocks()[0].querySelector('.hljs-keyword') as HTMLElement;
      const primary = getComputedStyle(element).getPropertyValue('--text-primary-color').trim();
      expect(primary).not.toBe('');
      const probe = document.createElement('span');
      probe.style.color = primary;
      element.append(probe);
      expect(getComputedStyle(keyword).color).toBe(getComputedStyle(probe).color);
      probe.remove();
    });
  });
});
