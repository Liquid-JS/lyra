import { Component } from '@angular/core'
import {
    NbAccordionComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbAccordionItemBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-accordion-multi',
    templateUrl: './accordion-multi.component.html',
    imports: [
        NbAccordionComponent,
        NbAccordionItemComponent,
        NbAccordionItemHeaderComponent,
        NbAccordionItemBodyComponent
    ]
})
export class AccordionMultiComponent {}
