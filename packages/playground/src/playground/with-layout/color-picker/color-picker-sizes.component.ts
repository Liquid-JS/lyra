import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NbCardBodyComponent, NbCardComponent, NbComponentSize, NbComponentStatus } from '@liquid-js/lyr-core'
import { NbColorPickerComponent } from '@liquid-js/lyr-extras/color-picker'

@Component({
    selector: 'nb-color-picker-sizes',
    templateUrl: './color-picker-sizes.component.html',
    styleUrls: ['./color-picker-sizes.component.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbColorPickerComponent, FormsModule]
})
export class ColorPickerSizesComponent {
    color = '#00d68f'
    readonly sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']
    readonly statuses: NbComponentStatus[] = ['primary', 'success', 'warning', 'danger']
}
