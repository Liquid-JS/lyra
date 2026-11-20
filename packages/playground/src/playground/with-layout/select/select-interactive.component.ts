import { Component } from '@angular/core';
import {
  NbComponentShape,
  NbComponentSize,
  NbComponentStatus,
  NbCardComponent,
  NbCardBodyComponent,
  NbCardHeaderComponent,
  NbRadioGroupComponent,
  NbRadioComponent,
  NbButtonComponent,
  NbSelectComponent,
  NbOptionComponent,
  NbOptionGroupComponent,
} from '@liquid-js/lyr-core';
import { NbSelectAppearance } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-interactive',
  templateUrl: './select-interactive.component.html',
  styleUrls: ['./select-interactive.component.scss'],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbRadioGroupComponent,
    NbRadioComponent,
    NbButtonComponent,
    NbCardHeaderComponent,
    NbSelectComponent,
    NbOptionComponent,
    NbOptionGroupComponent,
  ],
})
export class SelectInteractiveComponent {
  singleSelectValue = '1';
  multipleSelectValue = ['1'];
  disabledOptionValue = '3';

  selectedSize: NbComponentSize = 'medium';
  selectedShape: NbComponentShape = 'rectangle';

  fullWidth = true;

  appearances: NbSelectAppearance[] = ['outline', 'filled', 'hero'];
  sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];
  shapes: NbComponentShape[] = ['rectangle', 'semi-round', 'round'];
  statuses: NbComponentStatus[] = ['basic', 'primary', 'success', 'info', 'warning', 'danger', 'control'];

  selectDisabledOption() {
    this.singleSelectValue = this.disabledOptionValue;
    this.multipleSelectValue = [this.disabledOptionValue];
  }

  toggleFullWidth() {
    this.fullWidth = !this.fullWidth;
  }
}
