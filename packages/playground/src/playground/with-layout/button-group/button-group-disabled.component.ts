import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbButtonGroupComponent,
  NbButtonToggleDirective,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './button-group-disabled.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbButtonGroupComponent, NbButtonToggleDirective],
})
export class ButtonGroupDisabledComponent {
}
