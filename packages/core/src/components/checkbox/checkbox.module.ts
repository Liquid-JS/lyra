import { NgModule } from '@angular/core'

import { NbIconModule } from '@liquid-js/lyr-core/icon'
import { NbCheckboxComponent } from './checkbox.component'

@NgModule({
    imports: [NbIconModule, NbCheckboxComponent],
    exports: [NbCheckboxComponent]
})
export class NbCheckboxModule { }
