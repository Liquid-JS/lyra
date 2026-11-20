import { Component, viewChild } from '@angular/core';
import {
  NbPopoverDirective,
  NbInputDirective,
  NbPopoverDirective as NbPopoverDirective_1,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-popover-noop',
  templateUrl: './popover-noop.component.html',
  styles: [
    `
      button {
        margin-inline-end: 1rem;
        margin-top: 1rem;
      }
    `,
  ],
  imports: [NbInputDirective, NbPopoverDirective_1, NbButtonComponent],
})
export class PopoverNoopComponent {
  readonly popover = viewChild.required(NbPopoverDirective);

  open() {
    this.popover().show();
  }

  close() {
    this.popover().hide();
  }
}
