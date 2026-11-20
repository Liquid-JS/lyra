import { NgModule } from '@angular/core';

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk';
import { NbIconModule } from '@liquid-js/lyr-core/icon';
import { NbButtonModule } from '@liquid-js/lyr-core/button';

import { NbSearchComponent, NbSearchFieldComponent } from './search.component';

@NgModule({
  imports: [
    NbOverlayModule,
    NbIconModule,
    NbButtonModule,
    NbSearchComponent,
    NbSearchFieldComponent,
  ],
  exports: [NbSearchComponent, NbSearchFieldComponent],
})
export class NbSearchModule {
}
