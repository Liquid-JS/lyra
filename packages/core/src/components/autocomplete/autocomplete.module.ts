import { NgModule } from '@angular/core'

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk'
import { NbCardModule } from '@liquid-js/lyr-core/card'
import { FormsModule } from '@angular/forms'
import { NbOptionModule } from '../option/option-list.module'
import { NbAutocompleteComponent } from './autocomplete.component'
import { NbAutocompleteDirective } from './autocomplete.directive'

const NB_AUTOCOMPLETE_COMPONENTS = [
    NbAutocompleteComponent,
    NbAutocompleteDirective
]

@NgModule({
    imports: [
        FormsModule,
        NbOverlayModule,
        NbCardModule,
        NbOptionModule,
        ...NB_AUTOCOMPLETE_COMPONENTS
    ],
    exports: [...NB_AUTOCOMPLETE_COMPONENTS, NbOptionModule]
})
export class NbAutocompleteModule {
}
