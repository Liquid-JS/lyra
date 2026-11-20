import { NgModule } from '@angular/core'

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk'
import { NbPopoverDirective } from './popover.directive'
import { NbPopoverComponent } from './popover.component'

@NgModule({
    imports: [NbOverlayModule, NbPopoverDirective, NbPopoverComponent],
    exports: [NbPopoverDirective]
})
export class NbPopoverModule {
}
