import { DestroyRef, Directive, ElementRef, inject } from '@angular/core'
import { OverlayContainer } from '@angular/cdk/overlay'

import { NbOverlayContainerAdapter } from '../adapter/overlay-container-adapter'
import { NbOverlay, NbOverlayContainer, NbOverlayPositionBuilder } from './mapping'
import { NbOverlayService } from './overlay-service'
import { NbPositionBuilderService } from './overlay-position'

/**
 * Shows the overlays of the components inside it, such as select options, autocompletes, datepickers, popovers and
 * tooltips, in its own element instead of the layout or the document body.
 *
 * Overlays can't show over an element in the browser's top layer, such as a modal `<dialog>` or an element in
 * fullscreen, so components in one need their overlays inside it:
 *
 * ```html
 * <dialog nbOverlayHost>
 *   <nb-select>...</nb-select>
 * </dialog>
 * ```
 *
 * @stacked-example(Select in a modal dialog element, overlay/overlay-host.component)
 *
 * Dialogs, windows and toasts opened from inside it still show in the layout.
 */
@Directive({
    selector: '[nbOverlayHost]',
    providers: [
        NbOverlayContainerAdapter,
        { provide: OverlayContainer, useExisting: NbOverlayContainerAdapter },
        { provide: NbOverlayContainer, useExisting: NbOverlayContainerAdapter },
        NbOverlay,
        NbOverlayPositionBuilder,
        NbPositionBuilderService,
        NbOverlayService
    ]
})
export class NbOverlayHostDirective {
    constructor() {
        const container = inject(NbOverlayContainerAdapter, { self: true })
        const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

        container.setContainer(element)
        inject(DestroyRef).onDestroy(() => container.clearContainer(element))
    }
}
