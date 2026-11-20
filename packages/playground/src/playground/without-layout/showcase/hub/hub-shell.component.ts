import { Component, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router'
import {
    NbActionComponent,
    NbActionsComponent,
    NbButtonComponent,
    NbContextMenuDirective,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbMenuComponent,
    NbMenuItem,
    NbPrefixDirective,
    NbSidebarComponent,
    NbSidebarService,
    NbSuffixDirective,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { ShowcaseGrainComponent } from '../shared/showcase-grain.component'
import { photoOf } from './hub-data'

/**
 * The intranet's frame: an ink header with the search, the notifications and the user's menu, and a light sidebar with
 * the sections, around the page.
 */
@Component({
    selector: 'npg-hub-shell',
    templateUrl: './hub-shell.component.html',
    styleUrls: ['./hub-shell.component.scss'],
    imports: [
        NbActionComponent,
        NbActionsComponent,
        NbButtonComponent,
        NbContextMenuDirective,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbMenuComponent,
        NbPrefixDirective,
        NbSidebarComponent,
        NbSuffixDirective,
        NbUserComponent,
        RouterLink,
        RouterOutlet,
        ShowcaseGrainComponent
    ]
})
export class HubShellComponent {
    readonly userPhoto = photoOf('Jane Doe')
    protected readonly sidebar = inject(NbSidebarService)
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    readonly menu: NbMenuItem[] = [
        { title: 'Home', icon: 'home-outline', link: this.link('home') },
        { title: 'People', icon: 'people-outline', link: this.link('people') },
        { title: 'Documents', icon: 'folder-outline', link: this.link('documents') },
        { title: 'Work', group: true },
        { title: 'Requests', icon: 'checkmark-square-2-outline', link: this.link('requests'), badge: { text: '1', status: 'warning' } },
        { title: 'Tickets', icon: 'alert-circle-outline', link: this.link('tickets') },
        { title: 'Chat', icon: 'message-circle-outline', link: this.link('chat'), badge: { text: '8', status: 'primary' } },
        { title: 'Teams', group: true },
        {
            title: 'Design',
            icon: 'color-palette-outline',
            children: [
                { title: 'Overview', link: this.link('people') },
                { title: 'Files', link: this.link('documents') }
            ]
        },
        { title: 'London office', icon: 'pin-outline', link: this.link('home') },
        { title: 'Account', group: true },
        { title: 'Settings', icon: 'settings-2-outline', link: this.link('settings') }
    ]

    readonly userMenu: NbMenuItem[] = [
        { title: 'Profile', link: this.link('settings') },
        { title: 'My requests', link: this.link('requests') },
        { title: 'Sign out' }
    ]

    toggleSidebar() {
        this.sidebar.toggle(true, 'hub')
    }

    // A page of this app, wherever it's mounted: in the playground, or in the docs' examples.
    protected link(page: string): string {
        return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }))
    }
}
