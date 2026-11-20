import { Component } from '@angular/core'
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
    selector: 'nb-autocomplete-custom-display',
    templateUrl: './autocomplete-custom-display.component.html',
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
export class AutocompleteCustomDisplayComponent {

    readonly options = ['Option 1', 'Option 2', 'Option 3']
    readonly inputFormControl = new FormControl()
    readonly filteredOptions = toSignal(
        this.inputFormControl.valueChanges.pipe(
            startWith(''),
            map((filterString) => this.filter(filterString))
        )
    )

    private filter(value: string): string[] {
        const filterValue = value.toLowerCase()
        return this.options.filter((optionValue) => optionValue.toLowerCase().includes(filterValue))
    }

    viewHandle(value: string) {
        return value.toUpperCase()
    }
}
