import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbOptionComponent,
  NbOptionGroupComponent,
  NbSelectComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-select-search',
  templateUrl: './select-search.component.html',
  imports: [
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbSelectComponent,
    NbOptionComponent,
    NbOptionGroupComponent,
  ],
})
export class SelectSearchComponent {
  readonly regions = [
    { name: 'Europe', countries: ['Austria', 'Belgium', 'France', 'Germany', 'Ireland', 'Italy', 'Spain'] },
    // Search ignores accents, so "curacao" finds Curaçao.
    { name: 'Americas', countries: ['Brazil', 'Canada', 'Curaçao', 'Mexico', 'United States'] },
    { name: 'Asia', countries: ['India', 'Japan', 'South Korea', 'Vietnam'] },
  ];
  readonly country = new FormControl<string | null>(null);
  readonly countries = new FormControl(new Array<string>());
}
