import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbToggleComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toggle-label-position',
  templateUrl: './toggle-label-position.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbToggleComponent],
})
export class ToggleLabelPositionComponent {}
