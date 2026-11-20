import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbProgressBarComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-progress-bar-size',
  templateUrl: './progress-bar-size.component.html',
  styles: [
    `
      nb-progress-bar ~ nb-progress-bar {
        margin-top: 1rem;
      }
    `,
  ],
  imports: [NbCardComponent, NbCardBodyComponent, NbProgressBarComponent],
})
export class ProgressBarSizeComponent {}
