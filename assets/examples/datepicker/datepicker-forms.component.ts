import { Component } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbDatepickerDirective,
    NbDatepickerComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-datepicker-forms',
    templateUrl: './datepicker-forms.component.html',
    styleUrls: ['./datepicker-example.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        NbDatepickerDirective,
        FormsModule,
        ReactiveFormsModule,
        NbDatepickerComponent
    ]
})
export class DatepickerFormsComponent {
    formControl = new FormControl(new Date())
    ngModelDate = new Date()
}
