import { ApplicationRef, Component, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router'
import {
    NB_DOCUMENT,
    NbButtonComponent,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbRouteTabsetComponent,
    type NbRouteTab
} from '@liquid-js/lyr-core'

import { STUDIO } from './book-data'

// A section's tab is the page's while the page shows that section.
const sectionActive = { paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' } as const

/** The studio's frame: a top bar with its sections, the customer's bookings and the way to book. */
@Component({
    selector: 'npg-book-shell',
    templateUrl: './book-shell.component.html',
    styleUrls: ['./book-shell.component.scss'],
    imports: [
        NbButtonComponent,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbRouteTabsetComponent,
        RouterLink,
        RouterOutlet
    ]
})
export class BookShellComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)
    protected readonly appRef = inject(ApplicationRef)
    protected readonly document = inject(NB_DOCUMENT)

    readonly studio = STUDIO

    // The home page's sections and the bookings, which fold into a menu on a phone.
    readonly sections: NbRouteTab[] = [
        { title: 'Services', route: this.link('home'), fragment: 'services', activeLinkOptions: sectionActive },
        { title: 'Team', route: this.link('home'), fragment: 'team', activeLinkOptions: sectionActive },
        { title: 'Visit us', route: this.link('home'), fragment: 'visit', activeLinkOptions: sectionActive },
        { title: 'My bookings', route: this.link('bookings') }
    ]

    /** Scrolls to a section of the home page once the link's navigation to it settles. */
    async scrollTo(section?: string) {
        if (!section) {
            return
        }
        await this.appRef.whenStable()
        this.document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // A page of this app, wherever it's mounted: in the playground, or in the docs' examples.
    protected link(page: string): string {
        return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }))
    }
}
