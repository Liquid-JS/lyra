import { Component } from '@angular/core'
import { NbButtonComponent, NbPopoverDirective } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-popover-modes',
    templateUrl: './popover-modes.component.html',
    styles: [
        `
      :host {
        display: block;
        padding-bottom: 5rem;
      }

      button + button {
        margin-inline-start: 1rem;
      }
    `
    ],
    imports: [NbButtonComponent, NbPopoverDirective]
})
export class PopoverModesComponent {}
