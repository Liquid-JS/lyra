import { computed, Directive, effect, inject, input, TemplateRef, untracked, ViewContainerRef } from '@angular/core'
import { ɵbelowBreakpoint as belowBreakpoint } from '@liquid-js/lyr-core/base'

@Directive()
abstract class NbBaseBreakpointDirective {
    protected readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef)
    protected readonly viewContainer = inject(ViewContainerRef)
    protected abstract readonly breakpoint: () => string | undefined
    protected abstract readonly shown: () => boolean
    protected readonly narrow = belowBreakpoint(() => this.breakpoint())

    constructor() {
        effect(() => {
            const shouldShow = this.shown()
            untracked(() => this.updateView(shouldShow))
        })
    }

    protected updateView(shouldShow: boolean) {
        if (shouldShow && !this.viewContainer.length) {
            this.viewContainer.createEmbeddedView(this.templateRef)
        } else if (!shouldShow && this.viewContainer.length) {
            this.viewContainer.clear()
        }
    }
}

/**
 * Shows its content only while the window is narrower than a media breakpoint, e.g. a phone's navigation along the
 * bottom, or the button that opens a phone's drawer:
 *
 * ```html
 * <nb-layout-footer fixed *nbShownBelow="'md'">
 *   <nb-route-tabset [tabs]="sections" outlet="false" appearance="bar" />
 * </nb-layout-footer>
 * ```
 *
 * Until `nb-layout` measures the window, e.g. on the server, the content isn't shown. Import `NbShownBelowDirective`
 * into your standalone component, or `NbLayoutModule`, which has it.
 */
@Directive({ selector: '[nbShownBelow]' })
export class NbShownBelowDirective extends NbBaseBreakpointDirective {
    /** The media breakpoint, e.g. `md`, 768 px wide unless the app sets others (`DEFAULT_MEDIA_BREAKPOINTS`). */
    readonly nbShownBelow = input.required<string>()
    protected readonly breakpoint = () => this.nbShownBelow()
    protected readonly shown = computed(() => this.narrow())
}

/**
 * Shows its content only while the window is as wide as a media breakpoint or wider, e.g. a header's tabs, where a
 * phone has them along the bottom:
 *
 * ```html
 * <nb-route-tabset *nbShownAbove="'md'" [tabs]="sections" outlet="false" />
 * ```
 *
 * Until `nb-layout` measures the window, e.g. on the server, the content is shown. Import `NbShownAboveDirective`
 * into your standalone component, or `NbLayoutModule`, which has it.
 */
@Directive({ selector: '[nbShownAbove]' })
export class NbShownAboveDirective extends NbBaseBreakpointDirective {
    /** The media breakpoint, e.g. `md`, 768 px wide unless the app sets others (`DEFAULT_MEDIA_BREAKPOINTS`). */
    readonly nbShownAbove = input.required<string>()
    protected readonly breakpoint = () => this.nbShownAbove()
    protected readonly shown = computed(() => !this.narrow())
}
