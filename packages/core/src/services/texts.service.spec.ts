import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  NbBreadcrumbsModule,
  nbLocalizeFallback,
  NbPaginationModule,
  NbSpinnerModule,
  NbUserModule,
  NbTextsService,
  NbThemeModule,
  provideNbTexts,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-texts-subtree',
  template: `<nb-pagination class="inner" [length]="57" />`,
  imports: [NbPaginationModule],
  providers: [provideNbTexts({ pagination: { next: 'Naslednja' } })],
})
class TextsSubtreeComponent {}

@Component({
  template: `
    <nb-pagination class="outer" [length]="57" />
    @if (inner()) {
      <nb-texts-subtree />
    }
  `,
  imports: [NbPaginationModule, TextsSubtreeComponent],
})
class TextsHostComponent {
  readonly inner = signal(false);
}

@Component({
  template: `
    <nb-breadcrumbs class="default" />
    <nb-breadcrumbs class="own" aria-label="Pot" />
    <nb-user class="default" />
    <nb-user class="own" name="Ana" />
    <nb-spinner class="default" />
    <nb-spinner class="none" message="" />
  `,
  imports: [NbBreadcrumbsModule, NbUserModule, NbSpinnerModule],
})
class TextsInputsHostComponent {}

describe('NbTextsService', () => {
  const labels = (root: HTMLElement, selector: string) =>
    [...root.querySelectorAll(`${selector} .navigation button`)].map((button) => button.getAttribute('aria-label'));

  const create = async (providers: unknown[] = []) => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()], providers: providers as never[] });
    const fixture = TestBed.createComponent(TextsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };

  it('should show the English texts without @angular/localize, from $localize messages', async () => {
    const fixture = await create();
    expect(labels(fixture.nativeElement, '.outer')).toEqual(['First page', 'Previous page', 'Next page', 'Last page']);
    expect(fixture.nativeElement.querySelector('.outer').getAttribute('aria-label')).toBe('Pagination');
    // A message with placeholders keeps its values.
    expect(fixture.nativeElement.querySelector('.outer .range')?.textContent?.trim()).toBe('1–10 of 57');
  });

  it('should make a message its text where @angular/localize is not loaded', () => {
    const name = 'a.png';
    expect(nbLocalizeFallback`:@@nb.fileDrop.remove:Remove ${name}:name:`).toBe('Remove a.png');
    expect(nbLocalizeFallback`:meaning|description@@id:Text`).toBe('Text');
    expect(nbLocalizeFallback`Plain ${1}:count: and ${2}`).toBe('Plain 1 and 2');
    expect(nbLocalizeFallback`:@@id:A colon\: kept`).toBe('A colon: kept');
  });

  it('should change texts for the app, and for the components inside one, over the app', async () => {
    const fixture = await create([provideNbTexts({ pagination: { first: 'Prva', next: 'Naprej' } })]);
    fixture.componentInstance.inner.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(labels(fixture.nativeElement, '.outer')).toEqual(['Prva', 'Previous page', 'Naprej', 'Last page']);
    expect(labels(fixture.nativeElement, '.inner')).toEqual(['Prva', 'Previous page', 'Naslednja', 'Last page']);
  });

  it("should take components' texts, under the texts their inputs give", async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [provideNbTexts({ breadcrumbs: { label: 'Drobtine' }, user: { anonymous: 'Neznan' } })],
    });
    const fixture = TestBed.createComponent(TextsInputsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('nb-breadcrumbs.default')?.getAttribute('aria-label')).toBe('Drobtine');
    expect(root.querySelector('nb-breadcrumbs.own')?.getAttribute('aria-label')).toBe('Pot');
    expect(root.querySelector('nb-user.default .user-name')?.textContent?.trim()).toBe('Neznan');
    expect(root.querySelector('nb-user.own .user-name')?.textContent?.trim()).toBe('Ana');
    expect(root.querySelector('nb-spinner.default .message')?.textContent?.trim()).toBe('Loading...');
    // An empty message shows none.
    expect(root.querySelector('nb-spinner.none .message')).toBeNull();
  });

  it('should change texts at run time', async () => {
    const fixture = await create();
    TestBed.inject(NbTextsService).set({ pagination: { last: 'Zadnja' } });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(labels(fixture.nativeElement, '.outer').at(-1)).toBe('Zadnja');
  });

  it('should take translations by message id', async () => {
    // The test runner loads @angular/localize, as an app that translates does.
    const { loadTranslations, clearTranslations } = await import('@angular/localize');
    loadTranslations({ 'nb.pagination.next': 'Naprej', 'nb.pagination.range': '{$start} do {$end} od {$length}' });
    try {
      const fixture = await create();
      expect(labels(fixture.nativeElement, '.outer')[2]).toBe('Naprej');
      expect(fixture.nativeElement.querySelector('.outer .range')?.textContent?.trim()).toBe('1 do 10 od 57');
    } finally {
      clearTranslations();
    }
  });
});
