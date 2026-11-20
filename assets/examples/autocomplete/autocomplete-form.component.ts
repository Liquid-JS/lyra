import { Component, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { map, startWith } from 'rxjs/operators'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbAutocompleteDirective,
    NbAutocompleteComponent,
    NbOptionComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-autocomplete-form',
    templateUrl: './autocomplete-form.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        FormsModule,
        NbAutocompleteDirective,
        ReactiveFormsModule,
        NbAutocompleteComponent,
        NbOptionComponent
    ]
})
export class AutocompleteFormComponent {

    readonly options = ['Option 1', 'Option 2', 'Option 3']
    readonly inputFormControl = new FormControl()
    readonly filteredControlOptions = toSignal(
        this.inputFormControl.valueChanges.pipe(
            startWith(''),
            map((filterString) => this.filter(filterString))
        )
    )
    readonly filteredNgModelOptions = signal(this.options)
    value?: string

    private filter(value: string): string[] {
    // The model is null or undefined when the input is cleared.
        const filterValue = (value ?? '').toLowerCase()
        return this.options.filter((optionValue) => optionValue.toLowerCase().includes(filterValue))
    }

    onModelChange(value: string) {
        this.filteredNgModelOptions.set(this.filter(value))
    }
}
