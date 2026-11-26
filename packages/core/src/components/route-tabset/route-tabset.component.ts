import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbIconConfig, NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NbMergeConfigsPipe } from './merge-configs.pipe'

export interface NbRouteTab {
    route?: RouterLink['routerLink']
    title?: string
    icon?: string | NbIconConfig
    disabled?: boolean
    responsive?: boolean
    queryParams?: RouterLink['queryParams']
    queryParamsHandling?: RouterLink['queryParamsHandling']
    fragment?: RouterLink['fragment']
    preserveFragment?: RouterLink['preserveFragment']
    skipLocationChange?: RouterLink['skipLocationChange']
    replaceUrl?: RouterLink['replaceUrl']
    state?: RouterLink['state']
    activeLinkOptions?: RouterLinkActive['routerLinkActiveOptions']
}

/**
 * Tabs that are router links, with a `router-outlet` under them for the active route's content. Without the outlet,
 * `outlet="false"`, the tabs are navigation alone, such as a header's links to the app's pages:
 *
 * ```html
 * <nb-layout-header>
 *   <nb-route-tabset [tabs]="pages" outlet="false" />
 * </nb-layout-header>
 * ```
 *
 * ```ts
 * tabs: NbRouteTab[] = [
 *   {
 *     title: 'Route tab #1',
 *     route: '/pages/description',
 *     icon: 'home',
 *     responsive: true, // hides the title on screens narrower than `$route-tabset-tab-text-hide-breakpoint`
 *   },
 *   {
 *     title: 'Route tab #2',
 *     route: '/pages/images',
 *   },
 * ];
 * ```
 *
 * ```html
 * <nb-route-tabset [tabs]="tabs" />
 * ```
 *
 * A tab is active while its link is, by `activeLinkOptions`; a tab's own `activeLinkOptions` add to the tabset's.
 * A `disabled` tab is shown but isn't a link.
 *
 * ### Installation
 *
 * Import `NbRouteTabsetComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbRouteTabsetComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbRouteTabsetModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbRouteTabsetModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * @stacked-example(Route Tabset, tabset/route-tabset-showcase.component)
 * @styles
 *
 * route-tabset-background-color:
 * route-tabset-border-radius:
 * route-tabset-shadow:
 * route-tabset-tab-background-color:
 * route-tabset-tab-padding:
 * route-tabset-tab-small-padding:
 * route-tabset-tab-text-color:
 * route-tabset-tab-text-font-family:
 * route-tabset-tab-text-font-size:
 * route-tabset-tab-text-font-weight:
 * route-tabset-tab-text-line-height:
 * route-tabset-tab-text-transform:
 * route-tabset-tab-underline-width:
 * route-tabset-tab-underline-color:
 * route-tabset-tab-active-background-color:
 * route-tabset-tab-active-text-color:
 * route-tabset-tab-active-underline-color:
 * route-tabset-tab-focus-background-color:
 * route-tabset-tab-focus-text-color:
 * route-tabset-tab-focus-underline-color:
 * route-tabset-tab-outline-width:
 * route-tabset-tab-outline-color:
 * route-tabset-tab-hover-background-color:
 * route-tabset-tab-hover-text-color:
 * route-tabset-tab-hover-underline-color:
 * route-tabset-tab-disabled-background-color:
 * route-tabset-tab-disabled-text-color:
 * route-tabset-tab-disabled-underline-color:
 * route-tabset-divider-color:
 * route-tabset-divider-style:
 * route-tabset-divider-width:
 * route-tabset-scrollbar-color:
 * route-tabset-scrollbar-background-color:
 * route-tabset-scrollbar-width:
 */
@Component({
    selector: 'nb-route-tabset',
    styleUrls: ['./route-tabset.component.scss'],
    templateUrl: './route-tabset.component.html',
    // Tabs are plain objects that apps can change in place.
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        NbIconComponent,
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        NbMergeConfigsPipe
    ],
    host: {
        '[class.full-width]': 'fullWidth()'
    }
})
export class NbRouteTabsetComponent {
    /** The tabs, each a link to its `route`. */
    readonly tabs = input<NbRouteTab[]>([])

    /** The `routerLinkActiveOptions` of the tabs' links; `{ exact: true }` by default. */
    readonly activeLinkOptions = input<RouterLinkActive['routerLinkActiveOptions']>({ exact: true })

    /** Shows the active route's content in a `router-outlet` under the tabs; off, the tabs are navigation alone. */
    readonly outlet = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /** The tabs share the tabset's width. */
    readonly fullWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Emits the tab whose link was clicked. */
    readonly tabChange = output<NbRouteTab>()

    selectTab(tab: NbRouteTab) {
        this.tabChange.emit(tab)
    }
}
