import { NgModule } from '@angular/core';

import { NbActionComponent, NbActionsComponent } from './actions.component';

import { NbBadgeModule } from '@liquid-js/lyr-core/badge';
import { NbIconModule } from '@liquid-js/lyr-core/icon';

const NB_ACTIONS_COMPONENTS = [
  NbActionComponent,
  NbActionsComponent,
];

@NgModule({
  imports: [NbBadgeModule, NbIconModule, ...NB_ACTIONS_COMPONENTS],
  exports: [...NB_ACTIONS_COMPONENTS],
})
export class NbActionsModule { }
