import { Component, OnInit, inject } from '@angular/core'

import {
    NbSearchService,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbSearchComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-search-test',
    templateUrl: './search-test.component.html',
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbSearchComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardFooterComponent
    ]
})
export class SearchTestComponent implements OnInit {
    private readonly searchService = inject(NbSearchService)

    ngOnInit() {
        this.searchService.onSearchSubmit().subscribe((data: { term: string, tag?: string }) => {
            console.info(`term: ${data.term}, from search: ${data.tag}`)
        })
    }
}
