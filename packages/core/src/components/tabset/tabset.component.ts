import { delay, filter, map } from 'rxjs/operators'
import {
    AfterContentInit,
    Component,
    contentChild,
    contentChildren,
    DestroyRef,
    inject,
    input,
    linkedSignal,
    output
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base'
import { NbBadgePosition, NbBadgeComponent } from '@liquid-js/lyr-core/badge'
import { NbIconConfig, NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NgTemplateOutlet } from '@angular/common'
import { NbTabContentDirective } from './tab-content.directive'
import { NbTabTitleDirective } from './tab-title.directive'

let lastTabId = 0

/**
 * A tab of an `nb-tabset`: its title, icon and badge, and its content.
 *
 * ```html
 * <nb-tab tabTitle="Users" badgeText="99+" badgeStatus="danger">
 *   <p>List of <strong>users</strong>.</p>
 * </nb-tab>
 * ```
 */
@Component({
    selector: 'nb-tab',
    templateUrl: './tab.component.html',
    imports: [NgTemplateOutlet],
    host: {
        'role': 'tabpanel',
        '[id]': 'panelId',
        '[attr.aria-labelledby]': 'labelId',
        '[class.disabled]': 'disabled()',
        '[class.content-active]': 'isActive()'
    }
})
export class NbTabComponent {
    /** @internal The id of the tab's panel, which its tab controls. */
    readonly panelId = `nb-tab-panel-${lastTabId}`
    /** @internal The id of the tab, which names its panel. */
    readonly labelId = `nb-tab-${lastTabId++}`

    readonly tabContentDirective = contentChild(NbTabContentDirective)
    readonly tabTitleDirective = contentChild(NbTabTitleDirective)

    /** The title; an `nbTabTitle` template in the tab takes its place. */
    readonly tabTitle = input<string>()

    /** Set as `data-tab-id` on the tab, e.g. for tests. */
    readonly tabId = input<string>()

    /** Shows the badge as a dot, without its text; in the top right corner unless `badgePosition` says otherwise. */
    readonly badgeDot = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** An icon before the title, by name or as an icon config. */
    readonly tabIcon = input<string | NbIconConfig>()

    /** The tab can't be selected, by a click or the keyboard, which skips it. */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Hides the title, leaving the icon, on screens narrower than the theme's `$tabset-tab-text-hide-breakpoint`
     * (36rem by default).
     */
    readonly responsive = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * The value of the tabset's `routeParam` that selects this tab. The tabset doesn't navigate: the app navigates in
     * `tabChange`, e.g. to `['..', tab.route()]`. For tabs that are links, see `nb-route-tabset`.
     */
    readonly route = input<string>()

    /** Selected at the start. Without an active tab, or a `routeParam`, the tabset selects its first tab. */
    readonly active = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Renders an `nbTabContent` from the start, rather than when the tab is first selected. */
    readonly lazyLoad = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** The badge's text. */
    readonly badgeText = input<string>()

    /** The badge's status colour; 'basic' by default. */
    readonly badgeStatus = input<NbComponentOrCustomStatus>('basic')

    /**
     * Where the badge sits on the tab, e.g. 'top end' or 'bottom start'. Without one, a badge's text follows the tab's
     * title and a dot sits in the top right corner.
     */
    readonly badgePosition = input<NbBadgePosition>()

    /**
     * Whether the tab is active: the `active` input, until the tabset selects another tab.
     */
    readonly isActive = linkedSignal(() => this.active())

    /**
     * Whether the tab's `nbTabContent` is rendered: since the tab was first active, or from the start with
     * `lazyLoad`.
     */
    readonly init = linkedSignal<boolean, boolean>({
        source: () => this.isActive() || this.lazyLoad(),
        computation: (render, previous) => render || !!previous?.value
    })
}

/**
 * Tabs that each show their content when selected.
 *
 * @stacked-example(Showcase, tabset/tabset-showcase.component)
 *
 * ```html
 * <nb-tabset>
 *  <nb-tab tabTitle="Simple Tab #1">
 *    Tab content 1
 *  </nb-tab>
 *  <nb-tab tabTitle="Simple Tab #2">
 *    Tab content 2
 *  </nb-tab>
 * </nb-tabset>
 * ```
 *
 * ### Installation
 *
 * Import `NbTabsetComponent`, `NbTabComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbTabsetComponent, NbTabComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbTabsetModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbTabsetModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * A tab can carry a badge, e.g. a count (`badgeText`) or a dot (`badgeDot`):
 * @stacked-example(Tab With Badge, tabset/tabset-badge.component)
 *
 * With `fullWidth`, the tabs share the width of the tabset:
 * @stacked-example(Full Width, tabset/tabset-width.component)
 *
 * `tabIcon` adds an icon to a tab, with or without a title. A `responsive` tab hides its title on screens narrower
 * than the theme's `$tabset-tab-text-hide-breakpoint`, keeping the icon: make the window narrower, and the titles
 * of the last tabset go.
 * @stacked-example(Icon, tabset/tabset-icon.component)
 *
 * A `disabled` tab can't be selected:
 * @stacked-example(Disabled Tab, tabset/tabset-disabled.component)
 *
 * A tab's content is created with the tabset. Content in an `nbTabContent` template is created when the tab is
 * first selected, and kept from then on:
 * ```html
 * <nb-tabset>
 *   <nb-tab>
 *     <some-component *nbTabContent>Lazy content</some-component>
 *   </nb-tab>
 *   <nb-tab>
 *     <ng-template nbTabContent>
 *       Lazy content with template syntax
 *     </ng-template>
 *   </nb-tab>
 * </nb-tabset>
 * ```
 *
 * An `nbTabTitle` template takes the place of a tab's `tabTitle` text:
 * @stacked-example(Tab title template, tabset/tabset-template-title.component)
 *
 * The tabs are a tab list: Tab reaches the selected tab, the arrow keys, Home and End move between the others, and
 * Enter or Space selects one. With `routeParam`, the tabset selects the tab whose `route` is the param's value, and
 * the app navigates in `tabChange`.
 * @styles
 *
 * tabset-background-color:
 * tabset-border-radius:
 * tabset-shadow:
 * tabset-tab-background-color:
 * tabset-tab-padding:
 * tabset-tab-small-padding:
 * tabset-tab-text-color:
 * tabset-tab-text-font-family:
 * tabset-tab-text-font-size:
 * tabset-tab-text-font-weight:
 * tabset-tab-text-line-height:
 * tabset-tab-text-transform:
 * tabset-tab-underline-width:
 * tabset-tab-underline-color:
 * tabset-tab-active-background-color:
 * tabset-tab-active-text-color:
 * tabset-tab-active-underline-color:
 * tabset-tab-focus-background-color:
 * tabset-tab-focus-text-color:
 * tabset-tab-focus-underline-color:
 * tabset-tab-outline-width:
 * tabset-tab-outline-color:
 * tabset-tab-hover-background-color:
 * tabset-tab-hover-text-color:
 * tabset-tab-hover-underline-color:
 * tabset-tab-disabled-background-color:
 * tabset-tab-badge-dot-mode-horizontal-offset:
 * tabset-tab-disabled-text-color:
 * tabset-tab-disabled-underline-color:
 * tabset-divider-color:
 * tabset-divider-style:
 * tabset-divider-width:
 * tabset-content-background-color:
 * tabset-content-padding:
 * tabset-content-small-padding:
 * tabset-content-text-color:
 * tabset-content-text-font-family:
 * tabset-content-text-font-size:
 * tabset-content-text-font-weight:
 * tabset-content-text-line-height:
 * tabset-scrollbar-color:
 * tabset-scrollbar-background-color:
 * tabset-scrollbar-width:
 */
@Component({
    selector: 'nb-tabset',
    styleUrls: ['./tabset.component.scss'],
    templateUrl: './tabset.component.html',
    imports: [NbIconComponent, NgTemplateOutlet, NbBadgeComponent],
    host: {
        '[class.full-width]': 'fullWidth()'
    }
})
export class NbTabsetComponent implements AfterContentInit {
    private readonly route = inject(ActivatedRoute)
    private readonly destroyRef = inject(DestroyRef)

    readonly tabs = contentChildren(NbTabComponent)

    /** The tabs share the tabset's width. */
    readonly fullWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** A route param the tabset selects the tab by: the tab whose `route` is its value. */
    readonly routeParam = input<string>()

    /** Emits the tab selected by the user, the route or at the start. */
    readonly tabChange = output<NbTabComponent>()

    ngAfterContentInit() {
        this.route.params
            .pipe(
                map((params) => {
                    const routeParam = this.routeParam()
                    return this.tabs().find((tab) => (routeParam ? tab.route() === params[routeParam] : tab.isActive()))
                }),
                // Select after the change detection that rendered the tabs.
                delay(0),
                map((tab?: NbTabComponent) => tab || this.tabs()[0]),
                filter((tab): tab is NbTabComponent => !!tab),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((tabToSelect: NbTabComponent) => this.selectTab(tabToSelect))
    }

    /** Selects a tab, unless it's disabled. */
    selectTab(selectedTab: NbTabComponent) {
        if (!selectedTab.disabled()) {
            this.tabs().forEach((tab) => tab.isActive.set(tab === selectedTab))
            this.tabChange.emit(selectedTab)
        }
    }

    /** @internal Tab reaches the selected tab, or the first one that isn't disabled; the arrow keys the others. */
    isTabbable(tab: NbTabComponent) {
        const tabs = this.tabs()
        const active = tabs.find((item) => item.isActive() && !item.disabled())
        return tab === (active ?? tabs.find((item) => !item.disabled()))
    }

    /**
     * @internal As in a tab list: the arrow keys, Home and End move between the tabs, in the page's direction, and
     * Enter or Space selects one.
     */
    onKeydown(event: KeyboardEvent, tab: NbTabComponent) {
        const current = event.currentTarget as HTMLElement
        const list = current.parentElement
        if (!list || event.target !== current) {
            return
        }
        const elements = Array.from(list.querySelectorAll<HTMLElement>(':scope > [role="tab"]:not([aria-disabled="true"])'))
        const index = elements.indexOf(current)
        const step = getComputedStyle(list).direction === 'rtl' ? -1 : 1
        const targets: Record<string, HTMLElement | undefined> = {
            ArrowRight: elements[(index + step + elements.length) % elements.length],
            ArrowLeft: elements[(index - step + elements.length) % elements.length],
            Home: elements[0],
            End: elements[elements.length - 1]
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            this.selectTab(tab)
        } else if (index >= 0 && targets[event.key]) {
            event.preventDefault()
            targets[event.key]?.focus()
        }
    }
}
