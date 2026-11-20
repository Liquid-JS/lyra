import { Routes } from '@angular/router'
import { HTTP_INTERCEPTORS, HttpRequest, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import {
    provideNbAuth,
    NbAuthJWTToken,
    NbPasswordAuthStrategy,
    NbDummyAuthStrategy,
    NbAuthJWTInterceptor,
    NbOAuth2GrantType,
    NbOAuth2AuthStrategy,
    NbAuthOAuth2Token,
    NB_AUTH_TOKEN_INTERCEPTOR_FILTER
} from '@liquid-js/lyr-auth'
import { provideNbSecurity, NbRoleProvider } from '@liquid-js/lyr-security'
import { AuthGuard } from './auth-guard.service'
import { CustomRoleProvider } from './role.provider'

export function filterInterceptorRequest(req: HttpRequest<any>) {
    return ['http://localhost:4400/api/auth/',
        'http://other.url/with/no/token/injected/'
    ]
        .some((url) => req.url.includes(url))
}

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbAuth({
                forms: {
                    login: {
                        strategy: 'password',
                        redirectDelay: 1000,
                        socialLinks: [
                            {
                                url: 'https://github.com/Liquid-JS/lyra',
                                target: '_blank',
                                title: 'GitHub'
                            },
                            {
                                url: 'https://liquid-js.github.io/lyra/',
                                target: '_blank',
                                title: 'Docs',
                                icon: 'home-outline'
                            },
                            {
                                url: 'https://github.com/Liquid-JS/lyra/issues',
                                target: '_blank',
                                title: 'Issues'
                            }
                        ]
                    }
                },
                strategies: [
                    NbDummyAuthStrategy.setup({
                        name: 'dummy',
                        alwaysFail: true,
                        delay: 1000
                    }),
                    NbPasswordAuthStrategy.setup({
                        name: 'email',
                        token: {
                            class: NbAuthJWTToken
                        },
                        baseEndpoint: 'http://localhost:4400/api/auth/',
                        logout: {
                            redirect: {
                                success: '/auth/login',
                                failure: '/auth/login'
                            }
                        },
                        requestPass: {
                            redirect: {
                                success: '/auth/reset-password'
                            }
                        },
                        resetPass: {
                            redirect: {
                                success: '/auth/login'
                            }
                        },
                        errors: {
                            key: 'data.errors'
                        }
                    }),
                    NbOAuth2AuthStrategy.setup({
                        name: 'password',
                        clientId: 'test',
                        clientSecret: 'secret',
                        baseEndpoint: 'http://localhost:4400/api/auth/',
                        token: {
                            endpoint: 'token',
                            grantType: NbOAuth2GrantType.PASSWORD,
                            class: NbAuthOAuth2Token
                        },
                        refresh: {
                            endpoint: 'refresh-token',
                            grantType: NbOAuth2GrantType.REFRESH_TOKEN
                        }
                    })
                ]
            }),
            provideNbSecurity({
                accessControl: {
                    guest: {
                        view: ['news', 'comments']
                    },
                    user: {
                        parent: 'guest',
                        create: 'comments'
                    },
                    moderator: {
                        parent: 'user',
                        create: 'news',
                        remove: '*'
                    }
                }
            }),
            provideHttpClient(withInterceptorsFromDi()),
            AuthGuard,
            { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
            { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: filterInterceptorRequest },
            { provide: NbRoleProvider, useClass: CustomRoleProvider }
        ],
        children: [
            {
                path: '',
                loadComponent: () => import('./auth.component').then((m) => m.AuthPlaygroundComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('@liquid-js/lyr-auth').then((m) => m.NbAuthComponent),
                        children: [
                            {
                                path: '',
                                redirectTo: 'login',
                                pathMatch: 'full'
                            },
                            {
                                path: 'login',
                                loadComponent: () => import('@liquid-js/lyr-auth').then((m) => m.NbLoginComponent)
                            },
                            {
                                path: 'register',
                                loadComponent: () => import('@liquid-js/lyr-auth').then((m) => m.NbRegisterComponent)
                            },
                            {
                                path: 'logout',
                                loadComponent: () => import('@liquid-js/lyr-auth').then((m) => m.NbLogoutComponent)
                            },
                            {
                                path: 'request-password',
                                loadComponent: () => import('@liquid-js/lyr-auth').then((m) => m.NbRequestPasswordComponent)
                            },
                            {
                                path: 'reset-password',
                                loadComponent: () => import('@liquid-js/lyr-auth').then((m) => m.NbResetPasswordComponent)
                            }
                        ]
                    }
                ]
            },
            {
                path: 'acl/acl-test.component',
                loadComponent: () => import('./acl/acl-test.component').then((m) => m.AclTestComponent)
            },
            {
                path: 'auth-guard.service',
                canActivate: [AuthGuard],
                loadComponent: () => import('./auth.component').then((m) => m.AuthPlaygroundComponent)
            },
            {
                path: 'api-calls.component',
                canActivate: [AuthGuard],
                loadComponent: () => import('./api-calls/api-calls.component').then((m) => m.PlaygroundApiCallsComponent)
            }
        ]
    }
]
