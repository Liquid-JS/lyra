import { Component, viewChild } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonComponent,
    NbAccordionComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbAccordionItemBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-accordion-toggle',
    templateUrl: './accordion-toggle.component.html',
    host: { class: 'example-height-60' },
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbButtonComponent,
        NbAccordionComponent,
        NbAccordionItemComponent,
        NbAccordionItemHeaderComponent,
        NbAccordionItemBodyComponent
    ]
})
export class AccordionToggleComponent {

    readonly accordion = viewChild.required<NbAccordionItemComponent>('item')

    toggle() {
        this.accordion().toggle()
    }
}
