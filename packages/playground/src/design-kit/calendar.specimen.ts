import { Component } from '@angular/core'
import { NbCalendarComponent, NbCalendarRangeComponent, NbDateService } from '@liquid-js/lyr-core'

import { combinations, FixedTodayDateService, kit } from './specimen'

/** Calendars in March 2026 (today the 18th, the 12th chosen, before the 5th disabled), in each view and size. */
@Component({
    template: `
        <div class="specimens">
            @for (calendar of calendars; track $index) {
            @if (calendar.kind === 'range') {
            <nb-calendar-range [attr.data-kit]="kit('calendar', calendar)"
                [size]="calendar.size"
                [startView]="calendar.view"
                [visibleDate]="visible"
                [range]="range"
                [min]="min" />
            } @else {
            <nb-calendar [attr.data-kit]="kit('calendar', calendar)"
                [size]="calendar.size"
                [startView]="calendar.view"
                [visibleDate]="visible"
                [date]="chosen"
                [min]="min" />
            }
            }
        </div>
    `,
    providers: [{ provide: NbDateService, useClass: FixedTodayDateService }],
    imports: [NbCalendarComponent, NbCalendarRangeComponent]
})
export class CalendarSpecimenComponent {
    readonly kit = kit
    readonly visible = new Date(2026, 2, 1)
    readonly chosen = new Date(2026, 2, 12)
    readonly min = new Date(2026, 2, 5)
    readonly range = { start: new Date(2026, 2, 9), end: new Date(2026, 2, 13) }
    readonly calendars = [
        ...combinations({ kind: ['single'] as const, size: ['medium', 'large'] as const, view: ['date', 'month', 'year'] as const }),
        ...combinations({ kind: ['range'] as const, size: ['medium', 'large'] as const, view: ['date'] as const })
    ]
}
