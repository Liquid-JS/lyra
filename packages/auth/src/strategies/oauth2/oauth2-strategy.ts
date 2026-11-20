import { inject, Service } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { NB_WINDOW } from '@liquid-js/lyr-core';

import { NbAuthStrategy } from '../auth-strategy';
import { NbAuthIllegalTokenError, NbAuthRefreshableToken, NbAuthToken } from '../../services/token/token';
import { NbAuthResult } from '../../services/auth-result';
import {
  NbOAuth2AuthStrategyOptions,
  NbOAuth2ResponseType,
  auth2StrategyOptions,
  NbOAuth2GrantType,
  NbOAuth2ClientAuthMethod,
} from './oauth2-strategy.options';
import { NbAuthStrategyClass } from '../../auth.options';
import { NbAuthCredentials } from '../../models/user';

/** The state, and the PKCE verifier, of a sign-in on its way to the server and back. */
interface NbOAuth2PendingAuthorization {
  state: string;
  verifier?: string;
}

/** Whether a token can be refreshed: has a refresh token to read and set. */
function isRefreshableToken(token: NbAuthToken): token is NbAuthToken & NbAuthRefreshableToken {
  return 'getRefreshToken' in token && 'setRefreshToken' in token;
}

/** Bytes as base64url, without padding. */
function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** A random string of `bytes` random bytes. */
function randomString(bytes: number) {
  return base64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

/** A verifier's PKCE challenge: S256, or `plain` where Web Crypto isn't there (pages not served over HTTPS). */
async function pkceChallenge(verifier: string): Promise<{ challenge: string; method: 'S256' | 'plain' }> {
  if (!globalThis.crypto?.subtle) {
    return { challenge: verifier, method: 'plain' };
  }
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return { challenge: base64url(new Uint8Array(digest)), method: 'S256' };
}

/**
 * Signs in with an OAuth2 server. `authenticate` sends the browser to the `authorize` endpoint and, when it comes
 * back with a code (or with a token, with `responseType: 'token'`), gets the token from the `token` endpoint; with
 * the password grant it posts the email and password to `token` instead. `refreshToken` posts the refresh token to
 * `refresh`. `register`, `requestPassword` and `resetPassword` aren't supported.
 *
 * Strategy settings; `setup` takes the ones to change, over these defaults. `defaultErrors` and `defaultMessages` are
 * the `authStrategy` texts (`provideNbTexts`), unless the given options set them:
 *
 * ```ts
 * export enum NbOAuth2ResponseType {
 *   CODE = 'code',
 *   TOKEN = 'token',
 * }
 *
 * export enum NbOAuth2GrantType {
 *   AUTHORIZATION_CODE = 'authorization_code',
 *   PASSWORD = 'password',
 *   REFRESH_TOKEN = 'refresh_token',
 * }
 *
 * export enum NbOAuth2ClientAuthMethod {
 *   NONE = 'none',
 *   BASIC = 'basic',
 *   REQUEST_BODY = 'request-body',
 * }
 *
 * export class NbOAuth2AuthStrategyOptions extends NbAuthStrategyOptions {
 *   name = '';
 *   baseEndpoint?: string = '';
 *   clientId = '';
 *   clientSecret?: string = '';
 *   clientAuthMethod?: string = NbOAuth2ClientAuthMethod.NONE;
 *   redirect?: { success?: string | null; failure?: string | null } = {
 *     success: '/',
 *     failure: null,
 *   };
 *   defaultErrors?: string[] = ['Something went wrong, please try again.'];
 *   defaultMessages?: string[] = ['You have been successfully authenticated.'];
 *   authorize?: {
 *     endpoint?: string;
 *     redirectUri?: string;
 *     responseType?: string;
 *     requireValidToken?: boolean; // used only with NbOAuth2ResponseType.TOKEN
 *     scope?: string;
 *     state?: string;
 *     pkce?: boolean;
 *     params?: { [key: string]: string };
 *   } = {
 *     endpoint: 'authorize',
 *     responseType: NbOAuth2ResponseType.CODE,
 *     requireValidToken: true,
 *     pkce: true,
 *   };
 *   token?: {
 *     endpoint?: string;
 *     grantType?: string;
 *     redirectUri?: string;
 *     scope?: string; // used only with the password grant
 *     requireValidToken?: boolean;
 *     class: NbAuthTokenClass;
 *   } = {
 *     endpoint: 'token',
 *     grantType: NbOAuth2GrantType.AUTHORIZATION_CODE,
 *     requireValidToken: true,
 *     class: NbAuthOAuth2Token,
 *   };
 *   refresh?: {
 *     endpoint?: string;
 *     grantType?: string;
 *     scope?: string;
 *     requireValidToken?: boolean;
 *   } = {
 *     endpoint: 'token',
 *     grantType: NbOAuth2GrantType.REFRESH_TOKEN,
 *     requireValidToken: true,
 *   };
 * }
 * ```
 *
 * With `clientAuthMethod` `basic` the client id and secret go in a Basic authorization header, with `request-body`
 * in the token requests' body; both need `clientId` and `clientSecret`.
 *
 * The code flow uses PKCE (RFC 7636): a random verifier per sign-in, its S256 challenge on the redirect to
 * `authorize`, and the verifier with the code to `token`; `authorize.pkce: false` turns it off. Every redirect sends a
 * state, random unless `authorize.state` sets one, and the way back is refused unless it brings the same state, so a
 * sign-in this browser didn't start can't complete. Both are kept in `sessionStorage` while the browser is away.
 */
@Service({ autoProvided: false })
export class NbOAuth2AuthStrategy extends NbAuthStrategy<NbOAuth2AuthStrategyOptions> {
  // The messages are the options' own, not their actions'.
  protected override textOptions(): object {
    const texts = this.texts();
    return { defaultErrors: [texts.error], defaultMessages: [texts.authenticateSuccess] };
  }

  protected readonly http = inject(HttpClient);
  protected readonly route = inject(ActivatedRoute);
  protected readonly window = inject(NB_WINDOW);

  static setup(options: NbOAuth2AuthStrategyOptions): [NbAuthStrategyClass, NbOAuth2AuthStrategyOptions] {
    return [NbOAuth2AuthStrategy, options];
  }

  get responseType() {
    return this.getOption('authorize.responseType');
  }

  get clientAuthMethod() {
    return this.getOption('clientAuthMethod');
  }

  protected redirectResultHandlers: { [key: string]: () => Observable<NbAuthResult> } = {
    [NbOAuth2ResponseType.CODE]: () => {
      return observableOf(this.route.snapshot.queryParams).pipe(
        switchMap((params: Params) => {
          const pending = this.takePendingAuthorization();
          const code: unknown = params['code'];
          if (code) {
            if (!pending || pending.state !== params['state']) {
              return observableOf(this.invalidStateResult(params));
            }
            return this.requestToken(String(code), pending.verifier);
          }

          return observableOf(
            new NbAuthResult(false, params, this.getOption('redirect.failure'), this.getOption('defaultErrors'), []),
          );
        }),
      );
    },
    [NbOAuth2ResponseType.TOKEN]: () => {
      const module = 'authorize';
      const requireValidToken = this.getOption(`${module}.requireValidToken`);
      return observableOf(this.route.snapshot.fragment).pipe(
        map((fragment) => this.parseHashAsQueryParams(fragment)),
        map((params) => {
          const pending = this.takePendingAuthorization();
          if (!params['error'] && (!pending || pending.state !== params['state'])) {
            return this.invalidStateResult(params);
          }
          if (!params['error']) {
            return new NbAuthResult(
              true,
              params,
              this.getOption('redirect.success'),
              [],
              this.getOption('defaultMessages'),
              this.createToken(params, requireValidToken),
            );
          }
          return new NbAuthResult(
            false,
            params,
            this.getOption('redirect.failure'),
            this.getOption('defaultErrors'),
            [],
          );
        }),
        catchError((err: unknown) => {
          const errors = new Array<string>();
          if (err instanceof NbAuthIllegalTokenError) {
            errors.push(err.message);
          } else {
            errors.push(this.texts().unknownError);
          }
          return observableOf(new NbAuthResult(false, err, this.getOption('redirect.failure'), errors));
        }),
      );
    },
  };

  protected redirectResults: { [key: string]: () => Observable<boolean> } = {
    [NbOAuth2ResponseType.CODE]: () => {
      return observableOf(this.route.snapshot.queryParams).pipe(
        map((params: Params) => !!(params && (params['code'] || params['error']))),
      );
    },
    [NbOAuth2ResponseType.TOKEN]: () => {
      return observableOf(this.route.snapshot.fragment).pipe(
        map((fragment) => this.parseHashAsQueryParams(fragment)),
        map((params) => !!(params && (params['access_token'] || params['error']))),
      );
    },
  };

  protected override defaultOptions: NbOAuth2AuthStrategyOptions = auth2StrategyOptions;

  /**
   * Sends the browser to sign in, or completes the sign-in it's back from; with the password grant, signs in with the
   * email and password.
   */
  authenticate(data?: Pick<NbAuthCredentials, 'email' | 'password'>): Observable<NbAuthResult> {
    if (this.getOption('token.grantType') === NbOAuth2GrantType.PASSWORD) {
      return this.passwordToken(data?.email ?? '', data?.password ?? '');
    } else {
      return this.isRedirectResult().pipe(
        switchMap((result: boolean) => {
          if (!result) {
            this.authorizeRedirect();
            return observableOf(new NbAuthResult(true));
          }
          return this.getAuthorizationResult();
        }),
      );
    }
  }

  getAuthorizationResult(): Observable<NbAuthResult> {
    const redirectResultHandler = this.redirectResultHandlers[this.responseType ?? ''];
    if (redirectResultHandler) {
      return redirectResultHandler.call(this);
    }

    throw new Error(`'${this.responseType}' responseType is not supported,
                      only 'token' and 'code' are supported now`);
  }

  refreshToken(token: NbAuthRefreshableToken): Observable<NbAuthResult> {
    const module = 'refresh';
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);

    return this.http.post(url, this.buildRefreshRequestData(token), { headers: this.getHeaders() }).pipe(
      map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getOption('redirect.success'),
          [],
          this.getOption('defaultMessages'),
          this.createRefreshedToken(res, token, requireValidToken),
        );
      }),
      catchError((res) => this.handleResponseError(res)),
    );
  }

  passwordToken(username: string, password: string): Observable<NbAuthResult> {
    const module = 'token';
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);

    return this.http.post(url, this.buildPasswordRequestData(username, password), { headers: this.getHeaders() }).pipe(
      map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getOption('redirect.success'),
          [],
          this.getOption('defaultMessages'),
          this.createToken(res, requireValidToken),
        );
      }),
      catchError((res) => this.handleResponseError(res)),
    );
  }

  protected authorizeRedirect() {
    void this.startAuthorization().then((url) => {
      if (this.window) {
        this.window.location.href = url;
      }
    });
  }

  /**
   * Starts a sign-in: makes its state and PKCE verifier, keeps them for the way back, and gives the URL to send the
   * browser to.
   */
  protected async startAuthorization(): Promise<string> {
    const state: string = this.getOption('authorize.state') || randomString(16);
    const pkce = this.responseType === NbOAuth2ResponseType.CODE && this.getOption('authorize.pkce') !== false;
    const verifier = pkce ? randomString(32) : undefined;
    const challenge = verifier ? await pkceChallenge(verifier) : undefined;
    const pending: NbOAuth2PendingAuthorization = { state, ...(verifier && { verifier }) };
    this.sessionStorage()?.setItem(this.pendingKey(), JSON.stringify(pending));
    return this.buildRedirectUrl({
      state,
      ...(challenge && { code_challenge: challenge.challenge, code_challenge_method: challenge.method }),
    });
  }

  /** The sign-in on its way back, which can be taken once. */
  protected takePendingAuthorization(): NbOAuth2PendingAuthorization | undefined {
    const storage = this.sessionStorage();
    const raw = storage?.getItem(this.pendingKey());
    storage?.removeItem(this.pendingKey());
    try {
      return raw ? (JSON.parse(raw) as NbOAuth2PendingAuthorization) : undefined;
    } catch {
      return undefined;
    }
  }

  protected pendingKey() {
    return `nb-oauth2-${this.getName() || 'oauth2'}`;
  }

  protected sessionStorage(): Storage | undefined {
    try {
      return this.window?.sessionStorage;
    } catch {
      // Storage the browser denies, e.g. with cookies blocked.
      return undefined;
    }
  }

  protected invalidStateResult(params: unknown) {
    return new NbAuthResult(false, params, this.getOption('redirect.failure'), [this.texts().invalidState], []);
  }

  protected isRedirectResult(): Observable<boolean> {
    return this.redirectResults[this.responseType ?? ''].call(this);
  }

  protected requestToken(code: string, verifier?: string) {
    const module = 'token';
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);

    return this.http.post(url, this.buildCodeRequestData(code, verifier), { headers: this.getHeaders() }).pipe(
      map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getOption('redirect.success'),
          [],
          this.getOption('defaultMessages'),
          this.createToken(res, requireValidToken),
        );
      }),
      catchError((res) => this.handleResponseError(res)),
    );
  }

  protected buildCodeRequestData(code: string, verifier?: string): string {
    const params = {
      grant_type: this.getOption('token.grantType'),
      code: code,
      redirect_uri: this.getOption('token.redirectUri'),
      client_id: this.getOption('clientId'),
      code_verifier: verifier,
    };
    return this.urlEncodeParameters(this.cleanParams(this.addCredentialsToParams(params)));
  }

  protected buildRefreshRequestData(token: NbAuthRefreshableToken): string {
    const params = {
      grant_type: this.getOption('refresh.grantType'),
      refresh_token: token.getRefreshToken(),
      scope: this.getOption('refresh.scope'),
      client_id: this.getOption('clientId'),
    };
    return this.urlEncodeParameters(this.cleanParams(this.addCredentialsToParams(params)));
  }

  protected buildPasswordRequestData(username: string, password: string): string {
    const params = {
      grant_type: this.getOption('token.grantType'),
      username: username,
      password: password,
      scope: this.getOption('token.scope'),
    };
    return this.urlEncodeParameters(this.cleanParams(this.addCredentialsToParams(params)));
  }

  protected buildAuthHeader(): HttpHeaders | undefined {
    if (this.clientAuthMethod === NbOAuth2ClientAuthMethod.BASIC) {
      if (this.getOption('clientId') && this.getOption('clientSecret')) {
        return new HttpHeaders({
          Authorization: 'Basic ' + btoa(this.getOption('clientId') + ':' + this.getOption('clientSecret')),
        });
      } else {
        throw Error('For basic client authentication method, please provide both clientId & clientSecret.');
      }
    }
    return undefined;
  }

  protected override getHeaders(): HttpHeaders {
    let headers = super.getHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const authHeaders = this.buildAuthHeader();
    if (authHeaders === undefined) {
      return headers;
    }

    for (const headerKey of authHeaders.keys()) {
      for (const headerValue of authHeaders.getAll(headerKey) ?? []) {
        headers = headers.append(headerKey, headerValue);
      }
    }

    return headers;
  }

  /** Removes the params without a value. */
  protected cleanParams(params: Record<string, unknown>): Record<string, unknown> {
    Object.entries(params).forEach(([key, val]) => !val && delete params[key]);
    return params;
  }

  protected addCredentialsToParams(params: Record<string, unknown>): Record<string, unknown> {
    if (this.clientAuthMethod === NbOAuth2ClientAuthMethod.REQUEST_BODY) {
      if (this.getOption('clientId') && this.getOption('clientSecret')) {
        return {
          ...params,
          client_id: this.getOption('clientId'),
          client_secret: this.getOption('clientSecret'),
        };
      } else {
        throw Error('For request body client authentication method, please provide both clientId & clientSecret.');
      }
    }
    return params;
  }

  protected handleResponseError(res: unknown): Observable<NbAuthResult> {
    let errors = new Array<string>();
    if (res instanceof HttpErrorResponse) {
      const error: unknown = res.error;
      const description = typeof error === 'object' && error !== null && 'error_description' in error
        ? error.error_description
        : undefined;
      if (description) {
        errors.push(String(description));
      } else {
        errors = this.getOption('defaultErrors') ?? [];
      }
    } else if (res instanceof NbAuthIllegalTokenError) {
      errors.push(res.message);
    } else {
      errors.push(this.texts().unknownError);
    }

    return observableOf(new NbAuthResult(false, res, this.getOption('redirect.failure'), errors, []));
  }

  /** The URL of `authorize`, with the sign-in's state and PKCE challenge. */
  protected buildRedirectUrl(
    sign: { state?: string; code_challenge?: string; code_challenge_method?: string } = {},
  ) {
    const params = {
      response_type: this.getOption('authorize.responseType'),
      client_id: this.getOption('clientId'),
      redirect_uri: this.getOption('authorize.redirectUri'),
      scope: this.getOption('authorize.scope'),
      state: sign.state ?? this.getOption('authorize.state'),
      code_challenge: sign.code_challenge,
      code_challenge_method: sign.code_challenge_method,

      ...this.getOption('authorize.params'),
    };

    const endpoint = this.getActionEndpoint('authorize');
    const query = this.urlEncodeParameters(this.cleanParams(params));

    return `${endpoint}?${query}`;
  }

  protected parseHashAsQueryParams(hash: string | null): { [key: string]: string } {
    return hash
      ? hash.split('&').reduce<{ [key: string]: string }>((acc, part) => {
        const item = part.split('=');
        acc[item[0]] = decodeURIComponent(item[1]);
        return acc;
      }, {})
      : {};
  }

  protected urlEncodeParameters(params: Record<string, unknown>): string {
    return Object.keys(params)
      .map((k) => {
        return `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]))}`;
      })
      .join('&');
  }

  protected createRefreshedToken(
    res: unknown,
    existingToken: NbAuthRefreshableToken,
    requireValidToken?: boolean,
  ): NbAuthToken {
    const refreshedToken = this.createToken(res, requireValidToken);
    if (isRefreshableToken(refreshedToken) && !refreshedToken.getRefreshToken() && existingToken.getRefreshToken()) {
      refreshedToken.setRefreshToken(existingToken.getRefreshToken());
    }
    return refreshedToken;
  }

  register(_data?: unknown): Observable<NbAuthResult> {
    throw new Error('`register` is not supported by `NbOAuth2AuthStrategy`, use `authenticate`.');
  }

  requestPassword(_data?: unknown): Observable<NbAuthResult> {
    throw new Error('`requestPassword` is not supported by `NbOAuth2AuthStrategy`, use `authenticate`.');
  }

  resetPassword(_data?: unknown): Observable<NbAuthResult> {
    throw new Error('`resetPassword` is not supported by `NbOAuth2AuthStrategy`, use `authenticate`.');
  }

  logout(): Observable<NbAuthResult> {
    return observableOf(new NbAuthResult(true));
  }
}
