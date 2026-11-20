import { Component, DestroyRef, inject } from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { NbAuthService, NbAuthToken } from '@liquid-js/lyr-auth'
import { map } from 'rxjs/operators'
import { NbLayoutComponent, NbLayoutColumnComponent, NbCardComponent, NbCardBodyComponent, NbButtonComponent } from '@liquid-js/lyr-core'
import { JsonPipe } from '@angular/common'
import { AuthAzureToken } from './azure-adb2c-auth-strategy'

@Component({
    selector: 'nb-playground-azure',
    templateUrl: './azure-login.component.html',
    imports: [
        NbButtonComponent,
        NbLayoutComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardBodyComponent,
        JsonPipe
    ]
})
export class AzureLoginComponent {
    private readonly authService = inject(NbAuthService)
    private readonly destroyRef = inject(DestroyRef)

    readonly token = toSignal(
        this.authService
            .onTokenChange()
            .pipe(map((token: NbAuthToken) => (token && token.isValid() ? (token as AuthAzureToken) : undefined)))
    )

    login() {
        this.authService
            .authenticate('azure')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
    }

    logout() {
        this.authService
            .logout('azure')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
    }
}
