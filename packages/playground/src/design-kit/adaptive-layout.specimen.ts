import { Component, inject, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import {
    NbActionComponent,
    NbActionsComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbLayoutModule,
    NbMenuComponent,
    NbRouteTabsetComponent,
    NbSidebarModule,
    NbSidebarService,
    NbThemeService,
    NbUserComponent,
    type NbMenuItem,
    type NbRouteTab
} from '@liquid-js/lyr-core'

import { loadPlaygroundTheme } from '../playground/playground-theme'
import { kit } from './specimen'

/**
 * An app's screen that adapts to the device, in one markup: from `md` up, a header with the brand, the sections as
 * tabs, the actions and the user; below it, a phone's top bar, whose menu button opens a drawer with the user and the
 * account's links and whose actions fold into a menu, and the sections along the bottom. The `device` query parameter
 * names the size the capture opens it at, and `drawer=open` opens the phone's drawer.
 */
@Component({
    template: `
        @if (themeLoaded()) {
        <nb-layout [attr.data-kit]="kit('adaptive-layout', { device, drawer })">
            <nb-layout-header fixed>
                <button *nbShownBelow="'md'"
                    nbButton
                    ghost
                    type="button"
                    class="kit-menu"
                    aria-label="Open the menu"
                    (click)="sidebar.toggle(false, 'drawer')">
                    <nb-icon icon="menu-outline" />
                </button>
                <span class="kit-brand">Acme</span>
                <nb-route-tabset *nbShownAbove="'md'"
                    class="kit-tabs"
                    [tabs]="headerSections"
                    [activeLinkOptions]="activeLinkOptions"
                    outlet="false" />
                <nb-actions size="small"
                    collapse="menu"
                    below="md"
                    class="kit-actions">
                    <nb-action icon="search-outline"
                        title="Search" />
                    <nb-action icon="bell-outline"
                        title="Notifications"
                        badgeDot
                        badgeStatus="danger" />
                    <nb-action *nbShownAbove="'md'">
                        <nb-user name="Jane Doe"
                            title="Designer"
                            size="small" />
                    </nb-action>
                </nb-actions>
            </nb-layout-header>
            <!-- The phone's drawer; the kit draws it open alone, as closed it doesn't show. -->
            @if (drawer === 'open') {
            <nb-sidebar *nbShownBelow="'md'"
                fixed
                drawer
                tag="drawer"
                state="expanded">
                <nb-sidebar-header>
                    <nb-user name="Jane Doe"
                        title="Designer"
                        size="large" />
                </nb-sidebar-header>
                <nb-menu [items]="account" />
            </nb-sidebar>
            }
            <nb-layout-column>
                <nb-card>
                    <nb-card-header>Today</nb-card-header>
                    <nb-card-body>
                        <p>Three tasks are due today, and the weekly review is at 4 PM.</p>
                        <button nbButton
                            status="primary"
                            type="button">See tasks</button>
                    </nb-card-body>
                </nb-card>
            </nb-layout-column>
            <nb-layout-footer *nbShownBelow="'md'"
                fixed>
                <nb-route-tabset [tabs]="sections"
                    [activeLinkOptions]="activeLinkOptions"
                    outlet="false"
                    appearance="bar" />
            </nb-layout-footer>
        </nb-layout>
        }
    `,
    styles: `
        .kit-brand {
            font-weight: 700;
            margin-inline-end: 2rem;
        }

        // In the header, the tabs' line is the header's edge, and they take the room between the brand and the actions.
        .kit-tabs {
            --route-tabset-divider-width: 0;

            flex: 1;
            margin-inline-end: 2rem;
        }

        .kit-actions {
            margin-inline-start: auto;
        }
    `,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NbLayoutModule,
        NbSidebarModule,
        NbMenuComponent,
        NbActionsComponent,
        NbActionComponent,
        NbButtonComponent,
        NbIconComponent,
        NbUserComponent,
        NbRouteTabsetComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent
    ]
})
export class AdaptiveLayoutSpecimenComponent {
    readonly kit = kit
    readonly sidebar = inject(NbSidebarService)
    readonly themeLoaded = loadPlaygroundTheme()
    readonly device = inject(ActivatedRoute).snapshot.queryParamMap.get('device') ?? 'laptop'
    readonly drawer = inject(ActivatedRoute).snapshot.queryParamMap.get('drawer') ?? 'closed'

    readonly sections: NbRouteTab[] = [
        { title: 'Today', icon: 'home-outline', route: '/design-kit/adaptive-layout' },
        { title: 'Inbox', icon: 'email-outline', route: '/design-kit/adaptive-layout/inbox', badgeText: '3', badgeStatus: 'danger' },
        { title: 'Projects', icon: 'folder-outline', route: '/design-kit/adaptive-layout/projects' },
        { title: 'Reports', icon: 'bar-chart-outline', route: '/design-kit/adaptive-layout/reports' }
    ]

    // The header's are titles alone, so they fit beside the actions on a tablet; the phone's bar has the icons.
    readonly headerSections = this.sections.map(({ icon: _icon, ...tab }) => tab)

    readonly account: NbMenuItem[] = [
        { title: 'Profile', icon: 'person-outline', link: '/design-kit/adaptive-layout/profile' },
        { title: 'Settings', icon: 'settings-2-outline', link: '/design-kit/adaptive-layout/settings' },
        { title: 'Help', icon: 'question-mark-circle-outline', link: '/design-kit/adaptive-layout/help' },
        { title: 'Sign out', icon: 'log-out-outline', link: '/design-kit/adaptive-layout/sign-out' }
    ]

    // The capture adds query parameters, which don't make another tab active.
    readonly activeLinkOptions = { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } as const

    constructor() {
        inject(NbThemeService).changeTheme(inject(ActivatedRoute).snapshot.queryParamMap.get('theme') ?? 'default')
    }
}
