import { Service } from '@angular/core';
import { Observable, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { NbAuthStrategyClass, NbAuthResult, NbAuthStrategyOptions } from '@liquid-js/lyr-auth';

import { NbFirebaseBaseStrategy } from '../base/firebase-base.strategy';
import { NbFirebaseIdentityProviderStrategyOptions } from '../base/firebase-identity-provider-strategy.options';

import { TwitterAuthProvider, signInWithPopup } from 'firebase/auth';

@Service({ autoProvided: false })
export class NbFirebaseTwitterStrategy extends NbFirebaseBaseStrategy<NbFirebaseIdentityProviderStrategyOptions> {
  protected override defaultOptions: NbFirebaseIdentityProviderStrategyOptions =
    new NbFirebaseIdentityProviderStrategyOptions();

  static setup(options: NbFirebaseIdentityProviderStrategyOptions): [NbAuthStrategyClass, NbAuthStrategyOptions] {
    return [NbFirebaseTwitterStrategy, options];
  }

  authenticate(_data?: unknown): Observable<NbAuthResult> {
    const module = 'authenticate';
    const provider = new TwitterAuthProvider();
    provider.setCustomParameters(this.getOption('customParameters') ?? {});

    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((res) => this.processSuccess(res, module)),
      catchError((error) => this.processFailure(error, module)),
    );
  }
}

/** @deprecated The old, misspelt name of `NbFirebaseTwitterStrategy`. */
export const NbFirebaseTwitteStrategy = NbFirebaseTwitterStrategy;
/** @deprecated The old, misspelt name of `NbFirebaseTwitterStrategy`. */
export type NbFirebaseTwitteStrategy = NbFirebaseTwitterStrategy;
