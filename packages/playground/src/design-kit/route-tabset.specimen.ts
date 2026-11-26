import { Component } from '@angular/core'
import { NbRouteTabsetComponent, type NbRouteTab } from '@liquid-js/lyr-core'

import { combinations, kit } from './specimen'

/** Route tabs: the page's own active, one with an icon and a disabled one, as wide as their titles or the set. */
@Component({
    template: `
        <div class="specimens">
            @for (tabset of tabsets; track $index) {
            <nb-route-tabset [attr.data-kit]="kit('route-tabset', tabset)"
                [tabs]="tabs"
                [activeLinkOptions]="activeLinkOptions"
                [fullWidth]="tabset.fullWidth"
                style="width: 36rem" />
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
        { title: 'Archive', route: '/design-kit/route-tabset/archive', disabled: true }
    ]

    // The capture adds query parameters, which don't make another tab active.
    readonly activeLinkOptions = { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } as const

    readonly tabsets = combinations({ fullWidth: [false, true] })
}
