import { Component } from '@angular/core'
import {
    NbStepperComponent,
    NbStepComponent,
    NbButtonComponent,
    NbStepperPreviousDirective,
    NbStepperNextDirective
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-stepper-test',
    templateUrl: './stepper-test.component.html',
    imports: [
        NbStepperComponent,
        NbStepComponent,
        NbButtonComponent,
        NbStepperPreviousDirective,
        NbStepperNextDirective
    ]
})
export class StepperTestComponent {}
