import { NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NbFirebasePasswordStrategy } from './strategies/password/firebase-password.strategy';
import { NbFirebaseGoogleStrategy } from './strategies/google/firebase-google.strategy';
import { NbFirebaseFacebookStrategy } from './strategies/facebook/firebase-facebook.strategy';
import { NbFirebaseTwitterStrategy } from './strategies/twitter/firebase-twitter.strategy';

/**
 * Provides the Firebase auth strategies, in place of importing `NbFirebaseAuthModule`.
 */
export function provideNbFirebaseAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    NbFirebasePasswordStrategy,
    NbFirebaseGoogleStrategy,
    NbFirebaseFacebookStrategy,
    NbFirebaseTwitterStrategy,
  ]);
}

@NgModule({
  providers: [provideNbFirebaseAuth()],
})
export class NbFirebaseAuthModule { }
