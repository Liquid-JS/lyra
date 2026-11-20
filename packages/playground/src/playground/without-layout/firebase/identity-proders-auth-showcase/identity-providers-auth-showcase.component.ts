import { Component, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { NbAuthService } from '@liquid-js/lyr-auth'

import { JsonPipe } from '@angular/common'
import { FirebaseAPIService } from '../firebase-api.service'

@Component({
    selector: 'app-google-auth-showcase',
    templateUrl: './identity-providers-auth-showcase.component.html',
    styleUrls: ['./identity-providers-auth-showcase.component.scss'],
    imports: [JsonPipe]
})
export class IdentityProvidersAuthShowcaseComponent {
    private readonly firebaseApi = inject(FirebaseAPIService)
    private readonly authService = inject(NbAuthService)

    readonly userToken = toSignal(this.authService.onTokenChange())
    readonly isAuthenticated = toSignal(this.authService.onAuthenticationChange())
    readonly data = signal<any>(undefined)

    logout() {
        this.authService
            .logout('google')
            .pipe(take(1))
            .subscribe()
    }

    loginWithGoogle() {
        this.authService
            .authenticate('google')
            .pipe(take(1))
            .subscribe()
    }

    getData() {
        this.firebaseApi
            .getGreeting()
            .pipe(
                take(1),
                catchError((error) => of(error))
            )
            .subscribe((data) => this.data.set(data))
    }
}
