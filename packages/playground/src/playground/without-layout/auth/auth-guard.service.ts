import { inject, Service } from '@angular/core'
import { tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { NbAuthService } from '@liquid-js/lyr-auth'

@Service({ autoProvided: false })
export class AuthGuard {
    private readonly authService = inject(NbAuthService)
    private readonly router = inject(Router)

    canActivate() {
        return this.authService.isAuthenticated()
            .pipe(
                tap((authenticated) => {
                    if (!authenticated) {
                        void this.router.navigate(['auth/login'])
                    }
                })
            )
    }
}
