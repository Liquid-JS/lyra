import { Component } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbInputDirective,
  NbTimePickerDirective,
  NbTimePickerComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-timepicker-showcase',
  templateUrl: './timepicker-showcase.component.html',
  styleUrls: ['./timepicker-example.scss'],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbTimePickerDirective,
    NbTimePickerComponent,
  ],
})
export class TimepickerShowcaseComponent {
}
