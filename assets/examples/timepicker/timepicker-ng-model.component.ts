import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbTimePickerDirective,
    NbTimePickerComponent
} from '@liquid-js/lyr-core'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'nb-timepicker-ng-model',
    templateUrl: './timepicker-ng-model.component.html',
    styleUrls: ['./timepicker-example.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        FormsModule,
        NbTimePickerDirective,
        NbTimePickerComponent
    ]
})
export class TimepickerNgModelComponent {
    date = new Date()
}
