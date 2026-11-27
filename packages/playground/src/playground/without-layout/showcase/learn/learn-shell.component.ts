import { Component, computed, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router'
import {
    NbContextMenuDirective,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbMenuItem,
    NbPrefixDirective,
    NbRouteTabsetComponent,
    NbShownAboveDirective,
    NbThemeService,
    NbUserComponent,
    type NbRouteTab
} from '@liquid-js/lyr-core'

import { portrait } from '../shared/showcase-images'

/** A course platform's frame: a header with the catalogue, the learner's courses, search and their menu. */
@Component({
    selector: 'npg-learn-shell',
    templateUrl: './learn-shell.component.html',
    styleUrls: ['./learn-shell.component.scss'],
    imports: [
        NbContextMenuDirective,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutFooterComponent,
        NbLayoutHeaderComponent,
        NbPrefixDirective,
        NbRouteTabsetComponent,
        NbShownAboveDirective,
        NbUserComponent,
        RouterLink,
        RouterOutlet
    ]
})
export class LearnShellComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)
    protected readonly themeService = inject(NbThemeService)

    readonly userPhoto = portrait('Jane Doe')
    readonly year = new Date().getFullYear()

    // The sections, as links that work wherever the app is mounted, fold into a menu on a phone; and the learner's menu.
    readonly sections: NbRouteTab[] = [
        { title: 'Catalogue', route: this.link('catalogue') },
        { title: 'My learning', route: this.link('course') }
    ]
    readonly userMenu: NbMenuItem[] = [{ title: 'Profile' }, { title: 'Certificates' }, { title: 'Sign out' }]

    // A phone's header has the learner's picture alone.
    protected readonly phone = computed(() => (this.themeService.breakpoint()?.width ?? Infinity) < 768)

    // A page of this app, wherever it's mounted: in the playground, or in the docs' examples.
    protected link(page: string): string {
        return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }))
    }
}
