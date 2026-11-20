import { inject, Service } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { Observable, of as observableOf } from 'rxjs'
import { switchMap, map, catchError } from 'rxjs/operators'

import { NbAuthResult } from '../../services/auth-result'
import { NbAuthStrategy } from '../auth-strategy'
import { NbAuthStrategyClass } from '../../auth.options'
import { NbAuthIllegalTokenError } from '../../services/token/token'
import {
    NbPasswordAuthStrategyOptions,
    NbPasswordStrategyModuleName,
    passwordStrategyOptions
} from './password-strategy-options'

/**
 * Signs in, up and out, and requests and resets the password, against an email and password backend. Each action
 * (`login`, `register`, `requestPass`, `resetPass`, `logout`, `refreshToken`) sends its data to its `endpoint` after
 * `baseEndpoint`, reads the token, messages and errors from the response with the `token`, `messages` and `errors`
 * getters, and redirects as its `redirect` says; `resetPass` adds the reset token from the page's query under
 * `resetPasswordTokenKey`. With `requireValidToken`, a response without a valid token fails the action.
 *
 * Strategy settings; `setup` takes the ones to change, over these defaults. `defaultErrors` and `defaultMessages` are
 * the `authStrategy` texts (`provideNbTexts`), unless the given options set them:
 *
 * ```ts
 *export class NbPasswordAuthStrategyOptions extends NbAuthStrategyOptions {
 *  name = '';
 *  baseEndpoint?: string = '/api/auth/';
 *  login?: boolean | NbPasswordStrategyModule = {
 *    alwaysFail: false,
 *    endpoint: 'login',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Login/Email combination is not correct, please try again.'],
 *    defaultMessages: ['You have been successfully logged in.'],
 *  };
 *  register?: boolean | NbPasswordStrategyModule = {
 *    alwaysFail: false,
 *    endpoint: 'register',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['You have been successfully registered.'],
 *  };
 *  requestPass?: boolean | NbPasswordStrategyModule = {
 *    endpoint: 'request-pass',
 *    method: 'post',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Reset password instructions have been sent to your email.'],
 *  };
 *  resetPass?: boolean | NbPasswordStrategyReset = {
 *    endpoint: 'reset-pass',
 *    method: 'put',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    resetPasswordTokenKey: 'reset_password_token',
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Your password has been successfully changed.'],
 *  };
 *  logout?: boolean | NbPasswordStrategyReset = {
 *    alwaysFail: false,
 *    endpoint: 'logout',
 *    method: 'delete',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['You have been successfully logged out.'],
 *  };
 *  refreshToken?: boolean | NbPasswordStrategyModule = {
 *    endpoint: 'refresh-token',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: null,
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Your token has been successfully refreshed.'],
 *  };
 *  token?: NbPasswordStrategyToken = {
 *    class: NbAuthSimpleToken,
 *    key: 'data.token',
 *    getter: (module, res, options) => getDeepFromObject(res.body, options.token.key),
 *  };
 *  errors?: NbPasswordStrategyMessage = {
 *    key: 'data.errors',
 *    getter: (module, res, options) =>
 *      nbAuthMessages(getDeepFromObject(res.error, options.errors.key, options[module].defaultErrors)),
 *  };
 *  messages?: NbPasswordStrategyMessage = {
 *    key: 'data.messages',
 *    getter: (module, res, options) =>
 *      nbAuthMessages(getDeepFromObject(res.body, options.messages.key, options[module].defaultMessages)),
 *  };
 *  validation?: {
 *    password?: {
 *      required?: boolean;
 *      minLength?: number;
 *      maxLength?: number;
 *      regexp?: string;
 *    };
 *    email?: {
 *      required?: boolean;
 *      regexp?: string;
 *    };
 *    fullName?: {
 *      required?: boolean;
 *      minLength?: number;
 *      maxLength?: number;
 *      regexp?: string;
 *    };
 *  };
 *}
 * ```
 */
@Service({ autoProvided: false })
export class NbPasswordAuthStrategy extends NbAuthStrategy<NbPasswordAuthStrategyOptions> {
    protected readonly http = inject(HttpClient)
    private readonly route = inject(ActivatedRoute)

    protected override defaultOptions: NbPasswordAuthStrategyOptions = passwordStrategyOptions

    static setup(options: NbPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbPasswordAuthStrategyOptions] {
        return [NbPasswordAuthStrategy, options]
    }

    authenticate(data?: unknown): Observable<NbAuthResult> {
        const module = 'login'
        const method = this.getOption(`${module}.method`) ?? 'post'
        const url = this.getActionEndpoint(module)
        const requireValidToken = this.getOption(`${module}.requireValidToken`)
        return this.http.request(method, url, { body: data, observe: 'response', headers: this.getHeaders() }).pipe(
            map((res) => {
                if (this.getOption(`${module}.alwaysFail`)) {
                    throw this.createFailResponse(data)
                }
                return res
            }),
            map((res) => new NbAuthResult(
                true,
                res,
                this.getOption(`${module}.redirect.success`),
                [],
                this.readMessages(module, res),
                this.createToken(this.readToken(module, res), requireValidToken)
            )),
            catchError((res) => this.handleResponseError(res, module))
        )
    }

    register(data?: unknown): Observable<NbAuthResult> {
        const module = 'register'
        const method = this.getOption(`${module}.method`) ?? 'post'
        const url = this.getActionEndpoint(module)
        const requireValidToken = this.getOption(`${module}.requireValidToken`)
        return this.http.request(method, url, { body: data, observe: 'response', headers: this.getHeaders() }).pipe(
            map((res) => {
                if (this.getOption(`${module}.alwaysFail`)) {
                    throw this.createFailResponse(data)
                }

                return res
            }),
            map((res) => new NbAuthResult(
                true,
                res,
                this.getOption(`${module}.redirect.success`),
                [],
                this.readMessages(module, res),
                this.createToken(this.readToken('login', res), requireValidToken)
            )),
            catchError((res) => this.handleResponseError(res, module))
        )
    }

    requestPassword(data?: unknown): Observable<NbAuthResult> {
        const module = 'requestPass'
        const method = this.getOption(`${module}.method`) ?? 'post'
        const url = this.getActionEndpoint(module)
        return this.http.request(method, url, { body: data, observe: 'response', headers: this.getHeaders() }).pipe(
            map((res) => {
                if (this.getOption(`${module}.alwaysFail`)) {
                    throw this.createFailResponse()
                }

                return res
            }),
            map((res) => new NbAuthResult(
                true,
                res,
                this.getOption(`${module}.redirect.success`),
                [],
                this.readMessages(module, res)
            )),
            catchError((res) => this.handleResponseError(res, module))
        )
    }

    /** Sends the data with the reset password token of the page's query, under the options' `resetPasswordTokenKey`. */
    resetPassword(data: Record<string, unknown> = {}): Observable<NbAuthResult> {
        const module = 'resetPass'
        const method = this.getOption(`${module}.method`) ?? 'put'
        const url = this.getActionEndpoint(module)
        const tokenKey = this.getOption(`${module}.resetPasswordTokenKey`) ?? ''
        data[tokenKey] = this.route.snapshot.queryParams[tokenKey]
        return this.http.request(method, url, { body: data, observe: 'response', headers: this.getHeaders() }).pipe(
            map((res) => {
                if (this.getOption(`${module}.alwaysFail`)) {
                    throw this.createFailResponse()
                }

                return res
            }),
            map((res) => new NbAuthResult(
                true,
                res,
                this.getOption(`${module}.redirect.success`),
                [],
                this.readMessages(module, res)
            )),
            catchError((res) => this.handleResponseError(res, module))
        )
    }

    logout(): Observable<NbAuthResult> {
        const module = 'logout'
        const method = this.getOption(`${module}.method`) ?? 'delete'
        const url = this.getActionEndpoint(module)

        return observableOf({}).pipe(
            switchMap((res: object) => {
                if (!url) {
                    return observableOf(res)
                }
                return this.http.request(method, url, { observe: 'response', headers: this.getHeaders() })
            }),
            map((res) => {
                if (this.getOption(`${module}.alwaysFail`)) {
                    throw this.createFailResponse()
                }

                return res
            }),
            map((res) => new NbAuthResult(
                true,
                res,
                this.getOption(`${module}.redirect.success`),
                [],
                this.readMessages(module, res)
            )),
            catchError((res) => this.handleResponseError(res, module))
        )
    }

    refreshToken(data?: unknown): Observable<NbAuthResult> {
        const module = 'refreshToken'
        const method = this.getOption(`${module}.method`) ?? 'post'
        const url = this.getActionEndpoint(module)
        const requireValidToken = this.getOption(`${module}.requireValidToken`)

        return this.http.request(method, url, { body: data, observe: 'response', headers: this.getHeaders() }).pipe(
            map((res) => {
                if (this.getOption(`${module}.alwaysFail`)) {
                    throw this.createFailResponse(data)
                }

                return res
            }),
            map((res) => new NbAuthResult(
                true,
                res,
                this.getOption(`${module}.redirect.success`),
                [],
                this.readMessages(module, res),
                this.createToken(this.readToken(module, res), requireValidToken)
            )),
            catchError((res) => this.handleResponseError(res, module))
        )
    }

    /** The messages of a module's response, as the options' messages getter reads them. */
    protected readMessages(module: NbPasswordStrategyModuleName, res: unknown): string[] | undefined {
        const options = this.options
        const getter = options?.messages?.getter
        return options && getter ? getter(module, res, options) : undefined
    }

    /** The token value of a module's response, as the options' token getter reads it. */
    protected readToken(module: NbPasswordStrategyModuleName, res: HttpResponse<unknown>): unknown {
        const options = this.options
        const getter = options?.token?.getter
        return options && getter ? getter(module, res, options) : undefined
    }

    /** A failed module's result, with the errors of the options' errors getter for an error response. */
    protected handleResponseError(res: unknown, module: NbPasswordStrategyModuleName): Observable<NbAuthResult> {
        let errors = new Array<string>()
        const options = this.options
        const getter = options?.errors?.getter
        if (res instanceof HttpErrorResponse) {
            errors = options && getter ? getter(module, res, options) : []
        } else if (res instanceof NbAuthIllegalTokenError) {
            errors.push(res.message)
        } else {
            errors.push(this.texts().unknownError)
        }
        return observableOf(new NbAuthResult(false, res, this.getOption(`${module}.redirect.failure`), errors))
    }
}
