import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbButtonComponent, NbTooltipDirective } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-tooltip-placements',
  templateUrl: './tooltip-placements.component.html',
  styleUrls: ['./tooltip-examples.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbButtonComponent, NbTooltipDirective],
})
export class TooltipPlacementsComponent {}
