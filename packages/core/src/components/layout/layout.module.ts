import { NgModule } from '@angular/core'

import {
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent
} from './layout.component'

import { NbShownAboveDirective, NbShownBelowDirective } from './layout-breakpoint.directive'
import { NbLtrDirective, NbRtlDirective } from './layout-direction.directive'

const NB_LAYOUT_COMPONENTS = [
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent
]

const NB_LAYOUT_DIRECTIVES = [NbLtrDirective, NbRtlDirective, NbShownBelowDirective, NbShownAboveDirective]

@NgModule({
    imports: [...NB_LAYOUT_COMPONENTS, ...NB_LAYOUT_DIRECTIVES],
    exports: [...NB_LAYOUT_COMPONENTS, ...NB_LAYOUT_DIRECTIVES]
})
export class NbLayoutModule {}
