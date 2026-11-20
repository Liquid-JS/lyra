import { NgModule } from '@angular/core';

import { NbIconModule } from '@liquid-js/lyr-core/icon';
import {
  NbCardActionsComponent,
  NbCardComponent,
  NbCardBodyComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbCardLinkDirective,
  NbCardMediaDirective,
} from './card.component';

import { NbRevealCardComponent } from './reveal-card/reveal-card.component';
import { NbFlipCardComponent } from './flip-card/flip-card.component';
import { NbCardFrontComponent, NbCardBackComponent } from './shared/shared.component';

const NB_CARD_COMPONENTS = [
  NbCardComponent,
  NbCardBodyComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbCardActionsComponent,
  NbCardLinkDirective,
  NbCardMediaDirective,
  NbRevealCardComponent,
  NbFlipCardComponent,
  NbCardFrontComponent,
  NbCardBackComponent,
];

@NgModule({
  imports: [NbIconModule, ...NB_CARD_COMPONENTS],
  exports: [...NB_CARD_COMPONENTS],
})
export class NbCardModule { }
