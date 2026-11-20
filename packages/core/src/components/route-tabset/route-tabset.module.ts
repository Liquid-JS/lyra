import { NgModule } from '@angular/core'

import { NbIconModule } from '@liquid-js/lyr-core/icon'
import { NbRouteTabsetComponent } from './route-tabset.component'
import { NbMergeConfigsPipe } from './merge-configs.pipe'

@NgModule({
    imports: [NbIconModule, NbRouteTabsetComponent, NbMergeConfigsPipe],
    exports: [NbRouteTabsetComponent]
})
export class NbRouteTabsetModule {}
