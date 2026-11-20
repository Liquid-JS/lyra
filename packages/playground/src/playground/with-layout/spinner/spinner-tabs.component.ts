import { Component, signal } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbTabsetComponent,
  NbTabComponent,
  NbSpinnerDirective,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-app-spinner-tabs',
  templateUrl: './spinner-tabs.component.html',
  styles: [
    `
      :host nb-tab {
        padding: 1.25rem;
      }
    `,
  ],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbTabsetComponent,
    NbTabComponent,
    NbSpinnerDirective,
  ],
})
export class SpinnerTabsComponent {
  readonly loading = signal(false);

  toggleLoadingAnimation() {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 20000);
  }
}
