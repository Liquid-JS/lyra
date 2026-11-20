import { NgModule } from '@angular/core';

import { NbIconModule } from '@liquid-js/lyr-core/icon';
import { NbAccordionComponent } from './accordion.component';
import { NbAccordionItemComponent } from './accordion-item.component';
import { NbAccordionItemHeaderComponent } from './accordion-item-header.component';
import { NbAccordionItemBodyComponent } from './accordion-item-body.component';

const NB_ACCORDION_COMPONENTS = [
  NbAccordionComponent,
  NbAccordionItemComponent,
  NbAccordionItemHeaderComponent,
  NbAccordionItemBodyComponent,
];

@NgModule({
  imports: [NbIconModule, ...NB_ACCORDION_COMPONENTS],
  exports: [...NB_ACCORDION_COMPONENTS],
  providers: [],
})
export class NbAccordionModule {}
