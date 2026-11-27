import { ApplicationRef, Component, computed, inject, signal } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router'
import {
    NbButtonComponent,
    NbInputDirective,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbRouteTabsetComponent,
    NbShownAboveDirective,
    NbThemeService,
    NB_DOCUMENT,
    type NbRouteTab
} from '@liquid-js/lyr-core'

// A section's tab is the page's while the page shows that section.
const sectionActive = { paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' } as const

/** A product site's frame: a header with its sections and sign-in, and a footer with links and a newsletter. */
@Component({
    selector: 'npg-site-shell',
    templateUrl: './site-shell.component.html',
    styleUrls: ['./site-shell.component.scss'],
    imports: [
        NbButtonComponent,
        NbInputDirective,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutFooterComponent,
        NbLayoutHeaderComponent,
        NbRouteTabsetComponent,
        NbShownAboveDirective,
        RouterLink,
        RouterOutlet
    ]
})
export class SiteShellComponent {
    /** The address the newsletter goes to, once subscribed. */
    readonly subscribed = signal<string | undefined>(undefined)
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)
    protected readonly appRef = inject(ApplicationRef)
    protected readonly document = inject(NB_DOCUMENT)
    protected readonly themeService = inject(NbThemeService)

    readonly year = new Date().getFullYear()
    // The home page's sections and the blog; on a phone, they fold into a menu, which has sign-in too.
    protected readonly pages: NbRouteTab[] = [
        { title: 'Features', route: this.link('home'), fragment: 'features', activeLinkOptions: sectionActive },
        { title: 'Pricing', route: this.link('home'), fragment: 'pricing', activeLinkOptions: sectionActive },
        { title: 'Blog', route: this.link('blog') }
    ]
    protected readonly signIn: NbRouteTab = { title: 'Sign in', route: this.link('../auth/sign-in') }
    protected readonly phone = computed(() => (this.themeService.breakpoint()?.width ?? Infinity) < 768)
    readonly sections = computed(() => (this.phone() ? [...this.pages, this.signIn] : this.pages))

    /**
     * Scrolls to a section of the home page once the link's navigation to it settles, also when it's the page shown, so a
     * second click on the same link scrolls there again.
     */
    async scrollTo(section?: string) {
        if (!section) {
            return
        }
        await this.appRef.whenStable()
        this.document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // A page of this site, wherever it's mounted: in the playground, or in the docs' examples.
    protected link(page: string): string {
        return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }))
    }

    readonly footer = [
        { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
        { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
        { title: 'Resources', links: ['Blog', 'Guides', 'Help centre', 'Status'] }
    ]
}
