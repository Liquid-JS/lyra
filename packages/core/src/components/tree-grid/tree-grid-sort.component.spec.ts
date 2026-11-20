import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NB_SORT_HEADER_COLUMN_DEF,
  NbSortDirection,
  NbSortRequest,
  NbSortState,
  NbThemeModule,
  NbTreeGridModule,
} from '@liquid-js/lyr-core';

@Component({
  template: `
    <div nbSort (sort)="requests.push($event)">
      <span nbSortHeader>Name</span>
    </div>
  `,
  providers: [{ provide: NB_SORT_HEADER_COLUMN_DEF, useValue: { name: 'name' } }],
  imports: [NbTreeGridModule],
})
class NbSortHeaderTestComponent {
  requests = new Array<NbSortRequest>();
}

describe('nbSortHeader', () => {
  it('should emit one sort request per click', () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbTreeGridModule, NbSortHeaderTestComponent],
    });
    const fixture = TestBed.createComponent(NbSortHeaderTestComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(fixture.componentInstance.requests.length).toBe(1);
    expect(fixture.componentInstance.requests[0].column).toBe('name');
  });
});

/** Something sorted that tells its order, as a table's data source does. */
class SortState implements NbSortState {
  readonly sorted = signal<NbSortRequest | undefined>(undefined);
  sortBy(request: NbSortRequest) {
    this.sorted.set(request.direction === NbSortDirection.NONE ? undefined : request);
  }
  sortDirection(column: string) {
    const sorted = this.sorted();
    return sorted?.column === column ? sorted.direction : NbSortDirection.NONE;
  }
}

@Component({
  template: `
    <table [nbSort]="state">
      <tr>
        <th nbSortHeader>Name</th>
      </tr>
    </table>
  `,
  providers: [{ provide: NB_SORT_HEADER_COLUMN_DEF, useValue: { name: 'name' } }],
  imports: [NbTreeGridModule],
})
class NbSortStateTestComponent {
  readonly state = new SortState();
}

describe('nbSortHeader with something that tells its order', () => {
  it('should sort it, show its direction, and mark the sorted header for assistive technologies', () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbTreeGridModule, NbSortStateTestComponent],
    });
    const fixture = TestBed.createComponent(NbSortStateTestComponent);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('th') as HTMLElement;
    expect(header.hasAttribute('aria-sort')).toBe(false);

    header.querySelector('button')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.state.sorted()).toEqual({ column: 'name', direction: NbSortDirection.ASCENDING });
    expect(header.getAttribute('aria-sort')).toBe('ascending');

    // Sorted elsewhere, e.g. by code: the header follows.
    fixture.componentInstance.state.sorted.set({ column: 'name', direction: NbSortDirection.DESCENDING });
    fixture.detectChanges();
    expect(header.getAttribute('aria-sort')).toBe('descending');
    fixture.componentInstance.state.sorted.set(undefined);
    fixture.detectChanges();
    expect(header.hasAttribute('aria-sort')).toBe(false);
  });
});
