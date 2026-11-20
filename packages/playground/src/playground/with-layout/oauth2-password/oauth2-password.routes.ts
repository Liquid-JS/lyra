import { Routes } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  provideNbAuth,
  NbAuthOAuth2JWTToken,
  NbOAuth2AuthStrategy,
  NbOAuth2ClientAuthMethod,
  NbOAuth2GrantType,
} from '@liquid-js/lyr-auth';

export const OAUTH2_PASSWORD_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideNbAuth({
        forms: {
          login: {
            redirectDelay: 3000,
            showMessages: {
              error: true,
              success: false,
            },
            strategy: 'password',
          },
        },
        strategies: [
          NbOAuth2AuthStrategy.setup({
            name: 'password',
            clientId: 'Aladdin',
            clientSecret: 'open sesame',
            clientAuthMethod: NbOAuth2ClientAuthMethod.BASIC,
            baseEndpoint: 'http://localhost:4400/api/auth/',
            token: {
              endpoint: 'token',
              grantType: NbOAuth2GrantType.PASSWORD,
              class: NbAuthOAuth2JWTToken,
              requireValidToken: true,
            },
            redirect: {
              success: '/oauth2-password',
            },
          }),
        ],
      }),
      provideHttpClient(withInterceptorsFromDi()),
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./oauth2-password-login.component').then((m) => m.OAuth2PasswordLoginComponent),
      },
    ],
  },
];
