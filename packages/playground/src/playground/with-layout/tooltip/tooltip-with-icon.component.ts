import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbButtonComponent, NbTooltipDirective } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-tooltip-with-icon',
    templateUrl: './tooltip-with-icon.component.html',
    styleUrls: ['./tooltip-examples.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbButtonComponent, NbTooltipDirective]
})
export class TooltipWithIconComponent {}
