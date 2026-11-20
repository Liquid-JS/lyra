import { Component, computed, DestroyRef, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCheckboxComponent,
    NbIconComponent,
    NbProgressBarComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbTagComponent
} from '@liquid-js/lyr-core'

import { LEARN_CHAPTERS, LEARN_QUIZ, LearnQuestion } from './learn-data'

/** How a question went: what the learner picked, and whether it was right. */
interface LearnAnswer {
    picked: number[]
    correct: boolean
}

const TIME_LIMIT = 10 * 60
const PASS_MARK = 0.7

/** A chapter's quiz: one question at a time, checked as it's answered, then the score and a review of each. */
@Component({
    selector: 'npg-learn-quiz',
    templateUrl: './learn-quiz.component.html',
    styleUrls: ['./learn-quiz.component.scss'],
    imports: [
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCheckboxComponent,
        NbIconComponent,
        NbProgressBarComponent,
        NbRadioComponent,
        NbRadioGroupComponent,
        NbTagComponent,
        RouterLink
    ]
})
export class LearnQuizComponent {
    readonly chapter = LEARN_CHAPTERS[0]
    readonly questions = LEARN_QUIZ

    readonly index = signal(0)
    readonly picked = signal(new Set<number>())
    /** The current question has been checked, so its answer shows. */
    readonly revealed = signal(false)
    readonly answers = signal(new Array<LearnAnswer>())
    readonly remaining = signal(TIME_LIMIT)

    readonly question = computed<LearnQuestion>(() => this.questions[this.index()])
    readonly multiple = computed(() => this.question().answers.length > 1)
    readonly finished = computed(() => this.answers().length === this.questions.length)
    readonly correct = computed(() => this.answers().filter((answer) => answer.correct).length)
    readonly score = computed(() => Math.round((this.correct() / this.questions.length) * 100))
    readonly passed = computed(() => this.correct() / this.questions.length >= PASS_MARK)
    readonly progress = computed(() => Math.round((this.answers().length / this.questions.length) * 100))
    /** Whether the picked options are right, once checked. */
    readonly isCorrect = computed(() => same([...this.picked()], this.question().answers))
    readonly clock = computed(() => {
        const seconds = this.remaining()
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
    })

    constructor() {
    // Counts the time down while the quiz is on; the page's own clock, not the quiz's score.
        const timer = setInterval(() => {
            if (!this.finished() && this.remaining() > 0) {
                this.remaining.update((seconds) => seconds - 1)
            }
        }, 1000)
        inject(DestroyRef).onDestroy(() => clearInterval(timer))
    }

    pickOne(option: unknown) {
        if (typeof option === 'number' && !this.revealed()) {
            this.picked.set(new Set([option]))
        }
    }

    toggle(option: number, on: boolean) {
        if (this.revealed()) {
            return
        }
        this.picked.update((picked) => {
            const next = new Set(picked)
            if (on) {
                next.add(option)
            } else {
                next.delete(option)
            }
            return next
        })
    }

    check() {
        if (!this.picked().size) {
            return
        }
        this.revealed.set(true)
    }

    next() {
        const answer = { picked: [...this.picked()].sort((a, b) => a - b), correct: this.isCorrect() }
        this.answers.update((answers) => [...answers, answer])
        this.picked.set(new Set())
        this.revealed.set(false)
        if (this.index() < this.questions.length - 1) {
            this.index.update((index) => index + 1)
        }
    }

    retake() {
        this.index.set(0)
        this.picked.set(new Set())
        this.revealed.set(false)
        this.answers.set([])
        this.remaining.set(TIME_LIMIT)
    }

    /** An option's state once the question is checked: right, picked but wrong, or neither. */
    state(option: number): 'right' | 'wrong' | undefined {
        if (!this.revealed()) {
            return undefined
        }
        if (this.question().answers.includes(option)) {
            return 'right'
        }
        return this.picked().has(option) ? 'wrong' : undefined
    }

    pickedText(answer: LearnAnswer, question: LearnQuestion): string {
        return answer.picked.map((option) => question.options[option]).join(', ')
    }
}

// Two sets of options as arrays, in any order.
function same(a: number[], b: number[]): boolean {
    const sortedB = [...b].sort((x, y) => x - y)
    return a.length === b.length && [...a].sort((x, y) => x - y).every((value, i) => value === sortedB[i])
}
