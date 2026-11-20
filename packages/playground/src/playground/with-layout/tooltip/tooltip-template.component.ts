import { Component } from '@angular/core';
import { NbButtonComponent, NbCardBodyComponent, NbCardComponent, NbTooltipDirective } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-tooltip-template',
  templateUrl: './tooltip-template.component.html',
  styleUrls: ['./tooltip-examples.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbButtonComponent, NbTooltipDirective],
})
export class TooltipTemplateComponent {
  readonly storage = { used: '3.2 GB', total: '5 GB' };
}
