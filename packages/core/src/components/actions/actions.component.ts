import { Component, computed, contentChildren, ElementRef, forwardRef, inject, input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { filter } from 'rxjs/operators'

import {
    ɵbelowBreakpoint as belowBreakpoint,
    ɵconvertToBoolProperty as convertToBoolProperty,
    injectNbTexts,
    NbLocalize,
    NbBooleanInput,
    NbComponentSize,
    NbComponentOrCustomStatus
} from '@liquid-js/lyr-core/base'
import { NbBadgePosition, NbBadgeComponent } from '@liquid-js/lyr-core/badge'
import { NbContextMenuDirective } from '@liquid-js/lyr-core/context-menu'
import { NbIconConfig, NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NbMenuItem, NbMenuService } from '@liquid-js/lyr-core/menu'
import { RouterLink } from '@angular/router'
import { NgTemplateOutlet } from '@angular/common'

declare const $localize: NbLocalize

let actionsId = 0

/**
 * An action in `nb-actions`: a link with an icon, or any content given instead of an icon.
 */
@Component({
    selector: 'nb-action',
    styleUrls: ['./action.component.scss'],
    templateUrl: './actions.component.html',
    imports: [RouterLink, NbIconComponent, NgTemplateOutlet, NbBadgeComponent],
    host: {
        '[class.disabled]': 'disabled()',
        '[class.folded]': 'folded()'
    }
})
export class NbActionComponent {
    readonly element: ElementRef<HTMLElement> = inject(ElementRef)
    protected readonly actions = inject(forwardRef(() => NbActionsComponent), { optional: true })

    /**
     * Router link of the icon; wins over `href`.
     */
    readonly link = input<string>()

    /**
     * Plain `href` of the icon. Without `link` or `href` the icon is a link that goes nowhere.
     */
    readonly href = input<string>()

    /**
     * Title (tooltip) of the icon link.
     */
    readonly title = input<string>('')

    /**
     * Icon name or config. Without it the action shows its content instead.
     */
    readonly icon = input<string | NbIconConfig>()

    /**
     * Disables the item: dimmed, skipped by Tab and `aria-disabled`.
     */
    readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Shows the badge as a dot, without text.
     */
    readonly badgeDot = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Text of the badge, which shows when this or `badgeDot` is set.
     */
    readonly badgeText = input<string>()

    /**
     * Badge status: `basic` (default), `primary`, `info`, `success`, `warning`, `danger`, `control` or a custom one.
     */
    readonly badgeStatus = input<NbComponentOrCustomStatus>('basic')

    /**
     * Badge position, `top right` by default: a physical corner such as `bottom left`, or a logical one such as
     * `top end`.
     */
    readonly badgePosition = input<NbBadgePosition>()

    /** Whether it's an icon with a title, which `nb-actions` can fold into its menu. */
    readonly foldable = computed(() => !!this.icon() && !!this.title() && !this.disabled())

    /** Whether it's in its `nb-actions`' menu now, rather than in the row. */
    readonly folded = computed(() => this.foldable() && !!this.actions?.collapsed())
}

/**
 * Shows a row of actions, vertically centred, in several sizes.
 *
 * @stacked-example(Showcase, action/action-showcase.component)
 *
 * Basic actions setup:
 * ```html
 * <nb-actions size="small">
 *   <nb-action icon="search-outline"></nb-action>
 *   <nb-action icon="power-outline"></nb-action>
 *   <nb-action icon="person-outline"></nb-action>
 * </nb-actions>
 * ```
 * ### Installation
 *
 * Import `NbActionsComponent`, `NbActionComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbActionsComponent, NbActionComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbActionsModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbActionsModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Its sizes are the sizes of its icons, from 1rem for `tiny` to 4rem for `giant`, not the heights of controls, so the
 * app's size for controls doesn't change them:
 * @stacked-example(Multiple Sizes, action/action-sizes.component)
 *
 * It is also possible to specify a `badge` value:
 * @stacked-example(Action Badge, action/action-badge.component)
 *
 * and we can set it to full a width of a parent component
 * @stacked-example(Full Width, action/action-width.component)
 *
 * Action dot mode
 * @stacked-example(Action badge in dot mode, action/action-dot-mode.component)
 *
 * On a phone, the actions that are icons with a `title` fold into a menu button below a breakpoint, as an app bar's
 * do; the others, e.g. a user's picture, stay:
 * ```html
 * <nb-actions collapse="menu" below="md">
 *   <nb-action icon="search-outline" title="Search" link="/search" />
 *   <nb-action icon="settings-2-outline" title="Settings" (click)="openSettings()" />
 *   <nb-action><nb-user onlyPicture name="Jane Doe" /></nb-action>
 * </nb-actions>
 * ```
 * @styles
 *
 * actions-background-color:
 * actions-divider-color:
 * actions-divider-style:
 * actions-divider-width:
 * actions-icon-color:
 * actions-text-color:
 * actions-text-font-family:
 * actions-text-font-weight:
 * actions-text-line-height:
 * actions-disabled-icon-color:
 * actions-disabled-text-color:
 * actions-tiny-height:
 * actions-tiny-icon-height:
 * actions-tiny-padding:
 * actions-tiny-text-font-size:
 * actions-small-height:
 * actions-small-icon-height:
 * actions-small-padding:
 * actions-small-text-font-size:
 * actions-medium-height:
 * actions-medium-icon-height:
 * actions-medium-padding:
 * actions-medium-text-font-size:
 * actions-large-height:
 * actions-large-icon-height:
 * actions-large-padding:
 * actions-large-text-font-size:
 * actions-giant-height:
 * actions-giant-icon-height:
 * actions-giant-padding:
 * actions-giant-text-font-size:
 */
@Component({
    selector: 'nb-actions',
    styleUrls: ['./actions.component.scss'],
    template: `
        <ng-content select="nb-action" />
        @if (collapsed() && menuItems().length) {
        <nb-action class="more">
            <button type="button"
                class="more-button"
                [attr.aria-label]="texts().more"
                [nbContextMenu]="menuItems()"
                [nbContextMenuTag]="tag">
                <nb-icon icon="more-vertical-outline" pack="essentials" />
            </button>
        </nb-action>
        }
    `,
    // The menu button looks like an icon action.
    styles: `
        .more-button {
            display: inline-flex;
            padding: 0;
            border: 0;
            background: none;
            color: inherit;
            font: inherit;
            cursor: pointer;
        }
    `,
    imports: [forwardRef(() => NbActionComponent), NbContextMenuDirective, NbIconComponent],
    host: {
        '[class]': '"size-" + size()',
        '[class.full-width]': 'fullWidth()',
        '[class.collapsed]': 'collapsed()'
    }
})
export class NbActionsComponent {
    /**
     * Size of the icons: `tiny`, `small` (default), `medium`, `large` or `giant`.
     */
    readonly size = input<NbComponentSize>('small')

    /**
     * Fills the width of the container, the actions sharing it equally.
     */
    readonly fullWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Folds the actions that are icons with a `title` into a menu button below the `below` breakpoint: `menu`. */
    readonly collapse = input<'menu'>()

    /** The media breakpoint, e.g. `md`, below which the actions `collapse`. */
    readonly below = input<string>()

    protected readonly texts = injectNbTexts('actions', () => ({
        more: $localize`:@@nb.actions.more:More`
    }))

    protected readonly tag = `nb-actions-${actionsId++}`
    protected readonly narrow = belowBreakpoint(() => this.below())
    protected readonly actions = contentChildren(NbActionComponent)

    /** Whether the actions are folded into a menu button now. */
    readonly collapsed = computed(() => this.collapse() === 'menu' && this.narrow())

    /** The folded actions as the menu's items: a link's, or one that clicks the action. */
    protected readonly menuItems = computed<NbMenuItem[]>(() =>
        this.actions()
            .filter((action) => action.foldable())
            .map((action) => ({
                title: action.title(),
                icon: action.icon(),
                ...(action.link() ? { link: action.link() } : action.href() ? { url: action.href() } : {}),
                ...(action.badgeText() || action.badgeDot() ? { badge: { text: action.badgeText(), status: action.badgeStatus(), dotMode: action.badgeDot() } } : {}),
                data: action
            }))
    )

    constructor() {
        // An action without a link does what clicking it does.
        inject(NbMenuService)
            .onItemClick()
            .pipe(
                filter(({ tag, item }) => tag === this.tag && !item.link && !item.url),
                takeUntilDestroyed()
            )
            .subscribe(({ item }) => (item.data as NbActionComponent | undefined)?.element.nativeElement.click())
    }
}
