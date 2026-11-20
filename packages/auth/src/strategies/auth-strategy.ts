import { computed, signal } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NbAuthResult } from '../services/auth-result';
import { NbAuthStrategyOptions } from './auth-strategy-options';
import { deepExtend, getDeepFromObject, NbAuthDeepPartial, NbPath, NbPathValue } from '../helpers';
import { NbAuthToken, nbAuthCreateToken, NbAuthIllegalTokenError } from '../services/token/token';
import { injectNbAuthStrategyTexts } from '../texts';

/**
 * The base of the auth strategies. `O` is the strategy's options class, which types `getOption`.
 */
export abstract class NbAuthStrategy<O extends NbAuthStrategyOptions = NbAuthStrategyOptions> {
  protected defaultOptions?: O;
  /** The default messages, from `NbTextsService`. */
  protected readonly texts = injectNbAuthStrategyTexts();
  /** The options the strategy was set up with, over its defaults and texts. */
  protected readonly givenOptions = signal<NbAuthDeepPartial<O> | undefined>(undefined);
  // Computed, so texts set at run time reach the strategy's default messages.
  protected readonly resolvedOptions = computed(() => {
    const given = this.givenOptions();
    return given === undefined ? undefined : (deepExtend({}, this.defaultOptions, this.textOptions(), given) as O);
  });

  /** The strategy's options: its defaults, the default messages from the texts, and the options it was given. */
  protected get options(): O | undefined {
    return this.resolvedOptions();
  }

  /** Sets the options the strategy works with, over its defaults; they can be partial. */
  setOptions(options: NbAuthDeepPartial<O>) {
    this.givenOptions.set(options);
  }

  /**
   * The default messages of the strategy's actions, from `NbTextsService`, over the defaults of its options and under
   * the options it's given.
   */
  protected textOptions(): object {
    const texts = this.texts();
    const messages: Record<string, [string, string]> = {
      login: [texts.loginError, texts.loginSuccess],
      authenticate: [texts.error, texts.authenticateSuccess],
      register: [texts.error, texts.registerSuccess],
      requestPass: [texts.error, texts.requestPasswordSuccess],
      requestPassword: [texts.error, texts.requestPasswordSuccess],
      resetPass: [texts.error, texts.resetPasswordSuccess],
      resetPassword: [texts.error, texts.resetPasswordSuccess],
      logout: [texts.error, texts.logoutSuccess],
      refreshToken: [texts.error, texts.refreshTokenSuccess],
    };
    const defaults = (this.defaultOptions ?? {}) as unknown as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(messages)
        .filter(([module]) => typeof defaults[module] === 'object' && defaults[module] !== null)
        .map(([module, [error, message]]) => [module, { defaultErrors: [error], defaultMessages: [message] }]),
    );
  }

  /**
   * The option at a dotted path, such as `'login.redirect.success'`, typed by the strategy's options class; `undefined`
   * before the options are set.
   */
  getOption<P extends NbPath<O>>(key: P): NbPathValue<O | undefined, P> {
    return getDeepFromObject(this.options, key);
  }

  /**
   * Creates a token of the options' token class from a value, e.g. a response; with `failWhenInvalidToken`, an
   * invalid one throws.
   */
  createToken(value: unknown, failWhenInvalidToken?: boolean): NbAuthToken {
    const tokenClass = this.options?.token?.class;
    if (!tokenClass) {
      throw new TypeError(`The '${this.getName()}' strategy has no token class.`);
    }
    const token = nbAuthCreateToken(tokenClass, value, this.getName());
    // A token class throws NbAuthIllegalTokenError for a value it can't read, which the strategies handle; a token it
    // makes may still be invalid, e.g. when the backend returned none.
    if (failWhenInvalidToken && !token.isValid()) {
      // Thrown as the same error, so the strategies handle both the same way.
      throw new NbAuthIllegalTokenError(this.texts().invalidToken);
    }
    return token;
  }

  getName(): string {
    return this.options?.name ?? '';
  }

  // The data each action takes is the strategy's own: each strategy declares the shape it reads.

  abstract authenticate(data?: unknown): Observable<NbAuthResult>;

  abstract register(data?: unknown): Observable<NbAuthResult>;

  abstract requestPassword(data?: unknown): Observable<NbAuthResult>;

  abstract resetPassword(data?: unknown): Observable<NbAuthResult>;

  abstract logout(): Observable<NbAuthResult>;

  abstract refreshToken(data?: unknown): Observable<NbAuthResult>;

  protected createFailResponse(_data?: unknown): HttpResponse<unknown> {
    return new HttpResponse<unknown>({ body: {}, status: 401 });
  }

  protected createSuccessResponse(_data?: unknown): HttpResponse<unknown> {
    return new HttpResponse<unknown>({ body: {}, status: 200 });
  }

  /** The URL of an action: its `endpoint` after the options' `baseEndpoint`, or none without an endpoint. */
  protected getActionEndpoint(action: string): string {
    const actionEndpoint = getDeepFromObject(this.options, `${action}.endpoint`);
    const baseEndpoint = getDeepFromObject(this.options, 'baseEndpoint');
    return actionEndpoint ? `${baseEndpoint}${actionEndpoint}` : '';
  }

  protected getHeaders(): HttpHeaders {
    const customHeaders = this.options?.headers ?? {};
    if (customHeaders instanceof HttpHeaders) {
      return customHeaders;
    }

    let headers = new HttpHeaders();
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers = headers.append(key, value);
    });
    return headers;
  }
}
