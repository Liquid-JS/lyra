import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import {
    NbSearchService,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbSearchComponent,
    NbSidebarComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'
import { map } from 'rxjs/operators'

@Component({
    selector: 'nb-search-event',
    templateUrl: './search-event.component.html',
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbSearchComponent,
        NbSidebarComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent
    ]
})
export class SearchEventComponent {
    private readonly searchService = inject(NbSearchService)

    readonly value = toSignal(
        this.searchService.onSearchSubmit().pipe(map((data: any) => data.term)),
        { initialValue: '' }
    )
}
