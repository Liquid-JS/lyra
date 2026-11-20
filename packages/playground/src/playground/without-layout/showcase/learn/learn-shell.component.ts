import { Component, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import {
    NbButtonComponent,
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
    NbUserComponent
} from '@liquid-js/lyr-core'

import { portrait } from '../shared/showcase-images'

/** A course platform's frame: a header with the catalogue, the learner's courses, search and their menu. */
@Component({
    selector: 'npg-learn-shell',
    templateUrl: './learn-shell.component.html',
    styleUrls: ['./learn-shell.component.scss'],
    imports: [
        NbButtonComponent,
        NbContextMenuDirective,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutFooterComponent,
        NbLayoutHeaderComponent,
        NbPrefixDirective,
        NbUserComponent,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ]
})
export class LearnShellComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    readonly userPhoto = portrait('Jane Doe')
    readonly year = new Date().getFullYear()

    // The phone's menu, and the learner's, as links that work wherever the app is mounted.
    readonly sections: NbMenuItem[] = [
        { title: 'Catalogue', link: this.link('catalogue') },
        { title: 'My learning', link: this.link('course') },
        { title: 'Certificates' },
        { title: 'Sign out' }
    ]
    readonly userMenu: NbMenuItem[] = [{ title: 'Profile' }, { title: 'Certificates' }, { title: 'Sign out' }]

    // A page of this app, wherever it's mounted: in the playground, or in the docs' examples.
    protected link(page: string): string {
        return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }))
    }
}
