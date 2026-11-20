import { Component, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import {
    NbButtonComponent,
    NbContextMenuDirective,
    NbIconComponent,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbMenuItem
} from '@liquid-js/lyr-core'

import { SUMMIT } from './summit-data'

/** The conference site's frame: a bar with its pages and the tickets button, and a footer with the essentials. */
@Component({
    selector: 'npg-summit-shell',
    templateUrl: './summit-shell.component.html',
    styleUrls: ['./summit-shell.component.scss'],
    imports: [
        NbButtonComponent,
        NbContextMenuDirective,
        NbIconComponent,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutFooterComponent,
        NbLayoutHeaderComponent,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ]
})
export class SummitShellComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    readonly summit = SUMMIT
    readonly pages = [
        { path: 'agenda', title: 'Agenda' },
        { path: 'speakers', title: 'Speakers' },
        { path: 'tickets', title: 'Tickets' }
    ]
    /** The phone menu: the pages, as links that work wherever the site is mounted. */
    readonly menu: NbMenuItem[] = this.pages.map(({ path, title }) => ({ title, link: this.link(path) }))

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
