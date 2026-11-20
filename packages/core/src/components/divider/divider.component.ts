import { Component, input } from '@angular/core'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'

/**
 * A line that separates content: sections of a page or a card, or items in a row.
 *
 * ```html
 * <nb-divider />
 * ```
 *
 * @stacked-example(Showcase, divider/divider-showcase.component)
 *
 * Its content sits in the middle of the line, e.g. "or" between two ways to sign in:
 *
 * ```html
 * <nb-divider>or</nb-divider>
 * ```
 *
 * A `vertical` divider separates items in a row: in a flex row it is as tall as the row, and in a line of text as
 * tall as the text.
 *
 * ```html
 * <nav class="links">Home <nb-divider vertical /> Pricing <nb-divider vertical /> Help</nav>
 * ```
 *
 * It's a `separator` for assistive technologies, which skip its content. A plain `<hr>` gets the same line.
 * @styles
 *
 * divider-margin:
 * divider-vertical-margin:
 * divider-content-gap:
 * divider-content-text-color:
 * divider-content-text-font-family:
 * divider-content-text-font-size:
 * divider-content-text-font-weight:
 * divider-content-text-line-height:
 */
@Component({
    selector: 'nb-divider',
    template: '<span class="divider-content"><ng-content /></span>',
    host: {
        'role': 'separator',
        '[attr.aria-orientation]': 'vertical() ? "vertical" : null',
        '[class.vertical]': 'vertical()'
    }
})
export class NbDividerComponent {
    /** Whether the line is vertical, between items in a row. */
    readonly vertical = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })
}
