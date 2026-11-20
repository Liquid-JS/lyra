import { Component, computed, effect, input } from '@angular/core'

import { NbValidationDirective } from './validation.directive'

let lastLabelId = 0

/** Elements a `<label for>` labels, and focuses when it's clicked. */
const LABELABLE = 'input, select, textarea, button, meter, output, progress'

/**
 * Labels a control with `nbValidation`, styled as Lyra's labels, and marks it when it's required:
 *
 * ```html
 * <label nbLabel [for]="email">Email</label>
 * <input nbInput formControlName="email" nbValidation #email="nbValidation" />
 * <nb-validation-errors [for]="email" />
 * ```
 *
 * It labels a native field with `for`, giving the field an id when it has none, and a control whose field is inside
 * it, such as `nb-select`, with `aria-labelledby`; clicking the label focuses the field either way. A required
 * control, in any kind of form, gets a `*` after the label, which assistive technologies skip, as the field is
 * `aria-required`.
 *
 * @styles
 *
 * label-required-text-color:
 */
@Component({
    selector: 'label[nbLabel]',
    template: '<ng-content />@if (target().required()) {<span class="label-required" aria-hidden="true">*</span>}',
    host: {
        'class': 'label',
        '[id]': 'id',
        '[attr.for]': 'fieldId()',
        '(click)': 'onClick($event)'
    }
})
export class NbLabelComponent {
    protected readonly id = `nb-label-${lastLabelId++}`

    /** The control it labels: its `nbValidation` directive. */
    readonly target = input.required<NbValidationDirective>({ alias: 'for' })

    /** Whether `for` labels the control: a native field. */
    protected readonly labelable = computed(() => this.target().element.matches(LABELABLE))

    protected readonly fieldId = computed(() => {
        if (!this.labelable()) {
            return null
        }
        const element = this.target().element
        element.id ||= `${this.id}-field`
        return element.id
    })

    constructor() {
        effect((onCleanup) => {
            const target = this.target()
            if (!this.labelable()) {
                target.addLabel(this.id)
                onCleanup(() => target.removeLabel(this.id))
            }
        })
    }

    /** @internal */
    onClick(event: MouseEvent) {
    // A native field gets focus from `for`; another control from its own field.
        if (!this.labelable()) {
            event.preventDefault()
            this.target().focus()
        }
    }
}
