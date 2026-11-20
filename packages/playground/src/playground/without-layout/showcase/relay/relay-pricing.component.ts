import { Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbAccordionComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbDataTableModule,
    NbIconComponent,
    nbTableDataSource,
    NbTagComponent,
    NbToggleComponent
} from '@liquid-js/lyr-core'

import { COMPARISON, FAQ, TIERS } from './relay-data'

/** Relay's plans: three tiers, monthly or yearly, what each includes, and the questions people ask. */
@Component({
    selector: 'npg-relay-pricing',
    templateUrl: './relay-pricing.component.html',
    styleUrls: ['./relay-pricing.component.scss'],
    imports: [
        NbAccordionComponent,
        NbAccordionItemBodyComponent,
        NbAccordionItemComponent,
        NbAccordionItemHeaderComponent,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbDataTableModule,
        NbIconComponent,
        NbTagComponent,
        NbToggleComponent,
        RouterLink
    ]
})
export class RelayPricingComponent {
    readonly tiers = TIERS
    readonly faq = FAQ
    /** Billed yearly, at the lower monthly price. */
    readonly yearly = signal(false)
    readonly columns = ['feature', 'free', 'pro', 'scale']
    readonly comparison = nbTableDataSource({ data: COMPARISON, pageSize: COMPARISON.length })

    /** A comparison cell's text, or whether it's included. */
    text(value: string | boolean): string | undefined {
        return typeof value === 'string' ? value : undefined
    }
}
