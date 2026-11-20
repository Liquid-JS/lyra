import { Component, input, computed } from '@angular/core'

import { NbComponentSize, NbComponentOrCustomStatus, injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base'

/** @internal */
declare const $localize: NbLocalize

/**
 * A spinner with a message, "Loading..." by default; a `status` region, so assistive technologies announce it.
 * `nbSpinner` places one over an element while it loads.
 *
 * @styles
 *
 * spinner-text-color:
 * spinner-text-font-family:
 * spinner-text-font-size:
 * spinner-text-font-weight:
 * spinner-text-line-height:
 * spinner-basic-background-color:
 * spinner-basic-circle-filled-color:
 * spinner-basic-circle-empty-color:
 * spinner-primary-background-color:
 * spinner-primary-circle-filled-color:
 * spinner-primary-circle-empty-color:
 * spinner-info-background-color:
 * spinner-info-circle-filled-color:
 * spinner-info-circle-empty-color:
 * spinner-success-background-color:
 * spinner-success-circle-filled-color:
 * spinner-success-circle-empty-color:
 * spinner-warning-background-color:
 * spinner-warning-circle-filled-color:
 * spinner-warning-circle-empty-color:
 * spinner-danger-background-color:
 * spinner-danger-circle-filled-color:
 * spinner-danger-circle-empty-color:
 * spinner-control-background-color:
 * spinner-control-circle-filled-color:
 * spinner-control-circle-empty-color:
 * spinner-height-tiny:
 * spinner-height-small:
 * spinner-height-medium:
 * spinner-height-large:
 * spinner-height-giant:
 */
@Component({
    selector: 'nb-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    host: {
        '[class]': 'hostClasses()',
        // Announces its message, or "Loading..." without one.
        'role': 'status',
        '[attr.aria-label]': 'shownMessage() ? null : texts().message'
    }
})
export class NbSpinnerComponent {
    protected readonly texts = injectNbTexts('spinner', () => ({
        message: $localize`:@@nb.spinner.message:Loading...`
    }))

    /** The message shown, "Loading..." by default; an empty one shows none. */
    protected readonly shownMessage = computed(() => this.message() ?? this.texts().message)

    /** The message beside the spinner: "Loading..." when unset, none when empty. */
    readonly message = input<string>()

    /** `tiny`, `small`, `medium` (default), `large` or `giant`. */
    readonly size = input<NbComponentSize>('medium')

    /** `basic` (default), `primary`, `info`, `success`, `warning`, `danger` or `control`. */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    protected readonly hostClasses = computed(() =>
        [
            this.size() && `size-${this.size()}`,
            this.status() && `status-${this.status()}`
        ].filter(Boolean)
    )
}
