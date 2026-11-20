import { NgModule } from '@angular/core'

import { NbLabelComponent } from './label.component'
import { NbValidationDirective } from './validation.directive'
import { NbValidationErrorDirective, NbValidationErrorsComponent } from './validation-errors.component'
import { NbValidationErrorsPipe, NbValidationMessagePipe } from './validation-messages'

const COMPONENTS = [
    NbValidationDirective,
    NbValidationErrorsComponent,
    NbValidationErrorDirective,
    NbValidationErrorsPipe,
    NbValidationMessagePipe,
    NbLabelComponent
]

@NgModule({
    imports: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class NbValidationModule {}
