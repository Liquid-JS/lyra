import { inject, Service } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
  type User,
} from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  NbAuthCredentials,
  NbAuthStrategyOptions,
  NbAuthStrategyClass,
  NbAuthResult,
} from '@liquid-js/lyr-auth';

import { NbFirebaseBaseStrategy } from '../base/firebase-base.strategy';
import {
  firebasePasswordStrategyOptions,
  NbFirebasePasswordStrategyOptions,
} from './firebase-password-strategy.options';

@Service({ autoProvided: false })
export class NbFirebasePasswordStrategy extends NbFirebaseBaseStrategy<NbFirebasePasswordStrategyOptions> {
  protected override defaultOptions: NbFirebasePasswordStrategyOptions = firebasePasswordStrategyOptions;
  private readonly route = inject(ActivatedRoute);

  static setup(options: NbFirebasePasswordStrategyOptions): [NbAuthStrategyClass, NbAuthStrategyOptions] {
    return [NbFirebasePasswordStrategy, options];
  }

  authenticate({ email, password }: Required<Pick<NbAuthCredentials, 'email' | 'password'>>): Observable<NbAuthResult> {
    const module = 'login';
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((res) => this.processSuccess(res, module)),
      catchError((error) => this.processFailure(error, module)),
    );
  }

  override register({
    email,
    password,
  }: Required<Pick<NbAuthCredentials, 'email' | 'password'>>): Observable<NbAuthResult> {
    const module = 'register';
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((res) => this.processSuccess(res, module)),
      catchError((error) => this.processFailure(error, module)),
    );
  }

  override requestPassword({ email }: Required<Pick<NbAuthCredentials, 'email'>>): Observable<NbAuthResult> {
    const module = 'requestPassword';
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      map(() => {
        return new NbAuthResult(
          true,
          undefined,
          this.getOption(`${module}.redirect.success`),
          [],
          this.getOption(`${module}.defaultMessages`),
        );
      }),
      catchError((error) => this.processFailure(error, module)),
    );
  }

  /**
   * Sets the new password with the code of Firebase's password reset email. The link in the email brings the user to
   * the reset password page with the code in the query, under the options' `resetPasswordTokenKey` (Firebase's
   * `oobCode`); a `code` in the data is used instead when it's given.
   */
  override resetPassword({ code, password }: { code?: string; password: string }): Observable<NbAuthResult> {
    const module = 'resetPassword';
    const codeKey = this.getOption(`${module}.resetPasswordTokenKey`) ?? 'oobCode';
    const queryCode: unknown = this.route.snapshot.queryParams[codeKey];
    const resetCode = code ?? (typeof queryCode === 'string' ? queryCode : undefined);
    if (!resetCode) {
      return this.processFailure(new Error(`No password reset code in the page's "${codeKey}" query.`), module);
    }
    return from(this.confirmPasswordReset(resetCode, password)).pipe(
      map(() => {
        return new NbAuthResult(
          true,
          undefined,
          this.getOption(`${module}.redirect.success`),
          [],
          this.getOption(`${module}.defaultMessages`),
        );
      }),
      catchError((error) => this.processFailure(error, module)),
    );
  }

  /** Firebase's confirmPasswordReset, for the strategy's Auth. */
  protected confirmPasswordReset(code: string, password: string): Promise<void> {
    return confirmPasswordReset(this.auth, code, password);
  }

  protected updatePassword(user: User, password: string, module: string) {
    return from(updatePassword(user, password)).pipe(
      map((token) => {
        const options = this.moduleOptions(module);
        return new NbAuthResult(
          true,
          undefined,
          options.redirect?.success,
          [],
          options.defaultMessages,
          this.createToken(token),
        );
      }),
      catchError((error) => this.processFailure(error, module)),
    );
  }
}
