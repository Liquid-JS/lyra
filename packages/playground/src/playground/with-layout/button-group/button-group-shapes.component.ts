import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-button-group-shapes',
    templateUrl: './button-group-shapes.component.html',
    styleUrls: ['./button-group-spacing.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbButtonGroupComponent, NbButtonToggleDirective]
})
export class ButtonGroupShapesComponent {
}
