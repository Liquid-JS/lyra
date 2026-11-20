import { Component } from '@angular/core'
import {
    NbStepChangeEvent,
    NbCardComponent,
    NbCardBodyComponent,
    NbStepperComponent,
    NbStepComponent,
    NbButtonComponent,
    NbStepperPreviousDirective,
    NbStepperNextDirective
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './stepper-step-change-event.component.html',
    styleUrls: ['./stepper-step-change-event.component.scss'],
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
export class StepperStepChangeEventComponent {
    changeEvent?: NbStepChangeEvent

    handleStepChange(e: NbStepChangeEvent) {
        this.changeEvent = e
    }
}
