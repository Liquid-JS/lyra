import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardComponent, NbCardBodyComponent, NbRadioGroupComponent, NbRadioComponent } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './radio-form.component.html',
  styleUrls: ['./radio-form.component.scss'],
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbRadioGroupComponent,
    FormsModule,
    NbRadioComponent,
    ReactiveFormsModule,
  ],
})
export class RadioFormComponent {

  ngModelValue = '1';
  formControl = new FormControl('1');
}
