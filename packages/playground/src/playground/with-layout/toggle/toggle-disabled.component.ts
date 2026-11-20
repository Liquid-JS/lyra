import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbToggleComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toggle-disabled',
  templateUrl: './toggle-disabled.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbToggleComponent],
})
export class ToggleDisabledComponent {}
