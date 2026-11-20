import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardComponent, NbCardBodyComponent, NbToggleComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toggle-form',
  templateUrl: './toggle-form.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbToggleComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ToggleFormComponent {
  toggleNgModel = true;

  toggleFormControl = new FormControl();
}
