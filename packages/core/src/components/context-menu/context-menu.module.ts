import { NgModule } from '@angular/core'

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk'
import { NbMenuModule } from '@liquid-js/lyr-core/menu'
import { NbContextMenuDirective } from './context-menu.directive'
import { NbContextMenuComponent } from './context-menu.component'

@NgModule({
    imports: [NbOverlayModule, NbMenuModule, NbContextMenuDirective, NbContextMenuComponent],
    exports: [NbContextMenuDirective]
})
export class NbContextMenuModule {
}
