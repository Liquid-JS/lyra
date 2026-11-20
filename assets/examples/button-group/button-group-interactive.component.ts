import { Component } from '@angular/core'
import {
    NbButtonToggleAppearance,
    NbComponentShape,
    NbComponentSize,
    NbComponentStatus,
    NbCardComponent,
    NbCardBodyComponent,
    NbRadioGroupComponent,
    NbRadioComponent,
    NbCheckboxComponent,
    NbButtonComponent,
    NbButtonToggleDirective,
    NbButtonGroupComponent
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './button-group-interactive.component.html',
    styleUrls: ['./button-group-interactive.component.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbRadioGroupComponent,
        NbRadioComponent,
        NbCheckboxComponent,
        NbButtonComponent,
        NbButtonToggleDirective,
        NbButtonGroupComponent
    ]
})
export class ButtonGroupInteractiveComponent {
    appearances: NbButtonToggleAppearance[] = ['filled', 'outline', 'ghost']
    shapes: NbComponentShape[] = ['rectangle', 'semi-round', 'round']
    statuses: NbComponentStatus[] = ['basic', 'primary', 'success', 'info', 'warning', 'danger', 'control']
    sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']

    selectedShape: NbComponentShape = 'rectangle'
    selectedSize: NbComponentSize = 'medium'
    multiple = true
    disabledGroup = false
    disabledFirstButton = false
    disabledSecondButton = false
    disabledThirdButton = false
}
