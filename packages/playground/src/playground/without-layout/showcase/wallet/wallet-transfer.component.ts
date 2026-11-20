import { CurrencyPipe, DatePipe } from '@angular/common'
import { Component, computed, signal, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import {
    NbAlertComponent,
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbDatepickerComponent,
    NbDatepickerDirective,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbPrefixDirective,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent,
    NbStepComponent,
    NbStepperComponent,
    NbStepperNextDirective,
    NbStepperPreviousDirective,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { portrait } from '../shared/showcase-images'
import { WALLET_ACCOUNTS, WALLET_RECIPIENTS, WALLET_TODAY, walletAccount, WalletAccount, WalletRecipient } from './wallet-data'

/** Where money can go: one of the person's own accounts, or someone they've paid before. */
type Destination = { kind: 'own', account: WalletAccount } | { kind: 'recipient', recipient: WalletRecipient }

// The amount can't be more than the account it's from holds.
const withinBalance = (from: () => WalletAccount) => (control: AbstractControl) =>
    typeof control.value === 'number' && control.value > from().balance ? { insufficient: true } : null

/**
 * Sending money in four steps: from where to whom, how much and when, a look before it goes, and a receipt. The
 * stepper is linear, so each step's form has to be valid before the next.
 */
@Component({
    selector: 'npg-wallet-transfer',
    templateUrl: './wallet-transfer.component.html',
    styleUrls: ['./wallet-transfer.component.scss'],
    imports: [
        CurrencyPipe,
        DatePipe,
        NbAlertComponent,
        NbButtonComponent,
        NbButtonGroupComponent,
        NbButtonToggleDirective,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbDatepickerComponent,
        NbDatepickerDirective,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbOptionComponent,
        NbPrefixDirective,
        NbRadioComponent,
        NbRadioGroupComponent,
        NbSelectComponent,
        NbStepComponent,
        NbStepperComponent,
        NbStepperNextDirective,
        NbStepperPreviousDirective,
        NbUserComponent,
        ReactiveFormsModule,
        RouterLink
    ]
})
export class WalletTransferComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)

    readonly accounts = WALLET_ACCOUNTS.filter((account) => account.id !== 'credit')
    readonly destinations: Array<{ id: string, destination: Destination }> = [
        ...WALLET_ACCOUNTS.map((account) => ({ id: account.id, destination: { kind: 'own', account } as const })),
        ...WALLET_RECIPIENTS.map((recipient) => ({ id: recipient.number, destination: { kind: 'recipient', recipient } as const }))
    ]
    readonly photoOf = portrait
    readonly quickAmounts = [50, 100, 250, 500]

    readonly parties = new FormGroup({
        from: new FormControl<WalletAccount['id']>('checking', { nonNullable: true, validators: Validators.required }),
        to: new FormControl('', { nonNullable: true, validators: Validators.required })
    })

    readonly details = new FormGroup({
        amount: new FormControl<number | null>(null, {
            validators: [Validators.required, Validators.min(1), withinBalance(() => this.fromAccount())]
        }),
        note: new FormControl('', { nonNullable: true, validators: Validators.maxLength(60) }),
        date: new FormControl(WALLET_TODAY, { nonNullable: true, validators: Validators.required })
    })

    private readonly from = toSignal(this.parties.controls.from.valueChanges, { initialValue: 'checking' as const })
    private readonly to = toSignal(this.parties.controls.to.valueChanges, { initialValue: '' })
    private readonly amountValue = toSignal(this.details.controls.amount.valueChanges, { initialValue: null })
    private readonly dateValue = toSignal(this.details.controls.date.valueChanges, { initialValue: WALLET_TODAY })

    readonly fromAccount = computed(() => walletAccount(this.from()))
    readonly destination = computed(() => this.destinations.find(({ id }) => id === this.to())?.destination)
    readonly amount = computed(() => this.amountValue() ?? 0)
    /** Between the person's own accounts it's free and at once; to someone else it costs and takes a day. */
    readonly external = computed(() => this.destination()?.kind === 'recipient')
    readonly fee = computed(() => (this.external() ? 1.5 : 0))
    readonly arrives = computed(() => {
        const date = this.dateValue()
        return this.external() ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1) : date
    })
    readonly reference = signal('')

    /** The recipient's name, whichever kind it is. */
    nameOf(destination: Destination): string {
        return destination.kind === 'own' ? destination.account.name : destination.recipient.name
    }

    pickAmount(value: unknown) {
        if (typeof value === 'number') {
            this.details.controls.amount.setValue(value)
        }
    }

    confirm() {
        this.reference.set(`WT-${String(Math.floor(Math.random() * 900000) + 100000)}`)
    }

    another(stepper: NbStepperComponent) {
        this.parties.reset()
        this.details.reset()
        this.reference.set('')
        stepper.reset()
    }

    // A page of this app, wherever it's mounted.
    link(page: string): string {
        return this.router.serializeUrl(this.router.createUrlTree(['..', page], { relativeTo: this.route }))
    }
}
