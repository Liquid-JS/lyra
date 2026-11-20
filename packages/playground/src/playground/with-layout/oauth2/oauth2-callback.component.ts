import { Component, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NbAuthResult, NbAuthService } from '@liquid-js/lyr-auth'
import { Router } from '@angular/router'
import { NbLayoutComponent, NbLayoutColumnComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-playground-oauth2-callback',
    templateUrl: './oauth2-callback.component.html',
    imports: [NbLayoutComponent, NbLayoutColumnComponent]
})
export class OAuth2CallbackComponent {
    private readonly authService = inject(NbAuthService)
    private readonly router = inject(Router)

    constructor() {
        this.authService
            .authenticate('google')
            .pipe(takeUntilDestroyed())
            .subscribe((authResult: NbAuthResult) => {
                const redirect = authResult.getRedirect()
                if (authResult.isSuccess() && redirect) {
                    void this.router.navigateByUrl(redirect)
                }
            })
    }
}
