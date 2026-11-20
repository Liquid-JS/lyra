import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbDatepickerDirective,
    NbDateTimePickerComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-date-timepicker-showcase',
    templateUrl: './date-timepicker-showcase.component.html',
    styleUrls: ['./datepicker-example.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        NbDatepickerDirective,
        NbDateTimePickerComponent
    ]
})
export class DateTimepickerShowcaseComponent {}
