import { NgModule } from '@angular/core'

import { NbIconModule } from '@liquid-js/lyr-core/icon'
import { NbAccordionComponent } from './accordion.component'
import { NbAccordionItemComponent } from './accordion-item.component'
import { NbAccordionItemHeaderComponent } from './accordion-item-header.component'
import { NbAccordionItemBodyComponent } from './accordion-item-body.component'
import { NbAccordionItemBodyContentDirective } from './accordion-item-body-content.directive'

const NB_ACCORDION_COMPONENTS = [
    NbAccordionComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemBodyContentDirective
]

@NgModule({
    imports: [NbIconModule, ...NB_ACCORDION_COMPONENTS],
    exports: [...NB_ACCORDION_COMPONENTS],
    providers: []
})
export class NbAccordionModule {}
