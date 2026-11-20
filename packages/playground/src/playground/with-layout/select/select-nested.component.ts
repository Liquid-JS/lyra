import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbOptionComponent,
  NbOptionGroupComponent,
  NbOptionNestedComponent,
  NbSelectComponent,
} from '@liquid-js/lyr-core';

interface Region {
  name: string;
  countries: { name: string; cities: string[] }[];
}

@Component({
  selector: 'nb-select-nested',
  templateUrl: './select-nested.component.html',
  imports: [
    ReactiveFormsModule,
    NbCardComponent,
    NbCardBodyComponent,
    NbSelectComponent,
    NbOptionComponent,
    NbOptionGroupComponent,
    NbOptionNestedComponent,
  ],
})
export class SelectNestedComponent {
  readonly source = new FormControl<string | null>(null);
  readonly cities = new FormControl(['London']);

  readonly regions: Region[] = [
    {
      name: 'Europe',
      countries: [
        { name: 'United Kingdom', cities: ['London', 'Manchester', 'Edinburgh'] },
        { name: 'Italy', cities: ['Rome', 'Milan', 'Venice'] },
        { name: 'France', cities: ['Paris', 'Lyon', 'Nice'] },
      ],
    },
    {
      name: 'Asia',
      countries: [
        { name: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto'] },
        { name: 'India', cities: ['Mumbai', 'Delhi', 'Bengaluru'] },
      ],
    },
  ];
}
