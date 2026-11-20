import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbCheckboxComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-checkbox-disabled',
  templateUrl: './checkbox-disabled.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbCheckboxComponent],
})
export class CheckboxDisabledComponent {}
