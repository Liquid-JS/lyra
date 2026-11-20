import { Component, signal } from '@angular/core';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbIconComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-button-loading',
  templateUrl: './button-loading.component.html',
  imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbButtonComponent, NbIconComponent],
})
export class ButtonLoadingComponent {
  readonly saving = signal(false);
  readonly sending = signal(false);

  // Stands in for a request.
  run(state: typeof this.saving) {
    state.set(true);
    setTimeout(() => state.set(false), 2000);
  }
}
