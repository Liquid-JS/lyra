import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbToggleComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toggle-status',
  templateUrl: './toggle-status.component.html',
  styles: [
    `
      .example-items-rows {
        align-items: center;
      }
    `,
  ],
  imports: [NbCardComponent, NbCardBodyComponent, NbToggleComponent],
})
export class ToggleStatusComponent {}
