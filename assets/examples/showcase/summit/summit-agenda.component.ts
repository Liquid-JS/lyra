import { Component, computed, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbIconComponent,
    NbTabComponent,
    NbTagComponent,
    NbTabsetComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { portrait } from '../shared/showcase-images'
import { speakerById, SUMMIT_DAYS, SUMMIT_TRACKS, SummitSession, SummitTrack } from './summit-data'

type SummitTrackFilter = Exclude<SummitTrack, 'break'>

/**
 * The agenda: a day per tab, its sessions down a timeline with the breaks as quiet rows, a filter by track, and a
 * button on each talk to add it to your own agenda, counted in a bar that stays in view.
 */
@Component({
    selector: 'npg-summit-agenda',
    templateUrl: './summit-agenda.component.html',
    styleUrls: ['./summit-agenda.component.scss'],
    imports: [
        NbButtonComponent,
        NbButtonGroupComponent,
        NbButtonToggleDirective,
        NbIconComponent,
        NbTabComponent,
        NbTabsetComponent,
        NbTagComponent,
        NbUserComponent,
        RouterLink
    ]
})
export class SummitAgendaComponent {
    readonly days = SUMMIT_DAYS
    readonly tracks = SUMMIT_TRACKS
    readonly trackNames = Object.keys(SUMMIT_TRACKS) as SummitTrackFilter[]
    readonly portrait = portrait
    readonly speakerById = speakerById

    /** The tracks shown; none selected shows them all. */
    readonly filter = signal(new Array<SummitTrackFilter>())
    /** The sessions added to your agenda, by id. */
    readonly mine = signal(new Set<string>())
    readonly mineCount = computed(() => this.mine().size)

    /** Each day's sessions that pass the filter; breaks stay. */
    readonly shown = computed(() => {
        const filter = this.filter()
        return this.days.map((day) => ({
            ...day,
            sessions: day.sessions.filter(
                (session) => session.track === 'break' || !filter.length || filter.includes(session.track as SummitTrackFilter)
            )
        }))
    })

    toggle(session: SummitSession) {
        this.mine.update((mine) => {
            const next = new Set(mine)
            if (next.has(session.id)) {
                next.delete(session.id)
            } else {
                next.add(session.id)
            }
            return next
        })
    }

    isMine(session: SummitSession) {
        return this.mine().has(session.id)
    }

    clear() {
        this.mine.set(new Set())
    }
}
