import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonComponent,
    NbStepperComponent,
    NbStepComponent,
    NbInputDirective,
    NbStepperNextDirective
} from '@liquid-js/lyr-core'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'nb-stepper-linear',
    styleUrls: ['stepper-playground.component.scss'],
    templateUrl: './stepper-linear.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbButtonComponent,
        NbStepperComponent,
        NbStepComponent,
        FormsModule,
        NbInputDirective,
        NbStepperNextDirective
    ]
})
export class StepperLinearComponent {
    linearMode = true

    toggleLinearMode() {
        this.linearMode = !this.linearMode
    }
}
