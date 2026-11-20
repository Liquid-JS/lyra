import { Component, DestroyRef, inject } from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { NbAuthOAuth2Token, NbAuthService, NbAuthToken } from '@liquid-js/lyr-auth'
import { map } from 'rxjs/operators'
import { NbLayoutComponent, NbLayoutColumnComponent, NbCardComponent, NbCardBodyComponent, NbButtonComponent } from '@liquid-js/lyr-core'
import { JsonPipe } from '@angular/common'

@Component({
    selector: 'nb-oauth2-login',
    templateUrl: './oauth2-login.component.html',
    imports: [
        NbButtonComponent,
        NbLayoutComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardBodyComponent,
        JsonPipe
    ]
})
export class OAuth2LoginComponent {
    private readonly authService = inject(NbAuthService)
    private readonly destroyRef = inject(DestroyRef)

    readonly token = toSignal(
        this.authService
            .onTokenChange()
            .pipe(map((token: NbAuthToken) => (token && token.isValid() ? (token as NbAuthOAuth2Token) : undefined)))
    )

    login() {
        this.authService
            .authenticate('google')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
    }

    logout() {
        this.authService
            .logout('google')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
    }
}
