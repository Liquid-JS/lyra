import { Component } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent } from '@liquid-js/lyr-core'
import { NbQrCodeComponent } from '@liquid-js/lyr-extras/qr-code'

@Component({
    selector: 'nb-qr-code-showcase',
    templateUrl: './qr-code-showcase.component.html',
    styleUrls: ['./qr-code-showcase.component.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbQrCodeComponent]
})
export class QrCodeShowcaseComponent {}
