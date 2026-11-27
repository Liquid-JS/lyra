import { Component } from '@angular/core'
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbCardMediaDirective,
    NbIconComponent,
    NbTagComponent
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


    img {
      height: 10rem;
    }

    /* The picture and what goes over it share one grid cell, each placed in it. */
    .with-overlay {
      display: grid;
    }

    .with-overlay > * {
      grid-area: 1 / 1;
    }

    .with-overlay img {
      width: 100%;
      object-fit: cover;
    }

    .with-overlay nb-tag {
      place-self: start end;
      margin: 0.75rem;
    }

    .caption {
      align-self: end;
      margin: 0;
      padding: 2rem 1rem 0.75rem;
      background: linear-gradient(transparent, rgb(0 0 0 / 60%));
      color: white;
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
    imports: [NbCardComponent, NbCardBodyComponent, NbCardMediaDirective, NbIconComponent, NbTagComponent]
})
export class CardMediaComponent {}
