import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCheckboxComponent,
    NbIconComponent,
    NbSliderComponent,
    NbTagComponent
} from '@liquid-js/lyr-core'

import { PULSE_EXERCISES, PulseExercise } from './pulse-data'

/** A session under way: the time so far, the heart rate, the exercises to tick off, and how hard it feels. */
@Component({
    selector: 'npg-pulse-workout',
    templateUrl: './pulse-workout.component.html',
    styleUrls: ['./pulse-screen.scss', './pulse-workout.component.scss'],
    imports: [
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCheckboxComponent,
        NbIconComponent,
        NbSliderComponent,
        NbTagComponent,
        RouterLink
    ]
})
export class PulseWorkoutComponent {
    /** Seconds since the session started; it was under way before the screen opened. */
    readonly elapsed = signal(12 * 60 + 34)
    readonly running = signal(true)
    readonly heartRate = signal(142)
    readonly intensity = signal<number | null>(7)
    readonly exercises = signal<PulseExercise[]>(PULSE_EXERCISES.map((exercise) => ({ ...exercise })))

    /** The time so far, as m:ss or h:mm:ss. */
    readonly time = computed(() => {
        const total = this.elapsed()
        const hours = Math.floor(total / 3600)
        const minutes = Math.floor((total % 3600) / 60)
        const seconds = total % 60
        const pad = (value: number) => String(value).padStart(2, '0')
        return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`
    })
    readonly doneCount = computed(() => this.exercises().filter((exercise) => exercise.done).length)
    /** The first exercise not done yet: the one under way. */
    readonly current = computed(() => this.exercises().findIndex((exercise) => !exercise.done))
    /** The one after it. */
    readonly next = computed(() => this.exercises()[this.current() + 1])
    readonly calories = computed(() => Math.round(this.elapsed() * 0.14))

    constructor() {
        const destroyRef = inject(DestroyRef)
        // The clock runs in the browser only, and the heart rate drifts a little, as a sensor's would.
        afterNextRender(() => {
            const timer = setInterval(() => {
                if (this.running()) {
                    this.elapsed.update((value) => value + 1)
                    if (this.elapsed() % 3 === 0) {
                        this.heartRate.update((value) => Math.max(128, Math.min(158, value + Math.round(Math.random() * 4 - 2))))
                    }
                }
            }, 1000)
            destroyRef.onDestroy(() => clearInterval(timer))
        })
    }

    toggle(index: number, done: boolean) {
        this.exercises.update((exercises) =>
            exercises.map((exercise, i) => (i === index ? { ...exercise, done } : exercise))
        )
    }

    pause() {
        this.running.update((running) => !running)
    }
}
