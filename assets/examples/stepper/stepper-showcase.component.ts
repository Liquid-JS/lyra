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
    selector: 'nb-stepper-showcase',
    styleUrls: ['stepper-playground.component.scss'],
    templateUrl: './stepper-showcase.component.html',
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
export class StepperShowcaseComponent {}
