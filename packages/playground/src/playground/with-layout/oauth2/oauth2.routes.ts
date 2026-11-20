import { Routes } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideNbAuth, NbOAuth2AuthStrategy, NbOAuth2ResponseType } from '@liquid-js/lyr-auth';

export const OAUTH2_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideNbAuth({
        strategies: [
          NbOAuth2AuthStrategy.setup({
            name: 'google',
            // Your app's own OAuth client ID from Google Cloud, for the redirect URI below.
            clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
            clientSecret: '',
            authorize: {
              endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
              responseType: NbOAuth2ResponseType.TOKEN,
              scope: 'https://www.googleapis.com/auth/userinfo.profile',
              redirectUri: 'https://liquid-js.github.io/lyra/example/oauth2/callback',
            },
            redirect: {
              success: '/example/oauth2',
            },
          }),
        ],
      }),
      provideHttpClient(withInterceptorsFromDi()),
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./oauth2-login.component').then((m) => m.OAuth2LoginComponent),
      },
      {
        path: 'callback',
        loadComponent: () => import('./oauth2-callback.component').then((m) => m.OAuth2CallbackComponent),
      },
    ],
  },
];
