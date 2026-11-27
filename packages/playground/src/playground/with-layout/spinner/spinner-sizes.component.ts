import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbSpinnerDirective } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-spinner-sizes',
    templateUrl: './spinner-sizes.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [NbCardComponent, NbSpinnerDirective, NbCardBodyComponent]
})
export class SpinnerSizesComponent {
}
