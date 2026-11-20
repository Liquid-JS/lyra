import { Component } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbTimePickerDirective,
    NbTimePickerComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-timepicker-form-control',
    templateUrl: './timepicker-form-control.component.html',
    styleUrls: ['./timepicker-example.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        FormsModule,
        NbTimePickerDirective,
        ReactiveFormsModule,
        NbTimePickerComponent
    ]
})
export class TimepickerFormControlComponent {
    formControl = new FormControl(new Date())
}
