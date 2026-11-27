import { Component, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router'
import {
    NbButtonComponent,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbRouteTabsetComponent,
    type NbRouteTab
} from '@liquid-js/lyr-core'

import { SUMMIT } from './summit-data'

/** The conference site's frame: a bar with its pages and the tickets button, and a footer with the essentials. */
@Component({
    selector: 'npg-summit-shell',
    templateUrl: './summit-shell.component.html',
    styleUrls: ['./summit-shell.component.scss'],
    imports: [
        NbButtonComponent,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutFooterComponent,
        NbLayoutHeaderComponent,
        NbRouteTabsetComponent,
        RouterLink,
        RouterOutlet
    ]
})
export class SummitShellComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    readonly summit = SUMMIT
    /** The pages, as links that work wherever the site is mounted; they fold into a menu on a phone. */
    readonly pages: NbRouteTab[] = [
        { route: this.link('agenda'), title: 'Agenda' },
        { route: this.link('speakers'), title: 'Speakers' },
        { route: this.link('tickets'), title: 'Tickets' }
    ]

    readonly footer = [
        { title: 'Conference', links: ['Agenda', 'Speakers', 'Tickets', 'Venue'] },
        { title: 'Take part', links: ['Call for talks', 'Sponsor', 'Volunteer', 'Press'] },
        { title: 'About', links: ['Code of conduct', 'Past editions', 'Contact', 'Privacy'] }
    ]

    // A page of this site, wherever it's mounted: in the playground, or in the docs' examples.
    protected link(page: string): string {
        return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }))
    }
}
