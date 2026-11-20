import { NgModule } from '@angular/core';
import { NbIconModule } from '@liquid-js/lyr-core/icon';

import { NbToggleComponent } from './toggle.component';

@NgModule({
  imports: [NbIconModule, NbToggleComponent],
  exports: [NbToggleComponent],
})
export class NbToggleModule { }
