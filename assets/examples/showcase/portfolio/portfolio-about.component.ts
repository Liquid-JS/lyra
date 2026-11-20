import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbAccordionComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbButtonComponent,
    NbTagComponent,
    NbTagListComponent
} from '@liquid-js/lyr-core'

import { BIO, CV, picture, PHOTOGRAPHER, QUOTE, SERVICES } from './portfolio-data'

/** About the photographer: her portrait and story, what she does, her CV in sections, and a word from a client. */
@Component({
    selector: 'npg-portfolio-about',
    templateUrl: './portfolio-about.component.html',
    styleUrls: ['./portfolio-about.component.scss'],
    imports: [
        NbAccordionComponent,
        NbAccordionItemBodyComponent,
        NbAccordionItemComponent,
        NbAccordionItemHeaderComponent,
        NbButtonComponent,
        NbTagComponent,
        NbTagListComponent,
        RouterLink
    ]
})
export class PortfolioAboutComponent {
    readonly photographer = PHOTOGRAPHER
    // Her portrait large, in the same photo as her avatar elsewhere.
    readonly portrait = picture('portrait-emma')
    readonly bio = BIO
    readonly services = SERVICES
    readonly cv = CV
    readonly quote = QUOTE
}
