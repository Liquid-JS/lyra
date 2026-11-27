import { Component } from '@angular/core'
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-accents',
    templateUrl: './card-accents.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent]
})
export class CardAccentsComponent {
}
