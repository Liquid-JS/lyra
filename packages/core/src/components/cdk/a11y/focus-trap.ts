import { Injector, NgZone, inject, Service } from '@angular/core'
import { FocusTrap, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y'

import { NB_DOCUMENT } from '@liquid-js/lyr-core/base'

/**
 * The CDK's focus trap, remembering the element focused when it was created so `restoreFocus` can return to it.
 */
export class NbFocusTrap extends FocusTrap {
    protected previouslyFocusedElement: HTMLElement

    constructor(
        protected element: HTMLElement,
        protected checker: InteractivityChecker,
        protected ngZone: NgZone,
        protected document: Document,
        deferAnchors: boolean | undefined,
        injector: Injector
    ) {
        super(element, checker, ngZone, document, deferAnchors, injector)
        this.previouslyFocusedElement = this.document.activeElement as HTMLElement
    }

    /** Focuses the element focused before the trap and destroys the trap. */
    restoreFocus() {
        this.previouslyFocusedElement.focus()
        this.destroy()
    }

    blurPreviouslyFocusedElement() {
        this.previouslyFocusedElement.blur()
    }
}

@Service()
export class NbFocusTrapFactoryService extends FocusTrapFactory {
    protected readonly checker = inject(InteractivityChecker)
    protected readonly ngZone = inject(NgZone)
    private readonly document = inject(NB_DOCUMENT) as Document
    private readonly injector = inject(Injector)

    override create(element: HTMLElement, deferCaptureElements?: boolean): NbFocusTrap {
        return new NbFocusTrap(element, this.checker, this.ngZone, this.document, deferCaptureElements, this.injector)
    }
}
