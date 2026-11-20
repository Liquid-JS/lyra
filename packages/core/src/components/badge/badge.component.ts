import { Component, computed, inject, input } from '@angular/core'

import { NbStatusService, NbComponentOrCustomStatus, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'

export type NbBadgePhysicalPosition =
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
    | 'center right'
    | 'center left'
export type NbBadgeLogicalPosition =
    | 'top start'
    | 'top end'
    | 'bottom start'
    | 'bottom end'
    | 'center start'
    | 'center end'
export type NbBadgePosition = NbBadgePhysicalPosition | NbBadgeLogicalPosition
/**
 * Shows the badge in the flow of text, e.g. as a status dot before a label.
 */
export type NbBadgeInlinePosition = 'inline'

export interface NbBadge {
    text?: string
    position?: NbBadgePosition
    status?: NbComponentOrCustomStatus
    dotMode?: boolean
}

/**
 * Badge is a simple labeling component.
 * It can be used to add additional information to any content or highlight unread items.
 *
 * Element is absolute positioned, so parent should be
 * [positioned element](https://developer.mozilla.org/en-US/docs/Web/CSS/position).
 * It means parent `position` should be set to anything except `static`, e.g. `relative`,
 * `absolute`, `fixed`, or `sticky`.
 *
 * ### Installation
 *
 * Import `NbBadgeComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbBadgeComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbBadgeModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbBadgeModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Badge with default position and status(color):
 *
 * ```html
 * <nb-badge text="badgeText"></nb-badge>
 * ```
 *
 * For example, badge can be placed into nb-card header:
 *
 * @stacked-example(Showcase, badge/badge-showcase.component)
 *
 * Badge located on the bottom right with warning status:
 *
 * ```html
 * <nb-badge text="badgeText" status="warning" position="bottom right">
 * </nb-badge>
 * ```
 *
 * With `position="inline"` the badge is part of the text instead, so its parent doesn't need to be positioned.
 * In dot mode it's centred on the text, e.g. to show a status before a label:
 *
 * ```html
 * <nb-badge dotMode status="success" position="inline" /> Paid
 * ```
 * @stacked-example(Inline, badge/badge-inline.component)
 * @styles
 *
 * badge-border-radius:
 * badge-text-font-family:
 * badge-dot-mode-padding:
 * badge-text-font-size:
 * badge-text-font-weight:
 * badge-text-line-height:
 * badge-padding:
 * badge-basic-background-color:
 * badge-dot-mode-border-radius:
 * badge-basic-text-color:
 * badge-primary-background-color:
 * badge-primary-text-color:
 * badge-success-background-color:
 * badge-success-text-color:
 * badge-info-background-color:
 * badge-info-text-color:
 * badge-warning-background-color:
 * badge-warning-text-color:
 * badge-danger-background-color:
 * badge-danger-text-color:
 * badge-control-background-color:
 * badge-control-text-color:
 */
@Component({
    selector: 'nb-badge',
    styleUrls: ['./badge.component.scss'],
    template: '{{ dotMode() ? \'\' : text() }}',
    host: {
        '[class]': 'statusClass()',
        '[class.dot-mode]': 'dotMode()',
        '[class.position-top]': "position().includes('top')",
        '[class.position-right]': "position().includes('right')",
        '[class.position-bottom]': "position().includes('bottom')",
        '[class.position-left]': "position().includes('left')",
        '[class.position-start]': "position().includes('start')",
        '[class.position-end]': "position().includes('end')",
        '[class.position-center]': "position().includes('center')",
        '[class.position-inline]': "position() === 'inline'"
    }
})
export class NbBadgeComponent {
    protected readonly statusService = inject(NbStatusService)

    /**
     * Text to show; hidden in `dotMode`.
     */
    readonly text = input<string | undefined>('')

    /**
     * Badge position, `top right` by default (also for an empty value): a physical corner or side such as
     * `bottom left` or `center right`, a logical one such as `top end`, or `inline` to show it in the flow of text.
     */
    readonly position = input<
    NbBadgePosition | NbBadgeInlinePosition,
    NbBadgePosition | NbBadgeInlinePosition | '' | null | undefined
    >('top right', {
        transform: (position) => position || 'top right'
    })

    /**
     * Shows the badge as a dot, without text.
     */
    readonly dotMode = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Badge status: `basic` (default), `primary`, `info`, `success`, `warning`, `danger`, `control` or a custom one.
     */
    readonly status = input<NbComponentOrCustomStatus | undefined>('basic')

    protected readonly statusClass = computed(() => this.statusService.getStatusClass(this.status()))
}
