import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbButtonGroupComponent,
  NbButtonComponent,
  NbButtonToggleDirective,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './button-and-button-toggle-groups.component.html',
  styleUrls: ['./button-group-spacing.scss'],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonGroupComponent,
    NbButtonComponent,
    NbButtonToggleDirective,
  ],
})
export class ButtonAndButtonToggleGroupsComponent {
}
