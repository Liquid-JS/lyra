import { Component, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Location } from '@angular/common'
import { Subscription } from 'rxjs'

import {
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbIconComponent
} from '@liquid-js/lyr-core'
import { RouterOutlet } from '@angular/router'
import { NbAuthService } from '../services/auth.service'
import { injectNbAuthTexts } from '../texts'
import { NbAuthBlockComponent } from './auth-block/auth-block.component'

@Component({
    selector: 'nb-auth',
    styleUrls: ['./auth.component.scss'],
    templateUrl: './auth.component.html',
    // Routed auth pages may not use signals, so the outlet is checked on every change detection.
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        NbLayoutComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbIconComponent,
        NbAuthBlockComponent,
        RouterOutlet
    ]
})
export class NbAuthComponent {
    protected readonly texts = injectNbAuthTexts()

    protected readonly destroyRef = inject(DestroyRef)
    protected readonly auth = inject(NbAuthService)
    protected readonly location = inject(Location)

    subscription: Subscription

    authenticated = false
    token = ''

    // Follows the authentication state, as an example of `onAuthenticationChange()`; the template doesn't read it.
    constructor() {
        const auth = this.auth

        this.subscription = auth
            .onAuthenticationChange()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((authenticated: boolean) => {
                this.authenticated = authenticated
            })
    }

    back() {
        this.location.back()
        return false
    }
}
