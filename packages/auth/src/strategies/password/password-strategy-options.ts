import { NbAuthSimpleToken } from '../../services/token/token';
import { NbAuthStrategyOptions, NbStrategyToken } from '../auth-strategy-options';
import { getDeepFromObject, nbAuthMessages } from '../../helpers';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

/** The modules (actions) of the password strategy, as its options name them. */
export type NbPasswordStrategyModuleName = 'login' | 'register' | 'requestPass' | 'resetPass' | 'logout' | 'refreshToken';

export interface NbPasswordStrategyModule {
  alwaysFail?: boolean;
  endpoint?: string;
  method?: string;
  /** Where to go after the action; `null` turns a default redirect off, while a missing one keeps the default. */
  redirect?: {
    success?: string | null;
    failure?: string | null;
  };
  requireValidToken?: boolean;
  defaultErrors?: string[];
  defaultMessages?: string[];
}

export interface NbPasswordStrategyReset extends NbPasswordStrategyModule {
  resetPasswordTokenKey?: string;
}

export interface NbPasswordStrategyToken extends NbStrategyToken {
  key?: string;
  /** Reads the token value from a successful response of the given module (action). */
  getter?(module: string, res: HttpResponse<unknown>, options: NbPasswordAuthStrategyOptions): unknown;
}

export interface NbPasswordStrategyMessage {
  key?: string;
  /**
   * Reads the messages from a successful response, or the errors from a failed one, of the given module (action). The
   * response is the strategy's own: an `HttpResponse` or `HttpErrorResponse` in the password strategy.
   */
  getter?(module: string, res: unknown, options: NbAuthStrategyOptions): string[];
}

/**
 * The options a getter is called with: the defaults merged with the configured ones, so the getter's key is set.
 */
type NbPasswordStrategyOptionsWithKey<K extends 'token' | 'errors' | 'messages'> = NbPasswordAuthStrategyOptions
  & Record<K, { key: string }>;

export class NbPasswordAuthStrategyOptions extends NbAuthStrategyOptions {
  baseEndpoint?: string = '/api/auth/';
  login?: boolean | NbPasswordStrategyModule = {
    alwaysFail: false,
    endpoint: 'login',
    method: 'post',
    requireValidToken: true,
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Login/Email combination is not correct, please try again.'],
    defaultMessages: ['You have been successfully logged in.'],
  };
  register?: boolean | NbPasswordStrategyModule = {
    alwaysFail: false,
    endpoint: 'register',
    method: 'post',
    requireValidToken: true,
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully registered.'],
  };
  requestPass?: boolean | NbPasswordStrategyModule = {
    endpoint: 'request-pass',
    method: 'post',
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Reset password instructions have been sent to your email.'],
  };
  resetPass?: boolean | NbPasswordStrategyReset = {
    endpoint: 'reset-pass',
    method: 'put',
    redirect: {
      success: '/',
      failure: null,
    },
    resetPasswordTokenKey: 'reset_password_token',
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your password has been successfully changed.'],
  };
  logout?: boolean | NbPasswordStrategyReset = {
    alwaysFail: false,
    endpoint: 'logout',
    method: 'delete',
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully logged out.'],
  };
  refreshToken?: boolean | NbPasswordStrategyModule = {
    endpoint: 'refresh-token',
    method: 'post',
    requireValidToken: true,
    redirect: {
      success: null,
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your token has been successfully refreshed.'],
  };
  override token?: NbPasswordStrategyToken = {
    class: NbAuthSimpleToken,
    key: 'data.token',
    getter: (module: string, res: HttpResponse<unknown>, options: NbPasswordStrategyOptionsWithKey<'token'>) =>
      getDeepFromObject(res.body, options.token.key),
  };
  errors?: NbPasswordStrategyMessage = {
    key: 'data.errors',
    getter: (module: string, res: HttpErrorResponse, options: NbPasswordStrategyOptionsWithKey<'errors'>) =>
      nbAuthMessages(
        getDeepFromObject(res.error, options.errors.key, getDeepFromObject(options, `${module}.defaultErrors`)),
      ),
  };
  messages?: NbPasswordStrategyMessage = {
    key: 'data.messages',
    getter: (module: string, res: HttpResponse<unknown>, options: NbPasswordStrategyOptionsWithKey<'messages'>) =>
      nbAuthMessages(
        getDeepFromObject(res.body, options.messages.key, getDeepFromObject(options, `${module}.defaultMessages`)),
      ),
  };
  validation?: {
    password?: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      regexp?: string;
    };
    email?: {
      required?: boolean;
      regexp?: string;
    };
    fullName?: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      regexp?: string;
    };
  };
}

export const passwordStrategyOptions: NbPasswordAuthStrategyOptions = new NbPasswordAuthStrategyOptions();
