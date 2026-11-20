import { Component } from '@angular/core';
import { NbButtonComponent, NbPopoverDirective } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-popover-showcase',
  templateUrl: './popover-showcase.component.html',
  styles: [
    `
      :host {
        display: block;
        padding-bottom: 5rem;
      }
    `,
  ],
  imports: [NbButtonComponent, NbPopoverDirective],
})
export class PopoverShowcaseComponent {}
