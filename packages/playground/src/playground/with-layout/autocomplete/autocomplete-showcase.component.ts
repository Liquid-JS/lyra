import { Component, ElementRef, signal, viewChild } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbInputDirective,
  NbAutocompleteDirective,
  NbAutocompleteComponent,
  NbOptionComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-autocomplete-showcase',
  templateUrl: './autocomplete-showcase.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbAutocompleteDirective,
    NbAutocompleteComponent,
    NbOptionComponent,
  ],
})
export class AutocompleteShowcaseComponent {

  readonly options = ['Option 1', 'Option 2', 'Option 3'];
  readonly filteredOptions = signal(this.options);

  readonly input = viewChild.required<ElementRef<HTMLInputElement>>('autoInput');

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((optionValue) => optionValue.toLowerCase().includes(filterValue));
  }

  onChange() {
    this.filteredOptions.set(this.filter(this.input().nativeElement.value));
  }

  onSelectionChange(value?: string) {
    this.filteredOptions.set(this.filter(value ?? ''));
  }

}
