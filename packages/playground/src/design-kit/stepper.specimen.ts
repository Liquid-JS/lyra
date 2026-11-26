import { Component } from '@angular/core'
import { NbStepComponent, NbStepperComponent } from '@liquid-js/lyr-core'

import { combinations, kit } from './specimen'

/** Four steps, the first completed and the second current, across and down. */
@Component({
    template: `
        <div class="specimens">
            @for (stepper of steppers; track $index) {
            <nb-stepper [attr.data-kit]="kit('stepper', stepper)"
                [orientation]="stepper.orientation"
                [selectedIndex]="1"
                [linear]="false"
                style="width: 36rem">
                <nb-step label="Account"
                    [completed]="true">Account details</nb-step>
                <nb-step label="Profile">Profile details</nb-step>
                <nb-step label="Plan">Plan details</nb-step>
                <nb-step label="Confirm">Confirm details</nb-step>
            </nb-stepper>
            }
        </div>
    `,
    imports: [NbStepperComponent, NbStepComponent]
})
export class StepperSpecimenComponent {
    readonly kit = kit
    readonly steppers = combinations({ orientation: ['horizontal', 'vertical'] as const })
}
