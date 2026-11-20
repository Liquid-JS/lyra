import { InjectionToken, Type } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { NbAuthStrategy } from './strategies/auth-strategy';
import { NbAuthStrategyOptions } from './strategies/auth-strategy-options';
import { NbAuthToken, NbAuthTokenClass } from './services/token/token';
import { NbAuthDeepPartial } from './helpers';

export type NbAuthStrategyClass = Type<NbAuthStrategy>;

export type NbAuthStrategies = [NbAuthStrategyClass, NbAuthStrategyOptions][];

export interface NbAuthSocialLink {
  link?: string;
  url?: string;
  target?: string;
  /** The link's text, or its accessible name when it shows an icon. */
  title?: string;
  /** An icon shown in place of the title. */
  icon?: string;
}

/** Whether a form shows the messages of a successful action, and the errors of a failed one. */
export interface NbAuthFormMessagesOptions {
  success: boolean;
  error: boolean;
}

/** The options of an auth form. */
export interface NbAuthFormOptions {
  /** The delay before the redirect after a successful action, while its message is shown, in milliseconds. */
  redirectDelay: number;
  /** The name of the strategy the form uses. */
  strategy: string;
  showMessages: NbAuthFormMessagesOptions;
  /** The social links at the bottom of the form. */
  socialLinks: NbAuthSocialLink[];
}

export interface NbAuthLoginFormOptions extends NbAuthFormOptions {
  /** Whether to show the "remember me" checkbox. */
  rememberMe: boolean;
}

export interface NbAuthRegisterFormOptions extends NbAuthFormOptions {
  /** Whether the user has to agree to the terms. */
  terms: boolean;
}

export interface NbAuthLogoutFormOptions {
  redirectDelay: number;
  strategy: string;
}

/** The limits of a field of the auth forms. */
export interface NbAuthFieldValidation {
  required: boolean;
}

/** The limits of a field of the auth forms with a length. */
export interface NbAuthLengthValidation extends NbAuthFieldValidation {
  minLength: number;
  maxLength: number;
}

export interface NbAuthValidationOptions {
  password: NbAuthLengthValidation;
  email: NbAuthFieldValidation;
  fullName: NbAuthLengthValidation;
}

/** The options of the auth forms, as the defaults give them. */
export interface NbAuthForms {
  login: NbAuthLoginFormOptions;
  register: NbAuthRegisterFormOptions;
  requestPassword: NbAuthFormOptions;
  resetPassword: NbAuthFormOptions;
  logout: NbAuthLogoutFormOptions;
  validation: NbAuthValidationOptions;
}

export interface NbAuthOptions {
  /** The options of the forms, over the defaults. */
  forms?: NbAuthDeepPartial<NbAuthForms>;
  strategies?: NbAuthStrategies;
}

/** The options the auth module works with: the given ones over `defaultAuthOptions`. */
export interface NbAuthResolvedOptions {
  forms: NbAuthForms;
  strategies: NbAuthStrategies;
}

const socialLinks = new Array<NbAuthSocialLink>();

export const defaultAuthOptions: NbAuthResolvedOptions = {
  strategies: [],
  forms: {
    login: {
      redirectDelay: 500,
      strategy: 'email', // the name of the strategy in `strategies`
      rememberMe: true,
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks: socialLinks,
    },
    register: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      terms: true,
      socialLinks: socialLinks,
    },
    requestPassword: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks: socialLinks,
    },
    resetPassword: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks: socialLinks,
    },
    logout: {
      redirectDelay: 500,
      strategy: 'email',
    },
    validation: {
      password: {
        required: true,
        minLength: 4,
        maxLength: 50,
      },
      email: {
        required: true,
      },
      fullName: {
        required: false,
        minLength: 4,
        maxLength: 50,
      },
    },
  },
};

export const NB_AUTH_OPTIONS = new InjectionToken<NbAuthResolvedOptions>('Lyra Auth Options');
export const NB_AUTH_USER_OPTIONS = new InjectionToken<NbAuthOptions>('Lyra User Auth Options');
export const NB_AUTH_STRATEGIES = new InjectionToken<NbAuthStrategy[]>('Lyra Auth Strategies');
export const NB_AUTH_TOKENS = new InjectionToken<NbAuthTokenClass<NbAuthToken>[]>('Lyra Auth Tokens');
export const NB_AUTH_INTERCEPTOR_HEADER = new InjectionToken<string>('Lyra Simple Interceptor Header');
export const NB_AUTH_TOKEN_INTERCEPTOR_FILTER =
  new InjectionToken<(req: HttpRequest<unknown>) => boolean>('Lyra Interceptor Filter');
