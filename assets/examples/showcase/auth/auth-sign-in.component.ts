import { NgTemplateOutlet } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCheckboxComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbSuffixDirective
} from '@liquid-js/lyr-core'

import { AUTH_FRAME } from './auth-frame'

/** A sign-in page: with an email and password, or with another account. */
@Component({
    selector: 'npg-auth-sign-in',
    templateUrl: './auth-sign-in.component.html',
    styleUrls: ['./auth-sign-in.component.scss'],
    imports: [
        NgTemplateOutlet,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCheckboxComponent,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbSuffixDirective,
        RouterLink
    ]
})
export class AuthSignInComponent {
    /** In a card, or plain in the split frame. */
    protected readonly frame = inject(AUTH_FRAME)
    readonly showPassword = signal(false)
    readonly providers = [
        { name: 'Google', icon: 'google' },
        { name: 'GitHub', icon: 'github' },
        { name: 'Facebook', icon: 'facebook' }
    ]
}
