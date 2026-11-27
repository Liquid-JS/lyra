import { Component } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbRadioGroupComponent,
    NbRadioComponent
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './radio-disabled-group.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbRadioGroupComponent,
        NbRadioComponent,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class RadioDisabledGroupComponent {
    options = [
        { value: 'This is value 1', label: 'Option 1' },
        { value: 'This is value 2', label: 'Option 2' },
        { value: 'This is value 3', label: 'Option 3' },
        { value: 'This is value 4', label: 'Option 4' },
        { value: 'This is value 5', label: 'Option 5' }
    ]

    formControl = new FormControl({
        value: 'This is value 1',
        disabled: true
    })
}
