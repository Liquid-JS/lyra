import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbDatepickerDirective,
    NbRangepickerComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-rangepicker-showcase',
    templateUrl: './rangepicker-showcase.component.html',
    styleUrls: ['./datepicker-example.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        NbDatepickerDirective,
        NbRangepickerComponent
    ]
})
export class RangepickerShowcaseComponent {}
