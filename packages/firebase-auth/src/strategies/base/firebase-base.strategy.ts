import { inject, Service } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { signOut, type User, type UserCredential } from 'firebase/auth';
import { Observable, of as observableOf, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  getDeepFromObject,
  NbAuthResult,
  NbAuthIllegalTokenError,
  NbAuthStrategy,
  NbAuthStrategyOptions,
  NbPasswordStrategyMessage,
  NbPasswordStrategyModule,
} from '@liquid-js/lyr-auth';

/** The options of every Firebase strategy: the getters of its errors and messages. */
type NbFirebaseStrategyOptions = NbAuthStrategyOptions & {
  errors?: NbPasswordStrategyMessage;
  messages?: NbPasswordStrategyMessage;
};

/** Whether a module's option is its options, rather than a flag. */
function isModuleOptions(value: unknown): value is NbPasswordStrategyModule {
  return typeof value === 'object' && value !== null;
}

/**
 * The base of the Firebase strategies. `O` is the strategy's options class; each names its modules (actions) its own
 * way, such as `login` and `authenticate`.
 */
@Service({ autoProvided: false })
export abstract class NbFirebaseBaseStrategy<O extends NbFirebaseStrategyOptions = NbFirebaseStrategyOptions>
  extends NbAuthStrategy<O> {
  protected readonly auth = inject(Auth);

  logout(): Observable<NbAuthResult> {
    const module = 'logout';
    return from(signOut(this.auth)).pipe(
      map(() => {
        const options = this.moduleOptions(module);
        return new NbAuthResult(true, undefined, options.redirect?.success, [], options.defaultMessages);
      }),
      catchError((error) => this.processFailure(error, module)),
    );
  }

  register(_data?: unknown): Observable<NbAuthResult> {
    throw new Error(`'register' is not supported by '${this.constructor.name}', use 'authenticate'.`);
  }

  requestPassword(_data?: unknown): Observable<NbAuthResult> {
    throw new Error(`'requestPassword' is not supported by '${this.constructor.name}', use 'authenticate'.`);
  }

  resetPassword(_data?: unknown): Observable<NbAuthResult> {
    throw new Error(`'resetPassword' is not supported by '${this.constructor.name}', use 'authenticate'.`);
  }

  /**
   * Refreshes the Firebase ID token of the signed-in user. Firebase ID tokens expire after an hour, so every
   * strategy needs this for `isAuthenticatedOrRefresh()`.
   */
  refreshToken(_data?: unknown): Observable<NbAuthResult> {
    const module = 'refreshToken';
    return from(this.auth.authStateReady()).pipe(
      map(() => this.auth.currentUser),
      switchMap((user) => {
        if (user == null) {
          return observableOf(
            new NbAuthResult(false, undefined, this.moduleOptions(module).redirect?.failure, [
              "There is no logged in user so refresh of id token isn't possible",
            ]),
          );
        }
        return this.refreshIdToken(user, module);
      }),
    );
  }

  /** The options of a module (action), such as `login`: its redirects and default messages. */
  protected moduleOptions(module: string): NbPasswordStrategyModule {
    const options = getDeepFromObject(this.options, module);
    return isModuleOptions(options) ? options : {};
  }

  protected processFailure(error: unknown, module: string): Observable<NbAuthResult> {
    const errorMessages = new Array<string>();

    const options = this.options;
    const getter = options?.errors?.getter;
    if (error instanceof NbAuthIllegalTokenError) {
      errorMessages.push(error.message);
    } else if (options && getter) {
      errorMessages.push(...getter(module, error, options));
    }

    return observableOf(
      new NbAuthResult(false, error, this.moduleOptions(module).redirect?.failure, errorMessages, []),
    );
  }

  protected processSuccess(res: UserCredential, module: string): Observable<NbAuthResult<UserCredential>> {
    const options = this.options;
    const getter = options?.messages?.getter;
    return from(res.user.getIdToken()).pipe(
      map((token) => {
        return new NbAuthResult(
          true,
          res,
          this.moduleOptions(module).redirect?.success,
          [],
          options && getter ? getter(module, res, options) : undefined,
          this.createToken(token),
        );
      }),
    );
  }

  protected refreshIdToken(user: User, module: string): Observable<NbAuthResult> {
    return from(user.getIdToken(true)).pipe(
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
