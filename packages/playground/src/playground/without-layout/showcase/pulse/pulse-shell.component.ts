import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import {
    NbButtonComponent,
    NbIconComponent,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutHeaderComponent
} from '@liquid-js/lyr-core'
import { filter, map, startWith } from 'rxjs/operators'

/**
 * Pulse's frame: a header with the screen's title, and a bar of tabs along the bottom, under the thumb, which the
 * screen shows through.
 */
@Component({
    selector: 'npg-pulse-shell',
    templateUrl: './pulse-shell.component.html',
    styleUrls: ['./pulse-shell.component.scss'],
    imports: [
        NbButtonComponent,
        NbIconComponent,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ]
})
export class PulseShellComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    readonly tabs = [
        { path: 'today', title: 'Today', icon: 'home-outline' },
        { path: 'workout', title: 'Workout', icon: 'flash-outline' },
        { path: 'trends', title: 'Trends', icon: 'trending-up-outline' },
        { path: 'settings', title: 'Settings', icon: 'settings-2-outline' }
    ]

    /** The screen's title and whether it has a way back, from its route's data. */
    readonly screen = toSignal(
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            startWith(null),
            map(() => {
                let child = this.route.firstChild
                while (child?.firstChild) {
                    child = child.firstChild
                }
                return { title: (child?.snapshot.data['title'] as string | undefined) ?? '', back: !!child?.snapshot.data['back'] }
            })
        ),
        { requireSync: true }
    )
}
