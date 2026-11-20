import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbInputDirective,
  NbOptionComponent,
  NbSelectComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-input-ghost',
  templateUrl: './input-ghost.component.html',
  imports: [
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbSelectComponent,
    NbOptionComponent,
  ],
})
export class InputGhostComponent {
  readonly title = new FormControl('Quarterly report');
  readonly status = new FormControl('draft');
}
