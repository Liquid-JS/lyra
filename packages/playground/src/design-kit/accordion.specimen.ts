import { Component } from '@angular/core'
import { NbAccordionComponent, NbAccordionItemBodyComponent, NbAccordionItemComponent, NbAccordionItemHeaderComponent } from '@liquid-js/lyr-core'

import { kit } from './specimen'

/** An accordion: an item open, one closed and one disabled. */
@Component({
    template: `
        <div class="specimens">
            <nb-accordion [attr.data-kit]="kit('accordion', {})"
                multi
                style="width: 24rem">
                <nb-accordion-item [expanded]="true">
                    <nb-accordion-item-header>Shipping</nb-accordion-item-header>
                    <nb-accordion-item-body>Orders ship within two working days.</nb-accordion-item-body>
                </nb-accordion-item>
                <nb-accordion-item>
                    <nb-accordion-item-header>Returns</nb-accordion-item-header>
                    <nb-accordion-item-body>Returns are free within 30 days.</nb-accordion-item-body>
                </nb-accordion-item>
                <nb-accordion-item [disabled]="true">
                    <nb-accordion-item-header>Warranty</nb-accordion-item-header>
                    <nb-accordion-item-body>Two years on every product.</nb-accordion-item-body>
                </nb-accordion-item>
            </nb-accordion>
        </div>
    `,
    imports: [NbAccordionComponent, NbAccordionItemComponent, NbAccordionItemHeaderComponent, NbAccordionItemBodyComponent]
})
export class AccordionSpecimenComponent {
    readonly kit = kit
}
