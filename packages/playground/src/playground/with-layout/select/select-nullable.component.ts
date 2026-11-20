import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NbCardBodyComponent, NbCardComponent, NbOptionComponent, NbSelectComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-nullable',
  templateUrl: './select-nullable.component.html',
  imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent],
})
export class SelectNullableComponent {
  // `null` lets the app pick the encoding; it's a choice of its own, shown as "Auto".
  readonly encoding = new FormControl<string | null>(null);
}
