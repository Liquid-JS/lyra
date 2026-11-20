import { Injector, ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';

import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
} from '@liquid-js/lyr-core';

import { NbAuthService } from './services/auth.service';
import { NbAuthSimpleToken, NbAuthTokenClass } from './services/token/token';
import { NbTokenLocalStorage, NbTokenStorage } from './services/token/token-storage';
import { NbTokenService } from './services/token/token.service';
import { NbAuthTokenParceler, NB_AUTH_FALLBACK_TOKEN } from './services/token/token-parceler';
import { NbAuthStrategy } from './strategies/auth-strategy';
import { NbAuthStrategyOptions } from './strategies/auth-strategy-options';
import { NbDummyAuthStrategy } from './strategies/dummy/dummy-strategy';
import { NbOAuth2AuthStrategy } from './strategies/oauth2/oauth2-strategy';
import { NbPasswordAuthStrategy } from './strategies/password/password-strategy';

import {
  defaultAuthOptions,
  NB_AUTH_INTERCEPTOR_HEADER,
  NB_AUTH_OPTIONS,
  NB_AUTH_STRATEGIES,
  NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
  NB_AUTH_TOKENS,
  NB_AUTH_USER_OPTIONS,
  NbAuthOptions,
  NbAuthResolvedOptions,
  NbAuthStrategyClass,
} from './auth.options';

import { NbAuthComponent } from './components/auth.component';

import { NbAuthBlockComponent } from './components/auth-block/auth-block.component';
import { NbLoginComponent } from './components/login/login.component';
import { NbRegisterComponent } from './components/register/register.component';
import { NbLogoutComponent } from './components/logout/logout.component';
import { NbRequestPasswordComponent } from './components/request-password/request-password.component';
import { NbResetPasswordComponent } from './components/reset-password/reset-password.component';

import { deepExtend } from './helpers';

export function nbStrategiesFactory(options: NbAuthResolvedOptions, injector: Injector): NbAuthStrategy[] {
  const strategies = new Array<NbAuthStrategy>();
  options.strategies
    .forEach(([strategyClass, strategyOptions]: [NbAuthStrategyClass, NbAuthStrategyOptions]) => {
      const strategy: NbAuthStrategy = injector.get(strategyClass);
      strategy.setOptions(strategyOptions);

      strategies.push(strategy);
    });
  return strategies;
}

export function nbTokensFactory(strategies: NbAuthStrategy[]): NbAuthTokenClass[] {
  const tokens = new Array<NbAuthTokenClass>();
  strategies
    .forEach((strategy: NbAuthStrategy) => {
      const tokenClass = strategy.getOption('token.class');
      if (tokenClass) {
        tokens.push(tokenClass);
      }
    });
  return tokens;
}

export function nbOptionsFactory(options?: NbAuthOptions): NbAuthResolvedOptions {
  // Into a new object: the defaults are shared by every provideNbAuth().
  return deepExtend({}, defaultAuthOptions, options);
}

export function nbNoOpInterceptorFilter(_req: HttpRequest<unknown>): boolean {
  return true;
}

/**
 * Provides the auth services, strategies and tokens, in place of `NbAuthModule.forRoot()`.
 */
export function provideNbAuth(nbAuthOptions?: NbAuthOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NB_AUTH_USER_OPTIONS, useValue: nbAuthOptions },
    { provide: NB_AUTH_OPTIONS, useFactory: nbOptionsFactory, deps: [NB_AUTH_USER_OPTIONS] },
    { provide: NB_AUTH_STRATEGIES, useFactory: nbStrategiesFactory, deps: [NB_AUTH_OPTIONS, Injector] },
    { provide: NB_AUTH_TOKENS, useFactory: nbTokensFactory, deps: [NB_AUTH_STRATEGIES] },
    { provide: NB_AUTH_FALLBACK_TOKEN, useValue: NbAuthSimpleToken },
    { provide: NB_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization' },
    { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: nbNoOpInterceptorFilter },
    { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
    NbAuthTokenParceler,
    NbAuthService,
    NbTokenService,
    NbDummyAuthStrategy,
    NbPasswordAuthStrategy,
    NbOAuth2AuthStrategy,
  ]);
}

@NgModule({
  imports: [
    NbLayoutModule,
    NbCardModule,
    NbCheckboxModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    RouterModule,
    FormsModule,
    NbIconModule,
    NbAuthComponent,
    NbAuthBlockComponent,
    NbLoginComponent,
    NbRegisterComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent,
    NbLogoutComponent,
  ],
  exports: [
    NbAuthComponent,
    NbAuthBlockComponent,
    NbLoginComponent,
    NbRegisterComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent,
    NbLogoutComponent,
  ],
})
export class NbAuthModule {
  static forRoot(nbAuthOptions?: NbAuthOptions): ModuleWithProviders<NbAuthModule> {
    return { ngModule: NbAuthModule, providers: [provideNbAuth(nbAuthOptions)] };
  }
}
