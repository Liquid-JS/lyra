import { Component } from '@angular/core'
import {
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbSearchComponent,
    NbSidebarComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-search-showcase',
    templateUrl: './search-showcase.component.html',
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
export class SearchShowcaseComponent {}
