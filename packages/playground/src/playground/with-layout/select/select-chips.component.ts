import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NbCardBodyComponent, NbCardComponent, NbOptionComponent, NbSelectComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-chips',
  templateUrl: './select-chips.component.html',
  imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent],
})
export class SelectChipsComponent {
  readonly allergens = ['Gluten', 'Milk', 'Eggs', 'Nuts', 'Soy', 'Sesame'];
  readonly selected = new FormControl(['Milk', 'Nuts']);
}
