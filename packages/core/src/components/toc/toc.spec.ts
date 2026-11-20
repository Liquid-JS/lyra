import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { NbThemeModule, NbTocComponent } from '@liquid-js/lyr-core';

@Component({ template: '' })
class PageComponent {}

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" dir="ltr">
      <article class="article" #article>
        <h2>Getting started</h2>
        <p></p>
        <h3 id="setup">Setup</h3>
        <p></p>
        <h3>Usage &amp; tips</h3>
        <p></p>
        <h2>Getting started</h2>
        <p></p>
        @if (extra()) {
          <h2>Extra</h2>
          <p></p>
        }
        <h4>Not listed</h4>
        <p class="short"></p>
      </article>
      <nb-toc [container]="article" [selector]="selector()" />
    </div>
  `,
  styleUrl: './toc.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbTocComponent],
})
class TocHostComponent {
  readonly extra = signal(false);
  readonly selector = signal('h2, h3');
}

describe('NbTocComponent', () => {
  let fixture: ComponentFixture<TocHostComponent>;
  let host: TocHostComponent;
  let article: HTMLElement;

  const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await frame();
    await frame();
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const links = () => [...fixture.nativeElement.querySelectorAll('nb-toc a')] as HTMLAnchorElement[];
  const titles = () => links().map((link) => link.textContent?.trim());
  const active = () => links().filter((link) => link.getAttribute('aria-current') === 'location').map((link) => link.textContent?.trim());
  const headings = () => [...article.querySelectorAll('h2, h3')] as HTMLElement[];
  const scrollTo = async (top: number) => {
    article.scrollTop = top;
    article.dispatchEvent(new Event('scroll'));
    await render();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [provideRouter([{ path: '**', component: PageComponent }])],
    });
    fixture = TestBed.createComponent(TocHostComponent);
    host = fixture.componentInstance;
    article = fixture.nativeElement.querySelector('article');
    await render();
  });

  it('should be a navigation landmark listing the headings, nested by level', () => {
    const toc = fixture.nativeElement.querySelector('nb-toc') as HTMLElement;
    expect(toc.getAttribute('role')).toBe('navigation');
    expect(toc.getAttribute('aria-label')).toBe('Table of contents');
    expect(titles()).toEqual(['Getting started', 'Setup', 'Usage & tips', 'Getting started']);
    expect([...toc.querySelectorAll(':scope > ul > li > a')].map((link) => link.textContent?.trim())).toEqual([
      'Getting started',
      'Getting started',
    ]);
  });

  it('should give headings without an id a unique one from their text, and keep the ids they have', () => {
    expect(headings().map((heading) => heading.id)).toEqual([
      'getting-started',
      'setup',
      'usage-tips',
      'getting-started-2',
    ]);
    expect(links().map((link) => link.getAttribute('href')?.split('#')[1])).toEqual([
      'getting-started',
      'setup',
      'usage-tips',
      'getting-started-2',
    ]);
  });

  it('should follow the content and the selector as they change', async () => {
    host.extra.set(true);
    await render();
    expect(titles()).toContain('Extra');

    host.selector.set('h2');
    await render();
    expect(titles()).toEqual(['Getting started', 'Getting started', 'Extra']);
  });

  it('should mark the sections in proportion to how far the content has scrolled', async () => {
    // The headings are at 0, 200, 400 and 600px of 901px (the last heading keeps its margins); the area shows 200px,
    // so it scrolls 701px and each heading's turn comes at 701 / 901 of its place: 0, 156, 311 and 467px.
    expect(active()).toEqual(['Getting started']);
    await scrollTo(150);
    expect(active()).toEqual(['Getting started']);
    await scrollTo(160);
    expect(active()).toEqual(['Setup']);
    await scrollTo(305);
    expect(active()).toEqual(['Setup']);
    await scrollTo(315);
    expect(active()).toEqual(['Usage & tips']);
    await scrollTo(article.scrollHeight);
    expect(active()).toEqual(['Getting started']);
    expect(links().findIndex((link) => link.getAttribute('aria-current') === 'location')).toBe(3);
  });

  it('should give every section a turn, in order, and none before its heading is in view', async () => {
    const seen = new Array<string>();
    for (let top = 0; top <= article.scrollHeight - article.clientHeight; top += 10) {
      await scrollTo(top);
      const index = links().findIndex((link) => link.getAttribute('aria-current') === 'location');
      const heading = headings()[index];
      const offset = heading.getBoundingClientRect().top - article.getBoundingClientRect().top;
      expect(offset).toBeLessThan(article.clientHeight);
      if (seen.at(-1) !== heading.id) {
        seen.push(heading.id);
      }
    }
    expect(seen).toEqual(['getting-started', 'setup', 'usage-tips', 'getting-started-2']);
  });

  it('should show the first section before any heading passes the line, e.g. below an introduction', async () => {
    headings()[0].style.marginTop = '120px';
    await scrollTo(0);
    expect(active()).toEqual(['Getting started']);
  });

  it("should count a heading's scroll margin as above it", async () => {
    // Setup's place moves up from 200 to 150px, its turn from 156 to 117px.
    await scrollTo(120);
    expect(active()).toEqual(['Getting started']);
    headings()[1].style.scrollMarginTop = '50px';
    await scrollTo(121);
    expect(active()).toEqual(['Setup']);
  });

  it('should show the last heading at the end of the content, though it never reaches the top', async () => {
    host.selector.set('h2, h3, h4');
    await render();
    await scrollTo(article.scrollHeight);
    expect(active()).toEqual(['Not listed']);
  });

  it('should scroll to and focus the heading of a clicked link, and keep it current until the user scrolls', async () => {
    links()[2].click();
    await render();
    await fixture.whenStable();

    const heading = headings()[2];
    expect(document.activeElement).toBe(heading);
    expect(heading.getAttribute('tabindex')).toBe('-1');
    expect(active()).toEqual(['Usage & tips']);
    expect(TestBed.inject(Router).url).toContain('#usage-tips');

    document.dispatchEvent(new WheelEvent('wheel'));
    await scrollTo(0);
    expect(active()).toEqual(['Getting started']);
  });
});

@Component({
  template: `
    <article #page>
      <h1>Install Lyra</h1>
      <h2>NbMarkdownEditorComponent</h2>
      <h2>Using Angular CLI</h2>
    </article>
    <nb-toc [container]="page" selector="h1, h2" [nested]="nested()" />
  `,
  imports: [NbTocComponent],
})
class TocFlatHostComponent {
  readonly nested = signal(true);
}

describe('NbTocComponent, flat and with long names', () => {
  let fixture: ComponentFixture<TocFlatHostComponent>;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [provideRouter([{ path: '**', component: PageComponent }])],
    });
    fixture = TestBed.createComponent(TocFlatHostComponent);
    await render();
  });

  it('should list the headings flat without nesting', async () => {
    const topLevel = () => fixture.nativeElement.querySelectorAll('nb-toc > ul > li').length;
    expect(topLevel()).toBe(1);
    fixture.componentInstance.nested.set(false);
    await render();
    expect(topLevel()).toBe(3);
  });

  it('should let a long name break where a word starts in it', () => {
    const link = [...fixture.nativeElement.querySelectorAll('nb-toc a')].find((a: HTMLElement) =>
      a.textContent?.includes('Markdown'),
    ) as HTMLElement;
    expect(link.querySelectorAll('wbr').length).toBe(3);
    expect(link.textContent).toBe('NbMarkdownEditorComponent');
  });
});
