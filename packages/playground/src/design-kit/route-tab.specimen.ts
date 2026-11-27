import { afterNextRender, Component, ElementRef, inject } from '@angular/core'
import { NbRouteTabsetComponent, type NbRouteTab } from '@liquid-js/lyr-core'

import { combinations, kit } from './specimen'

const ROUTE = '/design-kit/route-tab'
const STATES = ['default', 'hover', 'active', 'disabled'] as const
// A bar's tabs have an icon over their title.
const TABS = [
    ...combinations({ appearance: ['tabs'] as const, content: ['text', 'icon', 'badge'] as const, state: STATES }),
    ...combinations({ appearance: ['bar'] as const, content: ['icon', 'badge'] as const, state: STATES })
]

/**
 * Route tabs in each look, in a header's tabs and a phone's bar: the second tab of each set, with its title alone, an
 * icon or a badge, at rest, hovered, active (the page's route) or disabled, tagged once it's shown.
 */
@Component({
    template: `
        <div class="specimens">
            @for (tabset of tabsets; track $index) {
            <nb-route-tabset [attr.data-tab]="json(tabset.inputs)"
                [tabs]="tabset.tabs"
                [activeLinkOptions]="activeLinkOptions"
                [appearance]="tabset.inputs.appearance"
                outlet="false"
                [style.width]="tabset.inputs.appearance === 'bar' ? '24.375rem' : '24rem'" />
            }
        </div>
    `,
    imports: [NbRouteTabsetComponent]
})
export class RouteTabSpecimenComponent {
    // The capture adds query parameters, which don't make another tab active.
    readonly activeLinkOptions = { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } as const

    readonly tabsets = TABS.map((inputs) => ({ inputs, tabs: tabsOf(inputs) }))

    readonly json = JSON.stringify

    constructor() {
        const host: HTMLElement = inject(ElementRef).nativeElement
        afterNextRender(() => {
            for (const tabset of Array.from(host.querySelectorAll<HTMLElement>('[data-tab]'))) {
                const inputs = JSON.parse(tabset.dataset['tab'] ?? '{}') as Record<string, string>
                const tab = tabset.querySelectorAll<HTMLElement>('.route-tab')[1]
                tab.setAttribute('data-kit', kit('route-tab', inputs))
                if (inputs['state'] === 'hover') {
                    tab.setAttribute('data-kit-state', 'hover')
                    tab.setAttribute('data-kit-target', ':scope > .tab-link')
                }
            }
        })
    }
}

/** A set whose second tab shows the inputs: the page's route makes it active, else the first tab is. */
function tabsOf({ appearance, content, state }: (typeof TABS)[number]): NbRouteTab[] {
    const bar = appearance === 'bar'
    const active = state === 'active'
    const tabs: NbRouteTab[] = [
        { title: 'Today', icon: bar ? 'home-outline' : undefined, route: active ? `${ROUTE}/today` : ROUTE },
        {
            title: 'Inbox',
            icon: bar || content === 'icon' ? 'email-outline' : undefined,
            badgeText: content === 'badge' ? '3' : undefined,
            badgeStatus: 'danger',
            disabled: state === 'disabled',
            route: active ? ROUTE : `${ROUTE}/inbox`
        }
    ]
    // A bar has three tabs or more, across its width.
    return bar ? [...tabs, { title: 'Saved', icon: 'bookmark-outline', route: `${ROUTE}/saved` }, { title: 'Profile', icon: 'person-outline', route: `${ROUTE}/profile` }] : tabs
}
