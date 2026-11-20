import { Component } from '@angular/core';
import {
  NbAccordionComponent,
  NbAccordionItemComponent,
  NbAccordionItemHeaderComponent,
  NbAccordionItemBodyComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-accordion-showcase',
  templateUrl: './accordion-showcase.component.html',
  imports: [
    NbAccordionComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbAccordionItemBodyComponent,
  ],
})
export class AccordionShowcaseComponent {}
