import { Component, computed, inject, input, signal, TemplateRef, viewChild } from '@angular/core'
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbStepperComponent } from './stepper.component'
import { NB_STEPPER } from './stepper-tokens'

/**
 * A step of an `nb-stepper`: its label in the header, and its content, shown while it's selected.
 */
@Component({
    selector: 'nb-step',
    templateUrl: './step.component.html'
})
export class NbStepComponent {
    protected readonly stepper: NbStepperComponent = inject(NB_STEPPER)

    /** The step's content, which the stepper renders while the step is selected. */
    readonly content = viewChild.required(TemplateRef)

    /**
     * A form or control the step is completed by: the step counts as completed only while it's valid, and the
     * stepper's `reset` resets it.
     */
    readonly stepControl = input<{ valid: boolean | null, reset: () => void }>()

    /** The label in the header: text, or a template. */
    readonly label = input<string | TemplateRef<unknown>>()

    /** Leaves the step out: it isn't shown or numbered, and `next` and `previous` skip it. */
    readonly hidden = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    readonly isLabelTemplate = computed(() => this.label() instanceof TemplateRef)

    /** Marks the step as completed, whether or not it was visited or its `stepControl` is valid. */
    readonly completed = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Whether the step was visited and left. */
    readonly interacted = signal(false)

    /**
     * Whether the step is completed: marked `completed`, or visited with a valid step control. It reads the control's
     * validity, so it isn't a signal.
     */
    get isCompleted(): boolean {
        const stepControl = this.stepControl()
        const done = stepControl ? stepControl.valid && this.interacted() : this.interacted()
        return this.completed() || !!done
    }

    /** Selects the step, if the stepper allows it. */
    select() {
        this.stepper.selectStep(this)
    }

    /** Forgets the visit and resets the `stepControl`. */
    reset() {
        this.interacted.set(false)
        this.stepControl()?.reset()
    }
}
