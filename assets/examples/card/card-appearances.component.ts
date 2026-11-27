import { Component } from '@angular/core'
import { NbCardModule } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-appearances',
    templateUrl: './card-appearances.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1rem;
    }
  `,
    imports: [NbCardModule]
})
export class CardAppearancesComponent {}
