import { Component } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent, NbCardFooterComponent, NbCardHeaderComponent } from '@liquid-js/lyr-core'

import { combinations, kit, STATUSES } from './specimen'

@Component({
    template: `
        <div class="specimens">
            @for (card of cards; track $index) {
            <nb-card [attr.data-kit]="kit('card', card)"
                [appearance]="card.appearance"
                [status]="card.status"
                [accent]="card.accent"
                style="width: 20rem">
                <nb-card-header>Header</nb-card-header>
                <nb-card-body>Body</nb-card-body>
                <nb-card-footer>Footer</nb-card-footer>
            </nb-card>
            }
        </div>
    `,
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCardFooterComponent]
})
export class CardSpecimenComponent {
    readonly kit = kit
    readonly cards = [
        ...combinations({ appearance: ['outline', 'floating', 'filled'] as const, status: ['', ...STATUSES] as const, accent: [''] as const }),
        ...combinations({ appearance: ['outline'] as const, status: [''] as const, accent: STATUSES.filter((status) => status !== 'control') })
    ]
}
