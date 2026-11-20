import { ApplicationRef, Component, DestroyRef, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import {
    NB_DOCUMENT,
    NbButtonComponent,
    NbContextMenuDirective,
    NbIconComponent,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbMenuItem,
    NbMenuService
} from '@liquid-js/lyr-core'
import { filter } from 'rxjs'

import { STUDIO } from './book-data'

/** The studio's frame: a top bar with its sections, the customer's bookings and the way to book. */
@Component({
    selector: 'npg-book-shell',
    templateUrl: './book-shell.component.html',
    styleUrls: ['./book-shell.component.scss'],
    imports: [
        NbButtonComponent,
        NbContextMenuDirective,
        NbIconComponent,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ]
})
export class BookShellComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)
    protected readonly appRef = inject(ApplicationRef)
    protected readonly document = inject(NB_DOCUMENT)

    readonly studio = STUDIO

    // The phone menu: the home page's sections and the bookings.
    readonly sections: NbMenuItem[] = [
        { title: 'Services', data: { section: 'services' } },
        { title: 'Team', data: { section: 'team' } },
        { title: 'Visit us', data: { section: 'visit' } },
        { title: 'My bookings', data: { path: 'bookings' } }
    ]

    constructor() {
        inject(NbMenuService)
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === 'book-sections'),
                takeUntilDestroyed(inject(DestroyRef))
            )
            .subscribe(({ item }) => {
                const { section, path } = item.data as { section?: string, path?: string }
                if (section) {
                    void this.router.navigate(['home'], { relativeTo: this.route, fragment: section })
                    void this.scrollTo(section)
                } else if (path) {
                    void this.router.navigate([path], { relativeTo: this.route })
                }
            })
    }

    /** Scrolls to a section of the home page once the link's navigation to it settles. */
    async scrollTo(section: string) {
        await this.appRef.whenStable()
        this.document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}
