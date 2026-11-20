import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbRevealCardComponent,
    NbCardFrontComponent,
    NbCardBackComponent,
    NbFlipCardComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-card-test',
    templateUrl: './card-test.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardFooterComponent,
        NbRevealCardComponent,
        NbCardFrontComponent,
        NbCardBackComponent,
        NbFlipCardComponent
    ]
})
export class CardTestComponent {
    sizes = ['tiny', 'small', 'medium', 'large', 'giant']
    statuses = ['primary', 'success', 'info', 'warning', 'danger']
    accents = ['primary', 'success', 'info', 'warning', 'danger']

    cards: any[]
    enhancedCards: any

    constructor() {
        this.cards = this.prepareCards()
        this.enhancedCards = this.prepareEnhancedCards()
    }

    private prepareCards(): any[] {
        return this.statuses.flatMap((status) => this.sizes.map((size) => ({ size, status })))
    }

    private prepareEnhancedCards() {
        const { sizes, statuses, accents } = this
        const accentCards = statuses.flatMap((status) => accents.map((accent) => ({ size: 'small', status, accent })))
        const revealCards = sizes.map((size) => ({ size, accent: '', status: '' }))
        const flipCards = [...revealCards]

        return {
            accentCards,
            revealCards,
            flipCards
        }
    }
}
