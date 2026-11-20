import { CurrencyPipe, DatePipe } from '@angular/common'
import { Component } from '@angular/core'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    NbTagComponent
} from '@liquid-js/lyr-core'

import { ShowcaseLogoComponent } from '../shared/showcase-logo.component'

/** A SaaS app's invoice, laid out as a document, with its lines and totals. */
@Component({
    selector: 'npg-saas-invoice',
    templateUrl: './saas-invoice.component.html',
    styleUrls: ['./saas-invoice.component.scss'],
    imports: [
        CurrencyPipe,
        DatePipe,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbIconComponent,
        NbTagComponent,
        ShowcaseLogoComponent
    ]
})
export class SaasInvoiceComponent {
    readonly date = new Date(2026, 5, 2, 15, 45)
    readonly lines = [
        { description: 'Team plan, yearly', quantity: 1, price: 1200 },
        { description: 'Extra seats', quantity: 5, price: 60 },
        { description: 'Onboarding package', quantity: 1, price: 200 }
    ]
    readonly subtotal = this.lines.reduce((sum, line) => sum + line.quantity * line.price, 0)
    readonly tax = this.subtotal * 0.2
}
