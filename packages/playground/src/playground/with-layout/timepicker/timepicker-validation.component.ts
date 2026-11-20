import { Component } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbInputDirective,
    NbTimePickerComponent,
    NbTimePickerDirective,
    NbValidationModule
} from '@liquid-js/lyr-core'

const at = (hours: number, minutes: number) => {
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
}

@Component({
    selector: 'nb-timepicker-validation',
    templateUrl: './timepicker-validation.component.html',
    styleUrls: ['./timepicker-example.scss'],
    styles: `
    .validation-example {
      display: block;
      max-width: 22rem;
      text-align: start;
    }

    .label {
      display: block;
      margin-bottom: 0.25rem;
    }
  `,
    imports: [
        ReactiveFormsModule,
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        NbTimePickerComponent,
        NbTimePickerDirective,
        NbValidationModule
    ]
})
export class TimepickerValidationComponent {
    /** The shop's opening hours. */
    readonly opens = at(9, 0)
    readonly closes = at(17, 30)

    readonly form = new FormGroup({
        pickup: new FormControl<Date | null>(at(12, 0), Validators.required)
    })
}
