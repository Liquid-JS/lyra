import { Component } from '@angular/core';
import { NbButtonComponent, NbPopoverDirective } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-popover-placements',
  templateUrl: './popover-placements.component.html',
  styles: [
    `
      :host {
        display: block;
        margin: 4rem 0;
      }

      button {
        margin: 1rem;
      }
    `,
  ],
  imports: [NbButtonComponent, NbPopoverDirective],
})
export class PopoverPlacementsComponent {}
