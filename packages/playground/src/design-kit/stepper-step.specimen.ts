import { afterNextRender, Component, ElementRef, inject } from '@angular/core'
import { NbStepComponent, NbStepperComponent } from '@liquid-js/lyr-core'

import { combinations, kit } from './specimen'

/**
 * The steps of the stepper's specimens, across and down: the first completed, the second current and the third
 * upcoming, tagged once they're shown.
 */
@Component({
    template: `
        <div class="specimens">
            @for (stepper of steppers; track $index) {
            <nb-stepper [attr.data-steps]="stepper.orientation"
                [orientation]="stepper.orientation"
                [selectedIndex]="1"
                [linear]="false"
                style="width: 36rem">
                <nb-step label="Account"
                    [completed]="true">Account details</nb-step>
                <nb-step label="Profile">Profile details</nb-step>
                <nb-step label="Payment">Payment details</nb-step>
                <nb-step label="Confirm">Confirm details</nb-step>
            </nb-stepper>
            }
        </div>
    `,
    imports: [NbStepperComponent, NbStepComponent]
})
export class StepperStepSpecimenComponent {
    readonly steppers = combinations({ orientation: ['horizontal', 'vertical'] as const })

    constructor() {
        const host: HTMLElement = inject(ElementRef).nativeElement
        afterNextRender(() => {
            for (const stepper of Array.from(host.querySelectorAll<HTMLElement>('[data-steps]'))) {
                const orientation = stepper.getAttribute('data-steps')
                const steps = Array.from(stepper.querySelectorAll('.step')).slice(0, 3)
                steps.forEach((step, index) => step.setAttribute('data-kit', kit('stepper-step', { orientation, state: ['completed', 'current', 'upcoming'][index] })))
            }
        })
    }
}
