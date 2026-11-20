import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NbSearchService,
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbLayoutColumnComponent,
  NbSearchComponent,
  NbSidebarComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
} from '@liquid-js/lyr-core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'nb-search-with-input-event',
  templateUrl: './search-with-input-event.component.html',
  imports: [
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbSearchComponent,
    NbSidebarComponent,
    NbLayoutColumnComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
  ],
})
export class SearchWithInputEventComponent {
  private readonly searchService = inject(NbSearchService);

  readonly value = toSignal(
    this.searchService.onSearchInput().pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((data: { term: string; tag?: string }) => data.term),
    ),
  );
}
