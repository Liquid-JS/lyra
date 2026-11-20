import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbDatepickerDirective,
    NbDateTimePickerComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-date-timepicker-single-column',
    templateUrl: './date-timepicker-single-column.component.html',
    styleUrls: ['./datepicker-example.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        NbDatepickerDirective,
        NbDateTimePickerComponent
    ]
})
export class DateTimepickerSingleColumnComponent {
}
