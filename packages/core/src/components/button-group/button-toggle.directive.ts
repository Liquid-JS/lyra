import { Directive, inject, input, linkedSignal, output } from '@angular/core'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, type NbButtonAppearance, type NbButtonToggleAppearance } from '@liquid-js/lyr-core/base'
import { NbButton } from '../button/base-button'
import { NB_BUTTON_GROUP } from './button-group-injection-tokens'

const toggleStatuses = ['primary', 'success', 'info', 'warning', 'danger', 'control']

/**
 * A button with a pressed state, `aria-pressed` for assistive technologies. It's `basic` until pressed, then in its
 * status, or `primary` for a `basic` one. In an `nb-button-group` without `multiple` a click doesn't unpress it, as
 * with radio buttons.
 */
@Directive({
    selector: 'button[nbButtonToggle]',
    providers: [{ provide: NbButton, useExisting: NbButtonToggleDirective }],
    exportAs: 'nbButtonToggle',
    host: {
        '[attr.aria-pressed]': 'isPressed()',
        '(click)': 'onClick()'
    }
})
export class NbButtonToggleDirective<T = unknown> extends NbButton<NbButtonToggleAppearance> {
    protected readonly buttonGroup = inject(NB_BUTTON_GROUP, { optional: true })

    /** The buttons' default appearance, but `filled` for `hero`, which toggles don't have. */
    protected override defaultAppearance(appearance?: NbButtonAppearance): NbButtonToggleAppearance {
        return appearance && appearance !== 'hero' ? appearance : 'filled'
    }

    /**
     * Value the button group emits in `valueChange` while the toggle is pressed.
     */
    readonly value = input<T>()

    /**
     * Whether the button is pressed. Supports two-way binding with `[(pressed)]`.
     */
    readonly pressed = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Emits when a click or the button group changes the pressed state.
     */
    readonly pressedChange = output<boolean>()

    /**
     * The current pressed state: the `pressed` input, until a click or the button group changes it.
     */
    readonly isPressed = linkedSignal(() => this.pressed())

    protected override statusClasses() {
        const status = this.properties().status
        // A toggle is `basic` until pressed, and a `basic` one is `primary` when pressed.
        const pressedStatus = status === 'basic' ? 'primary' : status
        return [
            !this.isPressed() ? 'status-basic' : toggleStatuses.includes(pressedStatus) ? `status-${pressedStatus}` : undefined,
            // `success` isn't one of the status service's core statuses, so check the toggle's own list first.
            !toggleStatuses.includes(status) && this.statusService.isCustomStatus(status)
                ? this.statusService.getStatusClass(status)
                : undefined
        ]
    }

    onClick() {
    // In a group without `multiple` a click doesn't unpress the toggle, as with radio buttons.
        if (this.buttonGroup?.multiple() || !this.isPressed()) {
            this.setPressed(!this.isPressed())
        }
    }

    /**
     * Sets the pressed state and emits `pressedChange` when it changes.
     */
    setPressed(pressed: boolean) {
        if (this.isPressed() !== pressed) {
            this.isPressed.set(pressed)
            this.pressedChange.emit(pressed)
        }
    }
}
