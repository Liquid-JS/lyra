import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbToggleComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toggle-showcase',
  templateUrl: './toggle-showcase.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbToggleComponent],
})
export class ToggleShowcaseComponent {}
