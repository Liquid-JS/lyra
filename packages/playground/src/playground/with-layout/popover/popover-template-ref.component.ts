import { Component } from '@angular/core';
import { NbButtonComponent, NbPopoverDirective, NbCardComponent, NbCardBodyComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-popover-template-ref',
  templateUrl: './popover-template-ref.component.html',
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 5rem;
      }
    `,
  ],
  imports: [NbButtonComponent, NbPopoverDirective, NbCardComponent, NbCardBodyComponent],
})
export class PopoverTemplateRefComponent {}
