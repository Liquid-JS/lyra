import { Component } from '@angular/core'
import { NbButtonComponent, NbCardModule } from '@liquid-js/lyr-core'
import { NbQrCodeComponent, NbQrCodeOptions } from '@liquid-js/lyr-extras/qr-code'

@Component({
    selector: 'nb-qr-code-download',
    templateUrl: './qr-code-download.component.html',
    styleUrls: ['./qr-code-download.component.scss'],
    imports: [NbButtonComponent, NbCardModule, NbQrCodeComponent]
})
export class QrCodeDownloadComponent {
    readonly options: NbQrCodeOptions = {
        dotsOptions: { type: 'rounded' },
        cornersSquareOptions: { type: 'extra-rounded' },
        cornersDotOptions: { type: 'dot' }
    }
}
