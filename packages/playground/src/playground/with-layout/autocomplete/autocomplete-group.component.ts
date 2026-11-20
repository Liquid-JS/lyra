import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbInputDirective,
  NbAutocompleteDirective,
  NbAutocompleteComponent,
  NbOptionGroupComponent,
  NbOptionComponent,
} from '@liquid-js/lyr-core';

export interface Group {
  name: string;
  children: string[];
}

@Component({
  selector: 'nb-autocomplete-group',
  templateUrl: './autocomplete-group.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    FormsModule,
    NbAutocompleteDirective,
    ReactiveFormsModule,
    NbAutocompleteComponent,
    NbOptionGroupComponent,
    NbOptionComponent,
  ],
})
export class AutocompleteGroupComponent {

  readonly groups: Group[] = [
    {
      name: 'Group 1',
      children: ['Option 11', 'Option 12', 'Option 13'],
    },
    {
      name: 'Group 2',
      children: ['Option 21', 'Option 22', 'Option 23'],
    },
    {
      name: 'Group 3',
      children: ['Option 31', 'Option 32', 'Option 33'],
    },
  ];

  readonly inputFormControl = new FormControl();
  readonly filteredGroups = toSignal(
    this.inputFormControl.valueChanges.pipe(
      startWith(''),
      map((filterString) => this.filter(filterString)),
    ),
  );

  private filterChildren(children: string[], filterValue: string) {
    return children.filter((optionValue) => optionValue.toLowerCase().includes(filterValue));
  }

  private filter(value: string): Group[] {
    const filterValue = value.toLowerCase();
    return this.groups
      .map((group) => {
        return {
          name: group.name,
          children: this.filterChildren(group.children, filterValue),
        };
      })
      .filter((group) => group.children.length);
  }

  trackByFn(index: number, item: Group) {
    return item.name;
  }

}
