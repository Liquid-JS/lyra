import { NgTemplateOutlet } from '@angular/common'
import { Component, input, computed } from '@angular/core'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, NbComponentSize, NbComponentOrCustomStatus, injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base'

/** @internal */
declare const $localize: NbLocalize

/**
 * Shows how far something has progressed, as a bar or a ring.
 *
 * ```html
 * <nb-progress-bar [value]="50"></nb-progress-bar>
 * ```
 * ### Installation
 *
 * Import `NbProgressBarComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbProgressBarComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbProgressBarModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbProgressBarModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * `value` is a percentage, 0 to 100. It's a `progressbar` for assistive technologies, with its value; name it with
 * `aria-label` or `aria-labelledby`:
 *
 * ```html
 * <nb-progress-bar [value]="uploaded" aria-label="Upload" />
 * ```
 *
 * @stacked-example(Progress bar, progress-bar/progress-bar-showcase.component)
 *
 * `status` colours it:
 * @stacked-example(Progress bar status, progress-bar/progress-bar-status.component)
 *
 * `size` sets its height and font size:
 * @stacked-example(Progress bar size, progress-bar/progress-bar-size.component)
 *
 * `displayValue` shows the value in the bar; content shows custom text instead:
 * @stacked-example(Progress bar value, progress-bar/progress-bar-value.component)
 *
 * `shape="ring"` draws the progress as a ring, filling clockwise from the top, with the value or custom text in its
 * middle:
 * @stacked-example(Progress ring, progress-bar/progress-bar-ring.component)
 *
 * The filled part animates as the value and the status change:
 * @stacked-example(Progress bar interactive, progress-bar/progress-bar-interactive.component)
 * @styles
 *
 * progress-bar-animation-duration:
 * progress-bar-border-radius:
 * progress-bar-text-font-family:
 * progress-bar-tiny-height:
 * progress-bar-tiny-text-font-size:
 * progress-bar-tiny-text-font-weight:
 * progress-bar-tiny-text-line-height:
 * progress-bar-small-height:
 * progress-bar-small-text-font-size:
 * progress-bar-small-text-font-weight:
 * progress-bar-small-text-line-height:
 * progress-bar-medium-height:
 * progress-bar-medium-text-font-size:
 * progress-bar-medium-text-font-weight:
 * progress-bar-medium-text-line-height:
 * progress-bar-large-height:
 * progress-bar-large-text-font-size:
 * progress-bar-large-text-font-weight:
 * progress-bar-large-text-line-height:
 * progress-bar-giant-height:
 * progress-bar-giant-text-font-size:
 * progress-bar-giant-text-font-weight:
 * progress-bar-giant-text-line-height:
 * progress-bar-basic-background-color:
 * progress-bar-basic-filled-background-color:
 * progress-bar-basic-text-color:
 * progress-bar-primary-background-color:
 * progress-bar-primary-filled-background-color:
 * progress-bar-primary-text-color:
 * progress-bar-success-background-color:
 * progress-bar-success-filled-background-color:
 * progress-bar-success-text-color:
 * progress-bar-info-background-color:
 * progress-bar-info-filled-background-color:
 * progress-bar-info-text-color:
 * progress-bar-warning-background-color:
 * progress-bar-warning-filled-background-color:
 * progress-bar-warning-text-color:
 * progress-bar-danger-background-color:
 * progress-bar-danger-filled-background-color:
 * progress-bar-danger-text-color:
 * progress-bar-control-background-color:
 * progress-bar-control-ring-text-color:
 * progress-bar-control-filled-background-color:
 * progress-bar-control-text-color:
 * progress-bar-ring-text-color:
 * progress-bar-tiny-ring-size:
 * progress-bar-tiny-ring-thickness:
 * progress-bar-tiny-ring-text-font-size:
 * progress-bar-small-ring-size:
 * progress-bar-small-ring-thickness:
 * progress-bar-small-ring-text-font-size:
 * progress-bar-medium-ring-size:
 * progress-bar-medium-ring-thickness:
 * progress-bar-medium-ring-text-font-size:
 * progress-bar-large-ring-size:
 * progress-bar-large-ring-thickness:
 * progress-bar-large-ring-text-font-size:
 * progress-bar-giant-ring-size:
 * progress-bar-giant-ring-thickness:
 * progress-bar-giant-ring-text-font-size:
 */
@Component({
    selector: 'nb-progress-bar',
    styleUrls: ['./progress-bar.component.scss'],
    templateUrl: './progress-bar.component.html',
    imports: [NgTemplateOutlet],
    host: {
        '[class]': 'hostClasses()',
        'role': 'progressbar',
        'aria-valuemin': '0',
        'aria-valuemax': '100',
        '[attr.aria-valuenow]': 'shownValue()',
        // Named as a progress bar must be: by `aria-label`, or "Progress", as a spinner is "Loading...".
        '[attr.aria-label]': 'ariaLabel() ?? texts().label'
    }
})
export class NbProgressBarComponent {
    protected readonly texts = injectNbTexts('progressBar', () => ({
        label: $localize`:@@nb.progressBar.label:Progress`
    }))

    /** Names the progress bar, e.g. "Upload"; "Progress" by default. An `aria-labelledby` names it instead. */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })

    /** The progress in percent, 0 to 100. */
    readonly value = input<number>(0)

    /** `basic` (default), `primary`, `info`, `success`, `warning`, `danger` or `control`. */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    /** `tiny`, `small`, `medium` (default), `large` or `giant`: the height and the font size. */
    readonly size = input<NbComponentSize>('medium')

    /** Shows the value, as a percentage, in the bar or the ring's middle; on its own, `displayValue` does. */
    readonly displayValue = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** The progress bar's shape: `bar` (default), or `ring`, a circle that fills clockwise from the top. */
    readonly shape = input<'bar' | 'ring'>('bar')

    /** The value for assistive technologies, within 0 and 100. */
    protected readonly shownValue = computed(() => Math.min(100, Math.max(0, Number(this.value()) || 0)))

    protected readonly hostClasses = computed(() =>
        [
            this.size() && `size-${this.size()}`,
            this.status() && `status-${this.status()}`,
            `shape-${this.shape()}`
        ].filter(Boolean)
    )
}
