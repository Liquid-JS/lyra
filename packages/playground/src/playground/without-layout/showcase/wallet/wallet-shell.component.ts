import { Component, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import {
    NbActionComponent,
    NbActionsComponent,
    NbContextMenuDirective,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbMenuItem,
    NbRouteTabsetComponent,
    NbShownAboveDirective,
    NbShownBelowDirective,
    NbUserComponent,
    type NbRouteTab
} from '@liquid-js/lyr-core'

import { portrait } from '../shared/showcase-images'

/**
 * Wallet's frame: a slim header with the sections and the account's owner, and on a phone, the sections as tabs along
 * the bottom, where a thumb reaches them.
 */
@Component({
    selector: 'npg-wallet-shell',
    templateUrl: './wallet-shell.component.html',
    styleUrls: ['./wallet-shell.component.scss'],
    imports: [
        NbActionComponent,
        NbActionsComponent,
        NbContextMenuDirective,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbLayoutFooterComponent,
        NbRouteTabsetComponent,
        NbShownAboveDirective,
        NbShownBelowDirective,
        NbUserComponent,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ]
})
export class WalletShellComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    readonly userPhoto = portrait('Jane Doe')

    readonly sections = [
        { path: 'overview', title: 'Overview', icon: 'grid-outline' },
        { path: 'transactions', title: 'Transactions', icon: 'list-outline' },
        { path: 'budgets', title: 'Budgets', icon: 'pie-chart-outline' },
        { path: 'transfer', title: 'Transfer', icon: 'paper-plane-outline' }
    ]

    // On a phone, the sections' tabs along the bottom.
    readonly tabs: NbRouteTab[] = this.sections.map((section) => ({ route: this.link(section.path), title: section.title, icon: section.icon }))

    readonly userMenu: NbMenuItem[] = [{ title: 'Profile' }, { title: 'Security' }, { title: 'Sign out' }]

    // A page of this app, wherever it's mounted: in the playground, or in the docs' examples.
    link(page: string): string {
        return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }))
    }
}
