import { Component, inject, output } from '@angular/core'

import { NbLayoutDirectionService } from '@liquid-js/lyr-core/base'
import { NbButtonComponent } from '@liquid-js/lyr-core/button'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { injectNbCalendarTexts } from '../../calendar-texts'

/**
 * A calendar's previous and next buttons, which follow the page's direction.
 */
@Component({
    selector: 'nb-calendar-pageable-navigation',
    styleUrls: ['./calendar-pageable-navigation.component.scss'],
    templateUrl: './calendar-pageable-navigation.component.html',
    imports: [NbButtonComponent, NbIconComponent]
})
export class NbCalendarPageableNavigationComponent {
    protected readonly texts = injectNbCalendarTexts()

    private readonly directionService = inject(NbLayoutDirectionService)

    readonly next = output<void>()
    readonly prev = output<void>()

    get isLtr(): boolean {
        return this.directionService.isLtr()
    }
}
