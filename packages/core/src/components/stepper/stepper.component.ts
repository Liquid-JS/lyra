import {
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    computed,
    effect,
    input,
    model,
    output,
    TemplateRef,
    untracked
} from '@angular/core'
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NgTemplateOutlet } from '@angular/common'
import { NB_STEPPER } from './stepper-tokens'
import { NbStepComponent } from './step.component'

export type NbStepperOrientation = 'vertical' | 'horizontal'

export interface NbStepChangeEvent {
    index: number
    step: NbStepComponent
    previouslySelectedIndex: number
    previouslySelectedStep: NbStepComponent
}

/**
 * Steps through a process one `nb-step` at a time: numbered labels in a header, with the selected step's content
 * under them.
 *
 * @stacked-example(Showcase, stepper/stepper-showcase.component)
 *
 * ### Installation
 *
 * Import `NbStepperComponent`, `NbStepComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbStepperComponent, NbStepComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbStepperModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbStepperModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * A step's `label` is text, or a template for anything else:
 * ```html
 * <nb-stepper orientation="horizontal">
 *   <nb-step label="Step one">
 *     ...
 *   </nb-step>
 *   <nb-step [label]="stepLabel">
 *     <ng-template #stepLabel>
 *       <div>Step two</div>
 *     </ng-template>
 *     ...
 *   </nb-step>
 * </nb-stepper>
 * ```
 *
 * The stepper is `linear` by default: a step can be reached only once the steps before it are completed, so the
 * user can go back, but forward only one step at a time. A step is completed once the user has left it, or when
 * it's marked `completed`; `linear="false"` lets the user pick any step.
 * @stacked-example(Linear, stepper/stepper-linear.component)
 *
 * With a form as a step's `stepControl`, the step is completed only while the form is valid, so a linear stepper
 * moves on only when it is:
 * ```html
 * <nb-stepper orientation="horizontal">
 *   <nb-step label="Step one" [stepControl]="form">
 *     <form [formGroup]="form">
 *       ...
 *     </form>
 *   </nb-step>
 *   ...
 * </nb-stepper>
 * ```
 * @stacked-example(Validation, stepper/stepper-validation.component)
 *
 * The steps run across (`horizontal`, the default) or down (`vertical`):
 * @stacked-example(Vertical, stepper/stepper-vertical.component)
 *
 * The steps in the header are buttons: a click, Enter or Space selects one. `disableStepNavigation` turns that off,
 * so the user moves only with `nbStepperPrevious` and `nbStepperNext` buttons.
 * @stacked-example(Disabled steps navigation, stepper/stepper-disabled-step-nav.component)
 *
 * Once the user is through, e.g. after a booking, `finished` shows every step completed and none current:
 * ```html
 * <nb-stepper [finished]="booked()">…</nb-stepper>
 * ```
 *
 * On a narrow screen, up to 576 px wide, a horizontal stepper shows only the current step's label, under the steps'
 * indexes, so any number of steps fits across a phone; the other labels are still there for assistive technologies.
 * `compact="false"` keeps every label, for a few short ones:
 * ```html
 * <nb-stepper compact="false">…</nb-stepper>
 * ```
 *
 * `stepChange` emits an `NbStepChangeEvent` with the step selected and the one left:
 * @stacked-example(Step change event, stepper/stepper-step-change-event.component)
 * @styles
 *
 * stepper-step-text-color:
 * stepper-step-text-font-family:
 * stepper-step-text-font-size:
 * stepper-step-text-font-weight:
 * stepper-step-text-line-height:
 * stepper-step-active-text-color:
 * stepper-step-completed-text-color:
 * stepper-step-index-border-color:
 * stepper-step-index-border-style:
 * stepper-step-index-border-width:
 * stepper-step-index-border-radius:
 * stepper-step-index-width:
 * stepper-step-index-active-border-color:
 * stepper-step-index-completed-background-color:
 * stepper-step-index-completed-border-color:
 * stepper-step-index-completed-text-color:
 * stepper-connector-background-color:
 * stepper-connector-completed-background-color:
 * stepper-horizontal-connector-margin:
 * stepper-vertical-connector-margin:
 * stepper-vertical-connector-length:
 * stepper-step-content-padding:
 * stepper-step-content-small-padding:
 * stepper-step-outline-width:
 * stepper-step-outline-color:
 */
@Component({
    selector: 'nb-stepper',
    styleUrls: ['./stepper.component.scss'],
    templateUrl: './stepper.component.html',
    providers: [{ provide: NB_STEPPER, useExisting: NbStepperComponent }],
    // A step's completed state reads its form control's validity, which no signal tracks.
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NbIconComponent, NgTemplateOutlet],
    host: {
        '[class.vertical]': "orientation() === 'vertical'",
        '[class.horizontal]': "orientation() === 'horizontal'",
        '[class.compact]': 'compact()'
    }
})
export class NbStepperComponent {
    /**
     * Selected step index. It supports two-way binding; a change from outside is applied like a step selection, so
     * a linear stepper reverts to the current step when the steps before the new one aren't completed.
     */
    readonly selectedIndex = model(0)

    /** The steps in the header can't be picked; the user moves with `nbStepperPrevious` and `nbStepperNext` buttons. */
    readonly disableStepNavigation = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Across (`horizontal`, the default) or down. */
    readonly orientation = input<NbStepperOrientation>('horizontal')

    /** A step can be reached only once the steps before it are completed; on by default. */
    readonly linear = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * On a narrow screen, up to 576 px wide, shows the current step's label alone, under the steps' indexes, so any
     * number of steps fits across a phone; on by default. Off, a horizontal stepper keeps every label there, for a few
     * short ones.
     */
    readonly compact = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /** Shows every step completed and none current, once the user is through them. */
    readonly finished = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Emits after another step is selected, or the stepper is reset, with the step and the one left. */
    readonly stepChange = output<NbStepChangeEvent>()

    readonly steps = contentChildren(NbStepComponent)

    readonly selected = computed<NbStepComponent | undefined>(() => this.steps()[this.selectedIndex()])
    /**
     * The selected step as a list, so its content is a view of its own, entering as the step is selected: tracked by its
     * index, which tells Angular a new step's content replaces the last one's on purpose.
     */
    protected readonly selectedSteps = computed(() => {
        const selected = this.selected()
        return selected ? [{ step: selected, index: this.selectedIndex() }] : []
    })

    // The index the stepper last reported with `stepChange`; undefined until the steps render.
    protected appliedIndex?: number

    constructor() {
        effect(() => {
            const index = this.selectedIndex()
            const steps = this.steps()
            untracked(() => {
                if (!steps.length) {
                    return
                }
                if (this.appliedIndex === undefined) {
                    // The initial index is taken as it is.
                    this.appliedIndex = index
                } else if (index !== this.appliedIndex) {
                    this.selectIndex(index)
                }
            })
        })
    }

    /**
     * Selects the step at the index, if the stepper allows it, and emits `stepChange`. Leaving the current step marks
     * it as visited, whether or not the move goes through.
     */
    selectIndex(index: number) {
        const steps = this.steps()
        const previouslySelectedIndex = this.appliedIndex ?? this.selectedIndex()
        const previouslySelectedStep = steps[previouslySelectedIndex]
        previouslySelectedStep?.interacted.set(true)

        if (!this.canBeSelected(index, previouslySelectedIndex)) {
            // A rejected change from outside goes back to the current step.
            this.selectedIndex.set(previouslySelectedIndex)
            return
        }

        this.appliedIndex = index
        this.selectedIndex.set(index)
        this.stepChange.emit({
            index,
            step: steps[index],
            previouslySelectedIndex,
            previouslySelectedStep
        })
    }

    /** Selects the step, if the stepper allows it. */
    selectStep(step: NbStepComponent) {
        this.selectIndex(this.steps().indexOf(step))
    }

    /** Selects the next step that isn't hidden, if the stepper allows it. */
    next() {
        const index = this.steps().findIndex((step, i) => i > this.selectedIndex() && !step.hidden())
        if (index !== -1) {
            this.selectIndex(index)
        }
    }

    /** Selects the previous step that isn't hidden. */
    previous() {
        const steps = this.steps()
        for (let i = this.selectedIndex() - 1; i >= 0; i--) {
            if (!steps[i].hidden()) {
                this.selectIndex(i)
                return
            }
        }
    }

    /** Selects a step the user picked in the header, unless `disableStepNavigation`. */
    changeStep(step: NbStepComponent) {
        if (!this.disableStepNavigation()) {
            step.select()
        }
    }

    /** Goes back to the first step and resets every step and its `stepControl`; emits `stepChange`. */
    reset() {
        const steps = this.steps()
        const previouslySelectedIndex = this.selectedIndex()
        const previouslySelectedStep = steps[previouslySelectedIndex]

        this.appliedIndex = 0
        this.selectedIndex.set(0)
        steps.forEach((step) => step.reset())

        this.stepChange.emit({
            index: 0,
            step: steps[0],
            previouslySelectedIndex,
            previouslySelectedStep
        })
    }

    isStepSelected(step: NbStepComponent) {
        return !this.finished() && this.selected() === step
    }

    /** @docs-private Whether the step shows as completed: done, or the stepper `finished`. */
    isStepDone(step: NbStepComponent) {
        return !this.isStepSelected(step) && (this.finished() || step.isCompleted)
    }

    /** @docs-private The number shown for the step at the index: hidden steps aren't counted. */
    getStepNumber(index: number): number {
        return this.steps().filter((step, i) => i <= index && !step.hidden()).length
    }

    /** @docs-private */
    hasVisibleStepBefore(index: number): boolean {
        return this.steps().some((step, i) => i < index && !step.hidden())
    }

    /** @docs-private */
    getStepTemplate(step: NbStepComponent): TemplateRef<unknown> | undefined {
        const label = step.label()
        return label instanceof TemplateRef ? label : undefined
    }

    protected isStepValid(index: number): boolean {
        return this.steps()[index].isCompleted
    }

    protected canBeSelected(indexToCheck: number, currentIndex: number): boolean {
        const steps = this.steps()
        if (!steps.length || indexToCheck < 0 || indexToCheck >= steps.length || indexToCheck === currentIndex) {
            return false
        }

        if (indexToCheck <= currentIndex || !this.linear()) {
            return true
        }

        for (let i = currentIndex; i < indexToCheck; i++) {
            // A hidden step can't be completed, so it doesn't block the steps after it.
            if (!steps[i].hidden() && !this.isStepValid(i)) {
                return false
            }
        }
        return true
    }
}
