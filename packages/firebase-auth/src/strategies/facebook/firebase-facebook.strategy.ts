import { Service } from '@angular/core'
import { NbAuthResult, NbAuthStrategyClass, NbAuthStrategyOptions } from '@liquid-js/lyr-auth'
import { from, Observable } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'

import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { NbFirebaseBaseStrategy } from '../base/firebase-base.strategy'
import { NbFirebaseIdentityProviderStrategyOptions } from '../base/firebase-identity-provider-strategy.options'

@Service({ autoProvided: false })
export class NbFirebaseFacebookStrategy extends NbFirebaseBaseStrategy<NbFirebaseIdentityProviderStrategyOptions> {
    protected override defaultOptions: NbFirebaseIdentityProviderStrategyOptions =
        new NbFirebaseIdentityProviderStrategyOptions()

    static setup(options: NbFirebaseIdentityProviderStrategyOptions): [NbAuthStrategyClass, NbAuthStrategyOptions] {
        return [NbFirebaseFacebookStrategy, options]
    }

    authenticate(_data?: unknown): Observable<NbAuthResult> {
        const module = 'authenticate'
        const provider = new FacebookAuthProvider()
        this.getOption('scopes')?.forEach((scope) => provider.addScope(scope))
        provider.setCustomParameters(this.getOption('customParameters') ?? {})

        return from(signInWithPopup(this.auth, provider)).pipe(
            switchMap((res) => this.processSuccess(res, module)),
            catchError((error) => this.processFailure(error, module))
        )
    }
}
