import { NbComponentStatus } from '@liquid-js/lyr-core'

/** One of the day's goals, as a ring: what's done of it, and in what. */
export interface PulseRing {
    id: 'move' | 'exercise' | 'sleep'
    label: string
    value: number
    goal: number
    unit: string
    status: NbComponentStatus
}

/** A day of the week, and how much of its move goal was done. */
export interface PulseDay {
    short: string
    date: number
    done: number
    today?: boolean
}

/** Something planned for today, with what the sheet says about it. */
export interface PulsePlanItem {
    id: string
    title: string
    time: string
    duration: string
    icon: string
    status: NbComponentStatus
    done?: boolean
    description: string
    details: Array<{ label: string, value: string }>
}

/** An exercise in a session. */
export interface PulseExercise {
    title: string
    detail: string
    done: boolean
}

/** A figure over a period, and how it changed. */
export interface PulseStat {
    label: string
    value: string
    unit: string
    change: number
    icon: string
    status: NbComponentStatus
}

/** A period's trends: its stats, and the data behind its charts. */
export interface PulsePeriod {
    stats: PulseStat[]
    stepLabels: string[]
    steps: number[]
    heartRateLabels: string[]
    heartRate: number[]
}

export const PULSE_RINGS: PulseRing[] = [
    { id: 'move', label: 'Move', value: 486, goal: 600, unit: 'kcal', status: 'primary' },
    { id: 'exercise', label: 'Exercise', value: 38, goal: 45, unit: 'min', status: 'info' },
    { id: 'sleep', label: 'Sleep', value: 7.2, goal: 8, unit: 'h', status: 'success' }
]

export const PULSE_WEEK: PulseDay[] = [
    { short: 'M', date: 9, done: 100 },
    { short: 'T', date: 10, done: 72 },
    { short: 'W', date: 11, done: 100 },
    { short: 'T', date: 12, done: 81, today: true },
    { short: 'F', date: 13, done: 0 },
    { short: 'S', date: 14, done: 0 },
    { short: 'S', date: 15, done: 0 }
]

export const PULSE_PLAN: PulsePlanItem[] = [
    {
        id: 'walk',
        title: 'Morning walk',
        time: '07:30',
        duration: '30 min',
        icon: 'sun-outline',
        status: 'warning',
        done: true,
        description: 'An easy loop through the park before work. Done at a steady pace, with the heart rate in zone 2.',
        details: [
            { label: 'Distance', value: '2.6 km' },
            { label: 'Average pace', value: "11'32\" /km" },
            { label: 'Average heart rate', value: '112 bpm' }
        ]
    },
    {
        id: 'strength',
        title: 'Strength: lower body',
        time: '18:00',
        duration: '40 min',
        icon: 'flash-outline',
        status: 'primary',
        description:
            'Week 3 of the strength plan: squats, lunges and deadlifts, three sets each, then a short core finisher.',
        details: [
            { label: 'Exercises', value: '6' },
            { label: 'Sets', value: '3 × 10' },
            { label: 'Rest between sets', value: '90 s' }
        ]
    },
    {
        id: 'mobility',
        title: 'Evening mobility',
        time: '21:00',
        duration: '12 min',
        icon: 'moon-outline',
        status: 'info',
        description: 'A short routine for the hips and back, to wind down before bed and keep tomorrow’s run comfortable.',
        details: [
            { label: 'Moves', value: '8' },
            { label: 'Hold each', value: '45 s' },
            { label: 'Best before', value: 'Sleep at 22:30' }
        ]
    }
]

export const PULSE_EXERCISES: PulseExercise[] = [
    { title: 'Warm-up', detail: '5 min easy bike', done: true },
    { title: 'Goblet squats', detail: '3 × 10 · 20 kg', done: true },
    { title: 'Walking lunges', detail: '3 × 12 each side', done: false },
    { title: 'Romanian deadlifts', detail: '3 × 10 · 40 kg', done: false },
    { title: 'Hip thrusts', detail: '3 × 12 · 50 kg', done: false },
    { title: 'Plank', detail: '3 × 45 s', done: false }
]

export const PULSE_PERIODS: Record<'week' | 'month', PulsePeriod> = {
    week: {
        stats: [
            { label: 'Steps a day', value: '9,840', unit: '', change: 6.2, icon: 'navigation-2-outline', status: 'primary' },
            { label: 'Resting heart rate', value: '58', unit: 'bpm', change: -2.4, icon: 'heart-outline', status: 'danger' },
            { label: 'Sleep', value: '7h 12m', unit: '', change: 3.1, icon: 'moon-outline', status: 'info' },
            { label: 'Active minutes', value: '241', unit: '', change: -4.8, icon: 'activity-outline', status: 'success' }
        ],
        stepLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        steps: [11240, 8630, 12880, 9120, 7460, 14210, 5300],
        heartRateLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        heartRate: [61, 59, 58, 57, 59, 56, 58]
    },
    month: {
        stats: [
            { label: 'Steps a day', value: '9,120', unit: '', change: 2.8, icon: 'navigation-2-outline', status: 'primary' },
            { label: 'Resting heart rate', value: '59', unit: 'bpm', change: -1.1, icon: 'heart-outline', status: 'danger' },
            { label: 'Sleep', value: '7h 04m', unit: '', change: 1.4, icon: 'moon-outline', status: 'info' },
            { label: 'Active minutes', value: '1,012', unit: '', change: 8.9, icon: 'activity-outline', status: 'success' }
        ],
        stepLabels: ['W1', 'W2', 'W3', 'W4'],
        steps: [62400, 58900, 71200, 68900],
        heartRateLabels: ['W1', 'W2', 'W3', 'W4'],
        heartRate: [61, 60, 58, 58]
    }
}

export const PULSE_BESTS = [
    { title: 'Longest move streak', value: '12 days', when: 'October', icon: 'award-outline' },
    { title: 'Most steps in a day', value: '21,460', when: '2 Nov', icon: 'navigation-2-outline' },
    { title: 'Fastest 5 km', value: '27:14', when: '18 Oct', icon: 'flash-outline' },
    { title: 'Longest sleep', value: '9h 05m', when: '26 Oct', icon: 'moon-outline' }
]
