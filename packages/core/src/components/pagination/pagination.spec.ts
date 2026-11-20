import { Component, Service, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  NbPageable,
  NbPaginationComponent,
  NbThemeModule,
  NbViewportRulerAdapter,
  provideNbComponentDefaults,
  provideNbTexts,
} from '@liquid-js/lyr-core';

// The page size select opens an overlay, whose scroll blocking measures the viewport.
@Service({ autoProvided: false })
class NbViewportRulerMockAdapter extends NbViewportRulerAdapter {
  override getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1600, height: 900 };
  }
  override getViewportScrollPosition(): { left: number; top: number } {
    return { left: 0, top: 0 };
  }
}

@Component({
  template: `
    <nb-pagination
      [length]="length()"
      [(page)]="page"
      [(pageSize)]="pageSize"
      [pageSizeOptions]="pageSizeOptions()"
      [showFirstLast]="showFirstLast()"
      [loading]="loading()"
      [edge]="edge()"
    />
  `,
  imports: [NbPaginationComponent],
})
class PaginationHostComponent {
  readonly length = signal(57);
  readonly page = signal(0);
  readonly pageSize = signal(10);
  readonly pageSizeOptions = signal(new Array<number>());
  readonly showFirstLast = signal(true);
  readonly loading = signal(false);
  readonly edge = signal<boolean | undefined>(undefined);
}

describe('NbPaginationComponent', () => {
  let fixture: ComponentFixture<PaginationHostComponent>;
  let host: PaginationHostComponent;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const element = () => fixture.nativeElement.querySelector('nb-pagination') as HTMLElement;
  const range = () => element().querySelector('.range')?.textContent?.trim();
  const button = (label: string) => element().querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;
  const pageInput = () => element().querySelector('.page input') as HTMLInputElement;
  const typePage = async (value: string) => {
    pageInput().value = value;
    pageInput().dispatchEvent(new Event('change'));
    await render();
  };

  const setup = async (providers = new Array<unknown>()) => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }, ...(providers as [])],
    });
    fixture = TestBed.createComponent(PaginationHostComponent);
    host = fixture.componentInstance;
    await render();
  };

  describe('with the app\'s defaults', () => {
    beforeEach(() => setup([provideNbComponentDefaults({ pagination: { edge: false } })]));

    it('should leave its last button as it is when the app turns the edge off', () => {
      expect(button('Last page').classList).not.toContain('edge-end');
    });
  });

  describe('with defaults', () => {
    beforeEach(() => setup());

    it('should line up its last button with the end of the row, unless told not to', async () => {
      expect(button('Last page').classList).toContain('edge-end');
      expect(button('Next page').classList).not.toContain('edge-end');

      host.showFirstLast.set(false);
      await render();
      expect(button('Next page').classList).toContain('edge-end');

      host.edge.set(false);
      await render();
      expect(button('Next page').classList).not.toContain('edge-end');
    });

    it('should be a labelled navigation landmark with a live range', () => {
      expect(element().getAttribute('role')).toBe('navigation');
      expect(element().getAttribute('aria-label')).toBe('Pagination');
      expect(element().querySelector('.range')?.getAttribute('aria-live')).toBe('polite');
    });

    it('should show the range and page count', () => {
      expect(range()).toBe('1–10 of 57');
      expect(pageInput().value).toBe('1');
      expect(element().querySelector('.page')?.textContent).toContain('of 6');
    });

    it('should go to the next, last, previous and first page', async () => {
      button('Next page').click();
      await render();
      expect(host.page()).toBe(1);
      expect(range()).toBe('11–20 of 57');

      button('Last page').click();
      await render();
      expect(host.page()).toBe(5);
      expect(range()).toBe('51–57 of 57');
      expect(button('Next page').disabled).toBe(true);
      expect(button('Last page').disabled).toBe(true);

      button('Previous page').click();
      await render();
      expect(host.page()).toBe(4);

      button('First page').click();
      await render();
      expect(host.page()).toBe(0);
      expect(button('Previous page').disabled).toBe(true);
    });

    it('should go to a typed page and reset invalid ones', async () => {
      await typePage('3');
      expect(host.page()).toBe(2);

      await typePage('9');
      expect(host.page()).toBe(2);
      expect(pageInput().value).toBe('3');

      await typePage('1.5');
      expect(pageInput().value).toBe('3');
    });

    it('should show an empty range without items', async () => {
      host.length.set(0);
      await render();

      expect(range()).toBe('0–0 of 0');
      expect(button('Next page').disabled).toBe(true);
    });

    it('should hide the first and last buttons', async () => {
      host.showFirstLast.set(false);
      await render();

      expect(button('First page')).toBeNull();
      expect(button('Last page')).toBeNull();
    });

    it('should be busy and ignore page changes while loading, keeping focus', async () => {
      host.loading.set(true);
      await render();

      button('Next page').click();
      await typePage('3');

      expect(host.page()).toBe(0);
      expect(element().getAttribute('aria-busy')).toBe('true');
      expect(button('Next page').disabled).toBe(false);
      expect(pageInput().disabled).toBe(false);
      expect(pageInput().readOnly).toBe(true);
    });

    it('should change the page size and keep the first item in view', async () => {
      host.pageSizeOptions.set([10, 25]);
      host.page.set(3);
      await render();

      const label = element().querySelector('.page-size span') as HTMLElement;
      const selectButton = element().querySelector('nb-select button') as HTMLButtonElement;
      expect(selectButton.getAttribute('aria-labelledby')).toContain(label.id);

      selectButton.click();
      await render();
      const option = [...document.querySelectorAll('nb-option')].find((o) => o.textContent?.trim() === '25');
      (option as HTMLElement).click();
      await render();

      expect(host.pageSize()).toBe(25);
      // Item 31 was first on the page, and is on the second page of 25.
      expect(host.page()).toBe(1);
      expect(range()).toBe('26–50 of 57');
    });
  });

  describe('with provided texts and a locale', () => {
    it('should use them', async () => {
      await setup([
        provideNbTexts({
          pagination: { range: (start, end, length) => `${start} do ${end} od ${length}`, next: 'Naprej' },
        }),
      ]);
      host.length.set(12345);
      await render();

      expect(range()).toBe('1 do 10 od 12,345');
      expect(button('Naprej')).toBeTruthy();
    });
  });
});

@Component({
  template: `<nb-pagination [for]="pages" (pageChange)="changes.push($event)" />`,
  imports: [NbPaginationComponent],
})
class PaginationForHostComponent {
  readonly loading = signal(false);
  readonly pages: NbPageable = {
    page: signal(0),
    pageSize: signal(5),
    total: signal(23),
    loading: this.loading,
  };
  readonly changes = new Array<number>();
}

describe('NbPaginationComponent for something with pages', () => {
  it('should show its pages and total, change its page, and be busy while it loads', async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), PaginationForHostComponent] });
    const fixture = TestBed.createComponent(PaginationForHostComponent);
    const host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector('nb-pagination') as HTMLElement;
    expect(element.textContent).toContain('1–5 of 23');

    (element.querySelector('button[aria-label="Next page"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.pages.page()).toBe(1);
    expect(host.changes).toEqual([1]);
    expect(element.textContent).toContain('6–10 of 23');

    // Its own page changes show too.
    host.pages.page.set(4);
    fixture.detectChanges();
    expect(element.textContent).toContain('21–23 of 23');

    host.loading.set(true);
    fixture.detectChanges();
    expect(element.getAttribute('aria-busy')).toBe('true');
  });
});
