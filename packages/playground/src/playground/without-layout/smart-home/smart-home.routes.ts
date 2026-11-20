import { Routes } from '@angular/router'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideNbAuth, NbDummyAuthStrategy } from '@liquid-js/lyr-auth'

export const SMART_HOME_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbAuth({
                strategies: [
                    NbDummyAuthStrategy.setup({
                        name: 'email',
                        alwaysFail: true,
                        delay: 1000
                    })
                ]
            }),
            provideHttpClient(withInterceptorsFromDi())
        ],
        children: [
            {
                path: '',
                loadComponent: () => import('./app.component').then((m) => m.AppComponent)
            },
            {
                path: 'auth',
                loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES)
            }
        ]
    }
]
