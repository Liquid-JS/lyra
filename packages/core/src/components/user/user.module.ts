import { NgModule } from '@angular/core'

import { NbBadgeModule } from '@liquid-js/lyr-core/badge'
import {
    NbUserComponent
} from './user.component'

const NB_USER_COMPONENTS = [
    NbUserComponent
]

@NgModule({
    imports: [NbBadgeModule, ...NB_USER_COMPONENTS],
    exports: [...NB_USER_COMPONENTS]
})
export class NbUserModule { }
