import { NgTemplateOutlet } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCheckboxComponent,
    NbInputDirective
} from '@liquid-js/lyr-core'

import { AUTH_FRAME } from './auth-frame'

/** A sign-up page: a name, an email and a password, and the terms to agree to. */
@Component({
    selector: 'npg-auth-sign-up',
    templateUrl: './auth-sign-up.component.html',
    styleUrls: ['./auth-sign-up.component.scss'],
    imports: [
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCheckboxComponent,
        NbInputDirective,
        NgTemplateOutlet,
        RouterLink
    ]
})
export class AuthSignUpComponent {
    /** In a card, or plain in the split frame. */
    protected readonly frame = inject(AUTH_FRAME)
}
