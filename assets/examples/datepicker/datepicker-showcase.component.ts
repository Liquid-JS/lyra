import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbDatepickerDirective,
    NbDatepickerComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-datepicker-showcase',
    templateUrl: './datepicker-showcase.component.html',
    styleUrls: ['./datepicker-example.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        NbDatepickerDirective,
        NbDatepickerComponent
    ]
})
export class DatepickerShowcaseComponent {}
