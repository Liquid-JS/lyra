import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NbCardBodyComponent, NbCardComponent, NbComponentSize, NbComponentStatus } from '@liquid-js/lyr-core'
import { NbPhoneInputComponent } from '@liquid-js/lyr-extras/phone-input'

@Component({
    selector: 'nb-phone-input-sizes',
    templateUrl: './phone-input-sizes.component.html',
    styleUrls: ['./phone-input-sizes.component.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbPhoneInputComponent, FormsModule]
})
export class PhoneInputSizesComponent {
    phone = '+12015550123'
    readonly sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']
    readonly statuses: NbComponentStatus[] = ['primary', 'success', 'warning', 'danger']
}
