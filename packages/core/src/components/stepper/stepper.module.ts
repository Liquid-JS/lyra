import { NgModule } from '@angular/core'

import { NbIconModule } from '@liquid-js/lyr-core/icon'
import { NbStepperComponent } from './stepper.component'
import { NbStepComponent } from './step.component'
import { NbStepperNextDirective, NbStepperPreviousDirective } from './stepper-button.directive'

@NgModule({
    imports: [
        NbIconModule,
        NbStepperComponent,
        NbStepComponent,
        NbStepperNextDirective,
        NbStepperPreviousDirective
    ],
    exports: [NbStepperComponent, NbStepComponent, NbStepperNextDirective, NbStepperPreviousDirective]
})
export class NbStepperModule {
}
