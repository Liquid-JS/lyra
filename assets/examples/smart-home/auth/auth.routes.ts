import { Routes } from '@angular/router'

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('@liquid-js/lyr-auth').then((m) => m.NbAuthComponent),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent)
            }
        ]
    }
]
