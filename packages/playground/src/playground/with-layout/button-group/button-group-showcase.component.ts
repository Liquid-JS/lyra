import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbButtonGroupComponent,
  NbButtonToggleDirective,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-button-group-showcase',
  templateUrl: './button-group-showcase.component.html',
  styleUrls: ['./button-group-showcase.component.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbButtonGroupComponent, NbButtonToggleDirective],
})
export class ButtonGroupShowcaseComponent {
  isBold = false;
  isItalic = true;
  isUnderline = false;
}
