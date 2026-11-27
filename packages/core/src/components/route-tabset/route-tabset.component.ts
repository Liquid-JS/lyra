import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { NbBadgeComponent } from '@liquid-js/lyr-core/badge'
import {
    ɵbelowBreakpoint as belowBreakpoint,
    ɵconvertToBoolProperty as convertToBoolProperty,
    injectNbTexts,
    NbLocalize,
    NbBooleanInput,
    NbComponentOrCustomStatus
} from '@liquid-js/lyr-core/base'
import { NbButtonComponent } from '@liquid-js/lyr-core/button'
import { NbContextMenuDirective } from '@liquid-js/lyr-core/context-menu'
import { NbIconConfig, NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NbMenuItem } from '@liquid-js/lyr-core/menu'
import { NbMergeConfigsPipe } from './merge-configs.pipe'

declare const $localize: NbLocalize

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
    /**
     * When the tab is active, over the tabset's `activeLinkOptions`: e.g. `{ exact: false }` keeps a section's tab
     * active on the routes under it, such as `/problems/12` for `/problems`.
     */
    activeLinkOptions?: RouterLinkActive['routerLinkActiveOptions']
    /** A badge's text, e.g. a count, after the title, or over the icon in a `bar`. */
    badgeText?: string
    /** The badge's status colour; `basic` by default. */
    badgeStatus?: NbComponentOrCustomStatus
    /** Shows the badge as a dot, without its text. */
    badgeDot?: boolean
}

/** `tabs`, as a page's or a header's; or `bar`, a phone's navigation along the bottom, icons over titles. */
export type NbRouteTabsetAppearance = 'tabs' | 'bar'

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
 * A `disabled` tab is shown but isn't a link, and a tab's `badgeText` or `badgeDot` shows a badge on it.
 *
 * On a phone, the same tabs can be the navigation along the bottom, `appearance="bar"`, in a fixed footer shown below
 * a breakpoint, while the header shows them above it:
 *
 * ```html
 * <nb-layout-header fixed>
 *   <nb-route-tabset *nbShownAbove="'md'" [tabs]="sections" outlet="false" />
 * </nb-layout-header>
 * <nb-layout-footer fixed *nbShownBelow="'md'">
 *   <nb-route-tabset [tabs]="sections" outlet="false" appearance="bar" />
 * </nb-layout-footer>
 * ```
 *
 * Or the header's tabs fold into a menu button below a breakpoint, `collapse="menu" below="md"`.
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
 * route-tabset-bar-background-color:
 * route-tabset-bar-tab-padding:
 * route-tabset-bar-tab-gap:
 * route-tabset-bar-tab-icon-size:
 * route-tabset-bar-tab-text-font-family:
 * route-tabset-bar-tab-text-font-size:
 * route-tabset-bar-tab-text-font-weight:
 * route-tabset-bar-tab-text-line-height:
 * route-tabset-bar-tab-text-transform:
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
        NbMergeConfigsPipe,
        NgTemplateOutlet,
        NbBadgeComponent,
        NbButtonComponent,
        NbContextMenuDirective
    ],
    host: {
        '[class.full-width]': 'fullWidth()',
        '[class.appearance-bar]': 'appearance() === \'bar\'',
        '[class.collapsed]': 'collapsed()'
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

    /** `tabs`, the default, or `bar`: a phone's navigation along the bottom, its tabs sharing the width. */
    readonly appearance = input<NbRouteTabsetAppearance>('tabs')

    /** Folds the tabs into a menu button below the `below` breakpoint, e.g. in a phone's header: `menu`. */
    readonly collapse = input<'menu'>()

    /** The media breakpoint, e.g. `md`, below which the tabs `collapse`. */
    readonly below = input<string>()

    /** Emits the tab whose link was clicked. */
    readonly tabChange = output<NbRouteTab>()

    protected readonly router = inject(Router)
    protected readonly texts = injectNbTexts('routeTabset', () => ({
        menu: $localize`:@@nb.routeTabset.menu:Menu`
    }))

    protected readonly narrow = belowBreakpoint(() => this.below())

    /** Whether the tabs are folded into a menu button now. */
    readonly collapsed = computed(() => this.collapse() === 'menu' && this.narrow())

    /** The tabs as the menu's items, where they're folded into one. */
    protected readonly menuItems = computed<NbMenuItem[]>(() =>
        this.tabs()
            .filter((tab) => !tab.disabled && tab.route !== undefined && tab.route !== null)
            .map((tab) => ({
                title: tab.title ?? '',
                link: this.linkOf(tab),
                icon: tab.icon,
                queryParams: tab.queryParams ?? undefined,
                queryParamsHandling: tab.queryParamsHandling ?? undefined,
                fragment: tab.fragment,
                ...(tab.badgeText || tab.badgeDot ? { badge: { text: tab.badgeText, status: tab.badgeStatus ?? 'basic', dotMode: tab.badgeDot } } : {})
            }))
    )

    protected linkOf(tab: NbRouteTab): string {
        const route = tab.route
        if (typeof route === 'string') {
            return route
        }
        return this.router.serializeUrl(route instanceof Array ? this.router.createUrlTree(route) : (route as Parameters<Router['serializeUrl']>[0]))
    }

    selectTab(tab: NbRouteTab) {
        this.tabChange.emit(tab)
    }
}
