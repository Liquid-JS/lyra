import { afterNextRender, Component, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbDialogService,
    NbIconComponent,
    NbListComponent,
    NbListItemComponent,
    NbProgressBarComponent,
    NbTagComponent
} from '@liquid-js/lyr-core'

import { ShowcaseGlowComponent } from '../shared/showcase-glow.component'
import { PULSE_PLAN, PULSE_RINGS, PULSE_WEEK, PulsePlanItem } from './pulse-data'
import { PulseSheetComponent } from './parts/pulse-sheet.component'

/** Pulse's home: the day's three rings, the week so far, what's planned, and a word about the streak. */
@Component({
    selector: 'npg-pulse-today',
    templateUrl: './pulse-today.component.html',
    styleUrls: ['./pulse-screen.scss', './pulse-today.component.scss'],
    imports: [
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbIconComponent,
        NbListComponent,
        NbListItemComponent,
        NbProgressBarComponent,
        NbTagComponent,
        RouterLink,
        ShowcaseGlowComponent
    ]
})
export class PulseTodayComponent {
    private readonly dialogs = inject(NbDialogService)

    readonly rings = PULSE_RINGS
    readonly week = PULSE_WEEK
    readonly plan = PULSE_PLAN
    readonly done = this.plan.filter((item) => item.done).length

    // The rings fill in from empty as the screen opens: they show nothing until it has rendered once.
    private readonly shown = signal(false)

    constructor() {
        afterNextRender(() => this.shown.set(true))
    }

    /** How much of a ring's goal is done, in percent, up to full; nothing yet while the screen opens. */
    percent(value: number, goal: number): number {
        return this.shown() ? Math.min(100, Math.round((value / goal) * 100)) : 0
    }

    /** Opens an item's details in a sheet from the bottom of the screen. */
    open(item: PulsePlanItem) {
        this.dialogs.open(PulseSheetComponent, { context: { item }, dialogClass: 'pulse-sheet' })
    }
}
