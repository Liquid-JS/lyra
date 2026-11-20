import { Component } from '@angular/core';
import { DynamicToAddComponent } from './components/dynamic.components';
import { NbButtonComponent, NbPopoverDirective } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-popover-custom-component',
  templateUrl: './popover-custom-component.component.html',
  styles: [
    `
      :host {
        display: block;
        padding-bottom: 3rem;
      }

      ::ng-deep nb-popover {
        padding: 1rem;
      }
    `,
  ],
  imports: [NbButtonComponent, NbPopoverDirective],
})
export class PopoverCustomComponentComponent {
  customComponent = DynamicToAddComponent;
}
