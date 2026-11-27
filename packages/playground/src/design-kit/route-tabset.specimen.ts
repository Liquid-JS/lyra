import { Component } from '@angular/core'
import { NbRouteTabsetComponent, type NbRouteTab } from '@liquid-js/lyr-core'

import { combinations, kit } from './specimen'

/**
 * Route tabs: the page's own active, one with an icon and two plain ones, as wide as their titles or the set; and a
 * phone's bar along the bottom with three to five tabs, icons over titles, one with a badge.
 */
@Component({
    template: `
        <div class="specimens">
            @for (tabset of tabsets; track $index) {
            <nb-route-tabset [attr.data-kit]="kit('route-tabset', tabset)"
                [tabs]="tabset.appearance === 'bar' ? barTabs.slice(0, tabset.tabs) : tabs"
                [activeLinkOptions]="activeLinkOptions"
                [fullWidth]="tabset.fullWidth"
                [appearance]="tabset.appearance"
                outlet="false"
                [style.width]="tabset.appearance === 'bar' ? '24.375rem' : '36rem'" />
            }
        </div>
    `,
    imports: [NbRouteTabsetComponent]
})
export class RouteTabsetSpecimenComponent {
    readonly kit = kit
    readonly tabs: NbRouteTab[] = [
        { title: 'Overview', route: '/design-kit/route-tabset' },
        { title: 'Files', icon: 'folder-outline', route: '/design-kit/route-tabset/files' },
        { title: 'Settings', route: '/design-kit/route-tabset/settings' },
        { title: 'Archive', route: '/design-kit/route-tabset/archive' }
    ]

    // The capture adds query parameters, which don't make another tab active.
    readonly activeLinkOptions = { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } as const

    readonly barTabs: NbRouteTab[] = [
        { title: 'Today', icon: 'home-outline', route: '/design-kit/route-tabset' },
        { title: 'Inbox', icon: 'email-outline', route: '/design-kit/route-tabset/inbox', badgeText: '3', badgeStatus: 'danger' },
        { title: 'Search', icon: 'search-outline', route: '/design-kit/route-tabset/search' },
        { title: 'Saved', icon: 'bookmark-outline', route: '/design-kit/route-tabset/saved' },
        { title: 'Profile', icon: 'person-outline', route: '/design-kit/route-tabset/profile' }
    ]

    readonly tabsets = [
        ...combinations({ appearance: ['tabs'] as const, fullWidth: [false, true], tabs: [4] }),
        ...combinations({ appearance: ['bar'] as const, fullWidth: [false], tabs: [3, 4, 5] })
    ]
}
