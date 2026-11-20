import { NgModule } from '@angular/core';

import { NbRouteTabsetComponent } from './route-tabset.component';
import { NbMergeConfigsPipe } from './merge-configs.pipe';
import { NbIconModule } from '@liquid-js/lyr-core/icon';

@NgModule({
  imports: [NbIconModule, NbRouteTabsetComponent, NbMergeConfigsPipe],
  exports: [NbRouteTabsetComponent],
})
export class NbRouteTabsetModule {}
