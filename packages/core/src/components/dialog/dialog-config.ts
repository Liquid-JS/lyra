import { InjectionToken, ViewContainerRef } from '@angular/core'

import { NbComponentContext, NbGlobalPosition } from '@liquid-js/lyr-core/cdk'

/**
 * Where a dialog appears: `center`, `top` or `bottom` (centered horizontally), or a corner, named as for toasts,
 * e.g. `bottom-start` or `top-right`.
 */
export type NbDialogPosition = 'center' | 'top' | 'bottom' | `${NbGlobalPosition}`

export const NB_DIALOG_CONFIG = new InjectionToken<NbDialogConfig>('Default dialog options')

/**
 * The options of `NbDialogService.open`, and the defaults given to `provideNbDialog`.
 */
export class NbDialogConfig<D = unknown> {
    /**
     * Shows a backdrop under the dialog, which makes it modal; `true` by default.
     */
    hasBackdrop = true

    /**
     * Class of the backdrop element.
     */
    backdropClass = 'overlay-backdrop'

    /**
     * Class of the overlay pane around the dialog.
     */
    dialogClass = ''

    /**
     * Closes the dialog with a click on the backdrop; `true` by default.
     */
    closeOnBackdropClick = true

    /**
     * Closes the dialog with Escape; `true` by default. Either way the dialog takes Escape from what's under it.
     */
    closeOnEsc = true

    /**
     * Lets the page scroll under the dialog; by default it can't.
     */
    hasScroll = false

    /**
     * Focuses the dialog's first focusable element once it opens, and returns the focus when it closes; `true` by
     * default. Otherwise the focus stays where it was.
     */
    autoFocus = true

    /**
     * Where the attached component should live in Angular's *logical* component tree.
     * This affects what is available for injection and the change detection order for the
     * component instantiated inside of the dialog. This does not affect where the dialog
     * content will be rendered.
     */
    viewContainerRef?: ViewContainerRef

    /**
     * Closes the dialog when a navigation leaves its page, e.g. with the browser's back button; `false` by default.
     * A navigation that only changes the query or fragment, as apps do to keep state in the URL, leaves it open.
     */
    closeOnNavigation = false

    /**
     * Where the dialog appears: `center` (default), `top`, `bottom`, or a corner such as `bottom-start`;
     * `start` and `end` follow the layout direction.
     */
    position: NbDialogPosition = 'center'

    /**
     * Space between the dialog and the viewport edges it's placed against, e.g. `1rem`.
     */
    positionOffset = ''

    /**
     * The dialog's ARIA role: `dialog`, or `alertdialog` for one that asks the user to confirm or acknowledge something.
     */
    role: 'dialog' | 'alertdialog' = 'dialog'

    /**
     * Id of the element that names the dialog, usually its title.
     */
    ariaLabelledBy?: string

    /**
     * Id of the element that describes the dialog, e.g. its message.
     */
    ariaDescribedBy?: string

    /**
     * Data for the content: a component's inputs, or what a template gets as `$implicit`.
     */
    context?: NbComponentContext<D>

    constructor(config: Partial<NbDialogConfig<D>>) {
        Object.assign(this, config)
    }
}
