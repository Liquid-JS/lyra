import { Routes } from '@angular/router'

export const USER_ROUTES: Routes = [
    {
        path: 'user-showcase.component',
        loadComponent: () => import('./user-showcase.component').then((m) => m.UserShowcaseComponent)
    },
    {
        path: 'user-sizes.component',
        loadComponent: () => import('./user-sizes.component').then((m) => m.UserSizesComponent)
    },
    {
        path: 'user-avatar-settings.component',
        loadComponent: () => import('./user-avatar-settings.component').then((m) => m.UserAvatarSettingsComponent)
    },
    {
        path: 'user-hide-captions.component',
        loadComponent: () => import('./user-hide-captions.component').then((m) => m.UserHideCaptionsComponent)
    },
    {
        path: 'user-shape.component',
        loadComponent: () => import('./user-shape.component').then((m) => m.NbUserShapeComponent)
    }
]
