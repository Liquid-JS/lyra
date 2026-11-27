import { afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, Injector, input, output } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgTemplateOutlet } from '@angular/common'
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { filter } from 'rxjs/operators'

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
import { NbMenuItem, NbMenuService } from '@liquid-js/lyr-core/menu'
import { NbMergeConfigsPipe } from './merge-configs.pipe'

let nextMenuId = 0

declare const $localize: NbLocalize

/**
 * A tab of an `nb-route-tabset`: a router link, with the `routerLink` options it passes on, and its look. A tab is
 * active while its route is the page's, by `activeLinkOptions`.
 */
export interface NbRouteTab {
    /** The route, as `routerLink` takes it. */
    route?: RouterLink['routerLink']
    /** The tab's title; without one, its icon alone, which then needs a name in its `icon` config's `options`. */
    title?: string
    /** An icon before the title, or over it in a `bar`: its name in the default pack, or an `NbIconConfig`. */
    icon?: string | NbIconConfig
    /** Shows the tab without making it a link. */
    disabled?: boolean
    /** Hides the title on a screen up to 576 px wide, `$route-tabset-tab-text-hide-breakpoint`, e.g. to leave its icon. */
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
 *   <nb-route-tabset *nbShownAbove="'md'" [tabs]="sections" outlet="false" showIcons="false" />
 * </nb-layout-header>
 * <nb-layout-footer fixed *nbShownBelow="'md'">
 *   <nb-route-tabset [tabs]="sections" outlet="false" appearance="bar" />
 * </nb-layout-footer>
 * ```
 *
 * `showIcons="false"` leaves the tabs' icons out, here the header's, so one list of tabs serves both. Tabs short of
 * room shrink, their titles wrapping onto more lines; with `wrap="false"` they stay on one line that scrolls sideways.
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
        '[class.collapsed]': 'collapsed()',
        '[class.nowrap]': '!wrap()'
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

    /**
     * Shows the tabs' icons; off, the tabs show their titles alone, e.g. in a header whose tabs are text while the
     * same tabs in a phone's `bar` have icons.
     */
    readonly showIcons = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * Whether its tabs wrap their titles onto more lines when they don't fit; without, they stay on one line that
     * scrolls sideways, keeping the active tab in view.
     */
    readonly wrap = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /** `tabs`, the default, or `bar`: a phone's navigation along the bottom, its tabs sharing the width. */
    readonly appearance = input<NbRouteTabsetAppearance>('tabs')

    /** Folds the tabs into a menu button below the `below` breakpoint, e.g. in a phone's header: `menu`. */
    readonly collapse = input<'menu'>()

    /** The media breakpoint, e.g. `md`, below which the tabs `collapse`. */
    readonly below = input<string>()

    /** Emits the tab whose link was clicked, also in the menu the tabs fold into. */
    readonly tabChange = output<NbRouteTab>()

    protected readonly router = inject(Router)

    /** The tag of the menu the tabs fold into, whose picks are its tabs'. */
    protected readonly menuTag = `nb-route-tabset-menu-${nextMenuId++}`
    protected readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)
    protected readonly injector = inject(Injector)

    constructor() {
        // A tab picked from the folded menu is a tab clicked.
        inject(NbMenuService)
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === this.menuTag),
                takeUntilDestroyed()
            )
            .subscribe(({ item }) => this.selectTab(item.data as NbRouteTab))

        // On one line, the active tab is in view once the router has gone to its route.
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd), takeUntilDestroyed()).subscribe(() => {
            if (!this.wrap()) {
                afterNextRender(() => this.hostElement.nativeElement.querySelector('.route-tab.active')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }), { injector: this.injector })
            }
        })
    }
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
                icon: this.showIcons() ? tab.icon : undefined,
                queryParams: tab.queryParams ?? undefined,
                queryParamsHandling: tab.queryParamsHandling ?? undefined,
                fragment: tab.fragment,
                data: tab,
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
