import { DatePipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCheckboxComponent,
    NbDatepickerDirective,
    NbIconComponent,
    NbInputDirective,
    NbListComponent,
    NbListItemComponent,
    NbOptionComponent,
    NbProgressBarComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbRangepickerComponent,
    NbSelectComponent,
    NbStepComponent,
    NbStepperComponent,
    NbStepperNextDirective,
    NbStepperPreviousDirective,
    NbTagComponent,
    NbToastrService,
    NbCalendarRange
} from '@liquid-js/lyr-core'

import { REQUEST_KINDS, REQUEST_STATUS, RequestKind, REQUESTS, Request, TODAY } from './hub-data'

/** A new request in steps, from what it is to a review, with the user's requests and leave left beside it. */
@Component({
    selector: 'npg-hub-requests',
    templateUrl: './hub-requests.component.html',
    styleUrls: ['./hub-requests.component.scss'],
    imports: [
        DatePipe,
        FormsModule,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCheckboxComponent,
        NbDatepickerDirective,
        NbIconComponent,
        NbInputDirective,
        NbListComponent,
        NbListItemComponent,
        NbOptionComponent,
        NbProgressBarComponent,
        NbRadioComponent,
        NbRadioGroupComponent,
        NbRangepickerComponent,
        NbSelectComponent,
        NbStepComponent,
        NbStepperComponent,
        NbStepperNextDirective,
        NbStepperPreviousDirective,
        NbTagComponent
    ]
})
export class HubRequestsComponent {
    private readonly toastr = inject(NbToastrService)

    readonly kinds = REQUEST_KINDS
    readonly status = REQUEST_STATUS
    readonly today = TODAY
    readonly requests = signal<Request[]>(REQUESTS)

    readonly kind = signal<RequestKind>('leave')
    readonly range = signal<NbCalendarRange<Date> | undefined>(undefined)
    readonly halfDay = signal(false)
    readonly reason = signal('holiday')
    readonly note = signal('')
    readonly coverName = signal('Emma Brown')

    readonly kindTitle = computed(() => this.kinds.find((kind) => kind.value === this.kind())?.title ?? '')

    /** The working days the range covers, half of one if it's a half day. */
    readonly days = computed(() => {
        const range = this.range()
        if (!range?.start || !range.end) {
            return 0
        }
        let days = 0
        for (let day = new Date(range.start); day <= range.end; day.setDate(day.getDate() + 1)) {
            if (day.getDay() % 6 !== 0) {
                days++
            }
        }
        return this.halfDay() ? Math.max(0.5, days - 0.5) : days
    })

    readonly reasons = [
        { value: 'holiday', title: 'Holiday' },
        { value: 'sick', title: 'Sick leave' },
        { value: 'family', title: 'Family or care' },
        { value: 'other', title: 'Something else' }
    ]

    submit() {
        const range = this.range()
        const title = range?.start
            ? `${this.kindTitle()}, ${range.start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}${range.end ? ` to ${range.end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ''}`
            : this.kindTitle()
        this.requests.update((requests) => [{ kind: this.kind(), title, detail: `${this.days()} days`, status: 'pending' }, ...requests])
        this.toastr.success('Sophie Taylor will review it within two working days.', 'Request sent')
    }
}
