import { Directive, effect, inject, TemplateRef, untracked, ViewContainerRef } from '@angular/core'
import { NbLayoutDirection, NbLayoutDirectionService } from '@liquid-js/lyr-core/base'

@Directive()
abstract class NbBaseLayoutDirectionDirective {
    protected readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef)
    protected readonly viewContainer = inject(ViewContainerRef)
    protected readonly directionService = inject(NbLayoutDirectionService)
    protected abstract directionToShow: NbLayoutDirection

    constructor() {
        effect(() => {
            const shouldShow = this.directionService.direction() === this.directionToShow
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
 * Shows its content only while the layout's direction is left to right; see `NbLayoutDirectionService`.
 *
 * ```html
 * <div *nbLtr>Shown in a left to right page</div>
 * ```
 */
@Directive({ selector: '[nbLtr]' })
export class NbLtrDirective extends NbBaseLayoutDirectionDirective {
    protected directionToShow = NbLayoutDirection.LTR
}

/**
 * Shows its content only while the layout's direction is right to left; see `NbLayoutDirectionService`.
 *
 * ```html
 * <div *nbRtl>Shown in a right to left page</div>
 * ```
 */
@Directive({ selector: '[nbRtl]' })
export class NbRtlDirective extends NbBaseLayoutDirectionDirective {
    protected directionToShow = NbLayoutDirection.RTL
}
