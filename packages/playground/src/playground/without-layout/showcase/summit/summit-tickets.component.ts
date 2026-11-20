import { CurrencyPipe } from '@angular/common'
import { Component, computed, effect, inject, signal, untracked } from '@angular/core'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbInputDirective,
    NbStepComponent,
    NbStepperComponent,
    NbStepperNextDirective,
    NbStepperPreviousDirective,
    NbTagComponent,
    NbToastrService,
    NbValidationModule
} from '@liquid-js/lyr-core'
import { NbMaskDirective } from '@liquid-js/lyr-extras/mask'

import { SUMMIT, SUMMIT_TIERS, SummitTier } from './summit-data'

interface AttendeeForm {
    name: FormControl<string>
    email: FormControl<string>
}

// Sample attendees, so the checkout can be walked through straight away.
const SAMPLE_ATTENDEES = [
    { name: 'Jane Doe', email: 'jane.doe@example.com' },
    { name: 'John Smith', email: 'john.smith@example.com' },
    { name: 'Emma Brown', email: 'emma.brown@example.com' }
]

/**
 * Tickets: the tiers with how many of each, then the checkout in three steps, who's coming, how it's paid and a last
 * look, with the order beside them.
 */
@Component({
    selector: 'npg-summit-tickets',
    templateUrl: './summit-tickets.component.html',
    styleUrls: ['./summit-tickets.component.scss'],
    imports: [
        CurrencyPipe,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardHeaderComponent,
        NbIconComponent,
        NbInputDirective,
        NbMaskDirective,
        NbStepComponent,
        NbStepperComponent,
        NbStepperNextDirective,
        NbStepperPreviousDirective,
        NbTagComponent,
        NbValidationModule,
        ReactiveFormsModule,
        RouterLink
    ]
})
export class SummitTicketsComponent {
    private readonly toastr = inject(NbToastrService)

    readonly summit = SUMMIT
    readonly tiers = SUMMIT_TIERS
    /** How many of each tier, by its id. */
    readonly quantities = signal<Record<string, number>>({ standard: 1 })
    readonly lines = computed(() =>
        this.tiers
            .map((tier) => ({ tier, count: this.quantities()[tier.id] ?? 0 }))
            .filter(({ count }) => count > 0)
            .map(({ tier, count }) => ({ tier, count, total: count * tier.price }))
    )
    readonly count = computed(() => this.lines().reduce((sum, line) => sum + line.count, 0))
    readonly subtotal = computed(() => this.lines().reduce((sum, line) => sum + line.total, 0))
    readonly tax = computed(() => Math.round(this.subtotal() * 0.0825 * 100) / 100)
    readonly total = computed(() => this.subtotal() + this.tax())
    readonly paid = signal(false)

    readonly attendees = new FormArray<FormGroup<AttendeeForm>>([])
    readonly attendeesForm = new FormGroup({ attendees: this.attendees })
    readonly payment = new FormGroup({
        holder: new FormControl('Jane Doe', { nonNullable: true, validators: Validators.required }),
        number: new FormControl('4242 4242 4242 4242', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(19)]
        }),
        expiry: new FormControl('09/28', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
        cvc: new FormControl('123', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
        company: new FormControl('Northwind Traders', { nonNullable: true })
    })

    constructor() {
    // One attendee form per ticket, kept as the count changes; new ones start with a sample person.
        effect(() => {
            const count = this.count()
            untracked(() => {
                while (this.attendees.length > count) {
                    this.attendees.removeAt(this.attendees.length - 1)
                }
                while (this.attendees.length < count) {
                    const sample = SAMPLE_ATTENDEES[this.attendees.length % SAMPLE_ATTENDEES.length]
                    this.attendees.push(
                        new FormGroup<AttendeeForm>({
                            name: new FormControl(sample.name, { nonNullable: true, validators: Validators.required }),
                            email: new FormControl(sample.email, {
                                nonNullable: true,
                                validators: [Validators.required, Validators.email]
                            })
                        })
                    )
                }
            })
        })
    }

    add(tier: SummitTier, by: number) {
        this.quantities.update((quantities) => ({
            ...quantities,
            [tier.id]: Math.max(0, Math.min(20, (quantities[tier.id] ?? 0) + by))
        }))
    }

    quantity(tier: SummitTier) {
        return this.quantities()[tier.id] ?? 0
    }

    pay() {
        this.paid.set(true)
        this.toastr.show('Your tickets are on their way to each attendee.', 'Paid', { status: 'success' })
    }

    again() {
        this.paid.set(false)
        this.quantities.set({ standard: 1 })
    }
}
