import { NgModule } from '@angular/core'

import { NbButtonComponent } from './button.component'

const NB_BUTTON_COMPONENTS = [
    NbButtonComponent
]

@NgModule({
    imports: [...NB_BUTTON_COMPONENTS],
    exports: [...NB_BUTTON_COMPONENTS]
})
export class NbButtonModule { }
