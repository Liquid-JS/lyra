import { Component } from '@angular/core'
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms'
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbInputDirective,
    NbValidationError,
    NbValidationModule,
    nbValidationParam,
    provideNbValidation
} from '@liquid-js/lyr-core'

const reserved = ['admin', 'root']

function notReserved(control: AbstractControl): ValidationErrors | null {
    return reserved.includes(control.value) ? { reserved: { name: control.value } } : null
}

@Component({
    templateUrl: './validation-messages.component.html',
    styleUrls: ['./validation-example.scss'],
    // Usually provided once for the application; here only for this example.
    providers: [
        provideNbValidation({
            messages: {
                required: 'Please fill this in',
                reserved: (error) => `"${String(nbValidationParam(error, 'name'))}" is reserved`
            }
        })
    ],
    imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbInputDirective, NbValidationModule]
})
export class ValidationMessagesComponent {
    readonly username = new FormControl('admin', [Validators.required, Validators.minLength(3), notReserved])

    protected lengthMessage(error: NbValidationError) {
        const actual = String(nbValidationParam(error, 'actualLength'))
        const required = String(nbValidationParam(error, 'requiredLength'))
        return `${actual} of at least ${required} characters`
    }

    constructor() {
        this.username.markAsTouched()
    }
}
