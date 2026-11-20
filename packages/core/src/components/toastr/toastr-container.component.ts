import { AnimationCallbackEvent, Component, computed, inject, input, viewChildren } from '@angular/core'

import { NbLayoutDirectionService } from '@liquid-js/lyr-core/base'
import { NbGlobalPosition, NbPositionHelper } from '@liquid-js/lyr-core/cdk'
import { NbToastComponent } from './toast.component'
import { NbToast } from './model'

const SLIDE_DURATION = 100

@Component({
    selector: 'nb-toastr-container',
    template: `@for (toast of content(); track toast) {
    <nb-toast [toast]="toast" (animate.enter)="slideIn($event)" (animate.leave)="slideOut($event)" />
  }`,
    imports: [NbToastComponent]
})
export class NbToastrContainerComponent {
    protected readonly layoutDirection = inject(NbLayoutDirectionService)
    protected readonly positionHelper = inject(NbPositionHelper)

    readonly content = input<NbToast[]>([])

    readonly context = input<object>()

    readonly position = input.required<NbGlobalPosition>()

    readonly toasts = viewChildren(NbToastComponent)

    // Toasts slide in from the side of the screen they're on, which depends on the layout direction.
    readonly slideDirection = computed(() => {
        this.layoutDirection.direction()
        return this.positionHelper.isRightPosition(this.position()) ? '' : '-'
    })

    // A toast slides in while its height and margins open, and out while they close, so the others move smoothly.
    protected slideIn(event: AnimationCallbackEvent) {
        this.slide(event, false)
    }

    protected slideOut(event: AnimationCallbackEvent) {
        this.slide(event, true)
    }

    private slide(event: AnimationCallbackEvent, leaving: boolean) {
        const toast = event.target as HTMLElement
        if (typeof toast.animate !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
            event.animationComplete()
            return
        }

        const style = getComputedStyle(toast)
        const shown: Keyframe = {
            transform: 'none',
            height: style.height,
            marginTop: style.marginTop,
            marginRight: style.marginRight,
            marginBottom: style.marginBottom,
            marginLeft: style.marginLeft
        }
        const hidden: Keyframe = {
            transform: `translateX(${this.slideDirection()}110%)`,
            height: '0',
            marginTop: '0',
            marginRight: '0',
            marginBottom: '0',
            marginLeft: '0'
        }
        const animation = toast.animate(leaving ? [shown, hidden] : [hidden, shown], {
            duration: SLIDE_DURATION,
            // A leaving toast stays hidden until it's removed.
            fill: leaving ? 'forwards' : 'none'
        })
        animation.finished.then(() => event.animationComplete(), () => event.animationComplete())
    }
}
