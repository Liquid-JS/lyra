import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './select-compare-with.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent],
})
export class SelectCompareWithComponent {
  compareById(v1: { id: number }, v2: { id: number }): boolean {
    return v1.id === v2.id;
  }
}
