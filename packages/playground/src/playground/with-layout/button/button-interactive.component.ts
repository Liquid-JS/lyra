import { Component } from '@angular/core';
import {
  NbButtonAppearance,
  NbComponentStatus,
  NbComponentShape,
  NbComponentSize,
  NbCardComponent,
  NbCardBodyComponent,
  NbRadioGroupComponent,
  NbRadioComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: 'button-interactive.component.html',
  styleUrls: ['./button-interactive.component.scss'],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbRadioGroupComponent,
    NbRadioComponent,
    NbButtonComponent,
  ],
})
export class ButtonInteractiveComponent {
  appearances: NbButtonAppearance[] = ['filled', 'outline', 'ghost', 'hero'];
  shapes: NbComponentShape[] = ['rectangle', 'semi-round', 'round'];
  statuses: NbComponentStatus[] = ['basic', 'primary', 'success', 'info', 'warning', 'danger', 'control'];
  sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];

  selectedShape: NbComponentShape = 'rectangle';
  selectedSize: NbComponentSize = 'medium';
  showDisabledRow = true;
}
