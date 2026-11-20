import { Component } from '@angular/core';
import { NbCardModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-card-appearances',
  templateUrl: './card-appearances.component.html',
  styles: `
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1rem;
    }
  `,
  imports: [NbCardModule],
})
export class CardAppearancesComponent {}
