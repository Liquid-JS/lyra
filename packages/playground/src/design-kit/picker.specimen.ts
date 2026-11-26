import { Component } from '@angular/core'
import {
    NbDatepickerDirective,
    NbDatepickerComponent,
    NbDateService,
    NbDateTimePickerComponent,
    NbInputDirective,
    NbRangepickerComponent,
    NbTimePickerComponent,
    NbTimePickerDirective
} from '@liquid-js/lyr-core'

import { FixedTodayDateService, kit } from './specimen'

/** The pickers open, as the capture opens them through their inputs, in March 2026 with the 18th as today. */
@Component({
    template: `
        <div class="specimens">
            @for (picker of pickers; track $index) {
            <div [attr.data-kit]="kit('picker', picker)"
                data-kit-open="input">
                @switch (picker.kind) {
                @case ('date') {
                <input nbInput
                    placeholder="Pick a date"
                    [nbDatepicker]="date" />
                <nb-datepicker #date />
                }
                @case ('range') {
                <input nbInput
                    placeholder="Pick dates"
                    [nbDatepicker]="range" />
                <nb-rangepicker #range />
                }
                @case ('date-time') {
                <input nbInput
                    placeholder="Pick a date and time"
                    [nbDatepicker]="dateTime" />
                <nb-date-timepicker #dateTime />
                }
                @case ('time') {
                <input nbInput
                    placeholder="Pick a time"
                    [nbTimepicker]="time" />
                <nb-timepicker #time />
                }
                }
            </div>
            }
        </div>
    `,
    providers: [{ provide: NbDateService, useClass: FixedTodayDateService }],
    imports: [
        NbInputDirective,
        NbDatepickerDirective,
        NbDatepickerComponent,
        NbRangepickerComponent,
        NbDateTimePickerComponent,
        NbTimePickerDirective,
        NbTimePickerComponent
    ]
})
export class PickerSpecimenComponent {
    readonly kit = kit
    readonly pickers = [{ kind: 'date' }, { kind: 'range' }, { kind: 'date-time' }, { kind: 'time' }] as const
}
