import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NbCardBodyComponent, NbCardComponent } from '@liquid-js/lyr-core'
import { NbPhoneInputComponent } from '@liquid-js/lyr-extras/phone-input'
import type { CountryCode } from 'libphonenumber-js'

@Component({
    selector: 'nb-phone-input-showcase',
    templateUrl: './phone-input-showcase.component.html',
    styleUrls: ['./phone-input-showcase.component.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbPhoneInputComponent, FormsModule]
})
export class PhoneInputShowcaseComponent {
    readonly phone = signal<string | null>('+12015550123')
    readonly country = signal<CountryCode | undefined>(undefined)
}
