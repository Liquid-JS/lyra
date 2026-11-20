import { Component, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { NbAuthService } from '@liquid-js/lyr-auth'

import { JsonPipe } from '@angular/common'
import { FirebaseAPIService } from '../firebase-api.service'

@Component({
    selector: 'nb-password-auth-showcase',
    templateUrl: './password-auth-showcase.component.html',
    styleUrls: ['./password-auth-showcase.component.scss'],
    imports: [JsonPipe]
})
export class PasswordAuthShowcaseComponent {
    private readonly authService = inject(NbAuthService)
    private readonly router = inject(Router)
    private readonly firebaseApi = inject(FirebaseAPIService)
    private readonly route = inject(ActivatedRoute)

    readonly userToken = toSignal(this.authService.onTokenChange())
    readonly isAuthenticated = toSignal(this.authService.isAuthenticated())
    readonly data = signal<any>(undefined)

    logout() {
        void this.router.navigate(['../logout'], { relativeTo: this.route })
    }

    login() {
        void this.router.navigate(['../login'], { relativeTo: this.route })
    }

    resetPassword() {
        void this.router.navigate(['../reset-password'], { relativeTo: this.route })
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
