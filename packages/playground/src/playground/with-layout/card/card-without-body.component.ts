import { Component } from '@angular/core';
import { fruits } from '../list/fruits-list';
import {
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbListComponent,
  NbListItemComponent,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './card-without-body.component.html',
  styles: [
    `
      nb-card {
        min-width: 18rem;
      }
    `,
  ],
  host: { class: 'example-height-60 example-horizontal-spread' },
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbListComponent,
    NbListItemComponent,
  ],
})
export class CardWithoutBodyComponent {
  fruits = fruits;
}
