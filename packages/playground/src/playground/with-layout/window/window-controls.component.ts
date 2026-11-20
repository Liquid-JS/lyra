import { Component, inject } from '@angular/core';
import {
  NbWindowService,
  NbWindowState,
  NbCardComponent,
  NbCardBodyComponent,
  NbCheckboxComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

import { FormComponent } from './components/form.component';

@Component({
  templateUrl: 'window-controls.component.html',
  styleUrls: ['./window.scss', './window-controls.component.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbCheckboxComponent, NbButtonComponent],
})
export class WindowControlsComponent {
  private readonly windowService = inject(NbWindowService);

  fullScreen = true;
  docked = true;
  minimized = true;
  closeButton = true;

  openWindow() {
    const states = [
      this.fullScreen && NbWindowState.FULL_SCREEN,
      this.docked && NbWindowState.DOCKED,
      this.minimized && NbWindowState.MINIMIZED,
    ].filter((state) => !!state);

    this.windowService.open(FormComponent, { title: `Window`, states, closeButton: this.closeButton });
  }
}
