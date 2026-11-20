import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbCheckboxComponent, NbButtonComponent } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './checkbox-indeterminate.component.html',
  styles: [
    `
      button {
        display: block;
        margin-top: 1rem;
      }
    `,
  ],
  imports: [NbCardComponent, NbCardBodyComponent, NbCheckboxComponent, NbButtonComponent],
})
export class CheckboxIndeterminateComponent {}
