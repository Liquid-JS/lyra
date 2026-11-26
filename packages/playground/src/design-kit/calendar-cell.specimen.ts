import { afterNextRender, Component, ElementRef, inject } from '@angular/core'
import { NbCalendarComponent, NbCalendarRangeComponent, NbDateService } from '@liquid-js/lyr-core'

import { combinations, FixedTodayDateService, kit } from './specimen'

/** A cell's state by its classes, the most particular first, as the kit reads it where a calendar holds one. */
const STATES: ReadonlyArray<[string, string]> = [
    ['start', 'range start'],
    ['end', 'range end'],
    ['in-range', 'in range'],
    ['selected', 'selected'],
    ['today', 'today'],
    ['disabled', 'disabled'],
    ['bounding-month', 'other month']
]

/**
 * The day cells of the calendars' specimens, one in each state, in each kind and size: the calendars are those of the
 * calendar's page, and their cells are tagged once they're shown.
 */
@Component({
    template: `
        <div class="specimens">
            @for (calendar of calendars; track $index) {
            @if (calendar.kind === 'range') {
            <nb-calendar-range [attr.data-cells]="kit('calendar-cell', calendar)"
                [size]="calendar.size"
                [visibleDate]="visible"
                [range]="range"
                [min]="min" />
            } @else {
            <nb-calendar [attr.data-cells]="kit('calendar-cell', calendar)"
                [size]="calendar.size"
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
export class CalendarCellSpecimenComponent {
    readonly kit = kit
    readonly visible = new Date(2026, 2, 1)
    readonly chosen = new Date(2026, 2, 12)
    readonly min = new Date(2026, 2, 5)
    readonly range = { start: new Date(2026, 2, 9), end: new Date(2026, 2, 13) }
    readonly calendars = combinations({ kind: ['single', 'range'] as const, size: ['medium', 'large'] as const })

    constructor() {
        const host: HTMLElement = inject(ElementRef).nativeElement
        afterNextRender(() => {
            for (const calendar of Array.from(host.querySelectorAll<HTMLElement>('[data-cells]'))) {
                const inputs = JSON.parse(calendar.getAttribute('data-cells') ?? '{}') as Record<string, string>
                const tagged = new Set<string>()
                for (const cell of Array.from(calendar.querySelectorAll('nb-calendar-day-cell, nb-calendar-range-day-cell'))) {
                    const state = STATES.find(([name]) => cell.classList.contains(name))?.[1] ?? 'default'
                    if (!tagged.has(state)) {
                        tagged.add(state)
                        cell.setAttribute('data-kit', JSON.stringify({ ...inputs, state }))
                    }
                }
            }
        })
    }
}
