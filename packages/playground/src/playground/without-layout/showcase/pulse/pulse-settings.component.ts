import { Component, signal } from '@angular/core'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbOptionComponent,
    NbSelectComponent,
    NbSliderComponent,
    NbToggleComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { portrait } from '../shared/showcase-images'

/** The person's profile, their goals, what the app reminds them of, and the units it counts in. */
@Component({
    selector: 'npg-pulse-settings',
    templateUrl: './pulse-settings.component.html',
    styleUrls: ['./pulse-screen.scss', './pulse-settings.component.scss'],
    imports: [
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbIconComponent,
        NbOptionComponent,
        NbSelectComponent,
        NbSliderComponent,
        NbToggleComponent,
        NbUserComponent
    ]
})
export class PulseSettingsComponent {
    readonly photo = portrait('Jane Doe')
    readonly steps = signal<number | null>(10000)
    readonly sleep = signal<number | null>(8)
    readonly move = signal<number | null>(600)
    readonly units = signal('metric')
    readonly reminders = [
        { id: 'move', title: 'Move reminders', detail: 'A nudge when you have sat for an hour', on: true },
        { id: 'bedtime', title: 'Bedtime', detail: 'Wind down at 22:00', on: true },
        { id: 'haptics', title: 'Haptics', detail: 'A tap as a ring closes', on: false },
        { id: 'share', title: 'Share activity', detail: 'Friends see your rings', on: false }
    ]

    readonly formatSteps = (value: number) => `${(value / 1000).toFixed(value % 1000 ? 1 : 0)}k`
    readonly formatHours = (value: number) => `${value} h`
    readonly formatCalories = (value: number) => `${value}`
}
