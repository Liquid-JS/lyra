import { Component } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonComponent,
    NbInputDirective,
    NbAutocompleteDirective,
    NbAutocompleteComponent,
    NbOptionComponent
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './autocomplete-disabled.component.html',
    styleUrls: ['./autocomplete-disabled.component.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbButtonComponent,
        NbInputDirective,
        NbAutocompleteDirective,
        FormsModule,
        ReactiveFormsModule,
        NbAutocompleteComponent,
        NbOptionComponent
    ]
})
export class AutocompleteDisabledComponent {
    options = ['Option 1', 'Option 2', 'Option 3']
    disabled = true
    inputFormControl = new FormControl()

    toggleDisabled() {
        this.disabled = !this.disabled
        if (this.disabled) {
            this.inputFormControl.disable()
        } else {
            this.inputFormControl.enable()
        }
    }
}
