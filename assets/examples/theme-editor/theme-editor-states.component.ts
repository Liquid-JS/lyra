import { Component, DestroyRef, afterNextRender, inject } from '@angular/core'
import {
    NB_DOCUMENT,
    NbButtonAppearance,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCheckboxComponent,
    NbComponentStatus,
    NbInputDirective,
    NbOptionComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent,
    NbToggleComponent
} from '@liquid-js/lyr-core'

import { FORCED_STATE_CLASSES, forceStates } from './parts/forced-states'

/** A column of the sheet: a state, shown by its class, or disabled. */
interface StateColumn {
    label: string
    className?: string
    disabled?: boolean
}

const DEFAULT: StateColumn = { label: 'Default' }
const HOVER: StateColumn = { label: 'Hover', className: FORCED_STATE_CLASSES.hover }
const FOCUS: StateColumn = { label: 'Focus', className: FORCED_STATE_CLASSES.focus }
const PRESSED: StateColumn = { label: 'Pressed', className: `${FORCED_STATE_CLASSES.hover} ${FORCED_STATE_CLASSES.active}` }
const DISABLED: StateColumn = { label: 'Disabled', disabled: true }

/**
 * Each control in every status and state, side by side: default, hover, focus, pressed and disabled, with the theme's
 * own styles for each, which the docs' theme editor shows its theme on.
 */
@Component({
    templateUrl: './theme-editor-states.component.html',
    styleUrls: ['./theme-editor-states.component.scss'],
    imports: [
        NbButtonComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCheckboxComponent,
        NbInputDirective,
        NbOptionComponent,
        NbRadioComponent,
        NbRadioGroupComponent,
        NbSelectComponent,
        NbToggleComponent
    ]
})
export class ThemeEditorStatesComponent {
    readonly statuses: NbComponentStatus[] = ['basic', 'primary', 'success', 'info', 'warning', 'danger']
    readonly appearances: NbButtonAppearance[] = ['filled', 'outline', 'ghost']
    /** The states of a control that can be pressed. */
    readonly pressable = [DEFAULT, HOVER, FOCUS, PRESSED, DISABLED]
    /** The states of a field. */
    readonly field = [DEFAULT, HOVER, FOCUS, DISABLED]

    constructor() {
        const document = inject(NB_DOCUMENT)
        const destroyRef = inject(DestroyRef)
        // Once the controls render, so their own styles are there to copy.
        afterNextRender(() => destroyRef.onDestroy(forceStates(document)))
    }
}
