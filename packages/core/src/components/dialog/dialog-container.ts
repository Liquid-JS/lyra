import {
    afterNextRender,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    ElementRef,
    EmbeddedViewRef,
    inject,
    Injector,
    OnDestroy,
    OnInit,
    viewChild
} from '@angular/core'

import { NbComponentPortal, NbPortalOutletDirective, NbTemplatePortal, NbFocusTrap, NbFocusTrapFactoryService } from '@liquid-js/lyr-core/cdk'
import { NbDialogConfig } from './dialog-config'

/**
 * The element a dialog's content renders in: it carries the dialog's role and ARIA attributes, and traps and
 * restores the focus with `autoFocus`.
 */
@Component({
    selector: 'nb-dialog-container',
    template: '<ng-template nbPortalOutlet />',
    // The overlay pane is capped to the viewport; dialogs taller or wider than it scroll instead of overflowing it.
    // A sheet spans the screen up to 36rem, its content flush with the bottom and clear of a phone's home bar.
    styles: `
        :host { display: block; max-width: 100%; max-height: 100%; overflow: auto; overscroll-behavior: contain; }
        :host(.sheet) { width: 100vw; max-width: 36rem; }
        :host(.sheet) ::ng-deep > * {
            margin: 0;
            border-end-start-radius: 0;
            border-end-end-radius: 0;
            padding-bottom: env(safe-area-inset-bottom, 0);
        }
    `,
    host: {
        '[class.sheet]': 'config.sheet',
        // Without a backdrop the page stays usable, so the dialog isn't modal.
        '[attr.aria-modal]': 'config.hasBackdrop',
        '[attr.role]': 'config.role',
        '[attr.aria-labelledby]': 'config.ariaLabelledBy',
        '[attr.aria-describedby]': 'config.ariaDescribedBy'
    },
    // Hosted content may not use signals, so it's checked on every change detection.
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NbPortalOutletDirective]
})
export class NbDialogContainerComponent implements OnInit, OnDestroy {
    protected readonly config = inject(NbDialogConfig)
    protected readonly elementRef = inject(ElementRef)
    protected readonly focusTrapFactory = inject(NbFocusTrapFactoryService)
    protected readonly injector = inject(Injector)
    protected readonly changeDetectorRef = inject(ChangeDetectorRef)

    readonly portalOutlet = viewChild.required(NbPortalOutletDirective)

    protected focusTrap?: NbFocusTrap

    ngOnInit() {
        if (this.config.autoFocus) {
            const focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement)
            this.focusTrap = focusTrap
            focusTrap.blurPreviouslyFocusedElement()
            // The dialog's content is attached after the container starts, and renders with the next change detection, so
            // its first focusable element is there to take focus only once that has run.
            afterNextRender(() => focusTrap.focusInitialElement(), { injector: this.injector })
        }
    }

    ngOnDestroy() {
        if (this.config.autoFocus && this.focusTrap) {
            this.focusTrap.restoreFocus()
        }
    }

    attachComponentPortal<T>(portal: NbComponentPortal<T>): ComponentRef<T> {
        return this.portalOutlet().attachComponentPortal(portal)
    }

    attachTemplatePortal<C>(portal: NbTemplatePortal<C>): EmbeddedViewRef<C> {
        return this.portalOutlet().attachTemplatePortal(portal)
    }

    /**
     * Renders the dialog and its attached content now.
     */
    detectChanges() {
        this.changeDetectorRef.detectChanges()
    }
}
