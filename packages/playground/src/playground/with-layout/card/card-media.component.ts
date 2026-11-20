import { Component } from '@angular/core'
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbCardMediaDirective,
    NbIconComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-media',
    templateUrl: './card-media.component.html',
    styles: `
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
      gap: 1.5rem;
    }

    nb-card {
      margin: 0;
    }

    img {
      height: 10rem;
    }

    .block {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 10rem;
      background-image: linear-gradient(var(--color-primary-transparent-200), var(--color-primary-transparent-200));
      color: var(--color-primary-default);
      font-size: 3rem;
    }
  `,
    imports: [NbCardComponent, NbCardBodyComponent, NbCardMediaDirective, NbIconComponent]
})
export class CardMediaComponent {}
