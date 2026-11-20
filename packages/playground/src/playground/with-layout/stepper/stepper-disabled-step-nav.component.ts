import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbStepperComponent,
    NbStepComponent,
    NbButtonComponent,
    NbStepperPreviousDirective,
    NbStepperNextDirective
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './stepper-disabled-step-nav.component.html',
    styleUrls: ['./stepper-disabled-step-nav.component.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbStepperComponent,
        NbStepComponent,
        NbButtonComponent,
        NbStepperPreviousDirective,
        NbStepperNextDirective
    ]
})
export class StepperDisabledStepNavComponent {}
