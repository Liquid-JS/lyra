import { Component } from '@angular/core';
import {
  NbAlertComponent,
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbCheckboxComponent,
  NbComponentStatus,
  NbInputDirective,
  NbOptionComponent,
  NbProgressBarComponent,
  NbRadioComponent,
  NbRadioGroupComponent,
  NbSelectComponent,
  NbTagComponent,
  NbToggleComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

/** Components in every status, which the docs' theme editor shows its theme on. */
@Component({
  templateUrl: './theme-editor-preview.component.html',
  styleUrls: ['./theme-editor-preview.component.scss'],
  imports: [
    NbAlertComponent,
    NbButtonComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbCheckboxComponent,
    NbInputDirective,
    NbOptionComponent,
    NbProgressBarComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent,
    NbTagComponent,
    NbToggleComponent,
    NbUserComponent,
  ],
})
export class ThemeEditorPreviewComponent {
  readonly statuses: NbComponentStatus[] = ['primary', 'success', 'info', 'warning', 'danger'];
  readonly alerts: NbComponentStatus[] = ['primary', 'success', 'danger'];
}
