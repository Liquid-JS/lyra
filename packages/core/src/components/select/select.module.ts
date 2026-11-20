import { NgModule } from '@angular/core'

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk'
import { NbInputModule } from '@liquid-js/lyr-core/input'
import { NbCardModule } from '@liquid-js/lyr-core/card'
import { NbButtonModule } from '@liquid-js/lyr-core/button'
import { NbIconModule } from '@liquid-js/lyr-core/icon'
import { NbOptionModule } from '../option/option-list.module'
import { NbSelectComponent, NbSelectLabelComponent } from './select.component'

const NB_SELECT_COMPONENTS = [NbSelectComponent, NbSelectLabelComponent]

@NgModule({
    imports: [
        NbOverlayModule,
        NbButtonModule,
        NbInputModule,
        NbCardModule,
        NbIconModule,
        NbOptionModule,
        ...NB_SELECT_COMPONENTS
    ],
    exports: [...NB_SELECT_COMPONENTS, NbOptionModule]
})
export class NbSelectModule {}
