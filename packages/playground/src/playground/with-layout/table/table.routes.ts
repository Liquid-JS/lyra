import { Routes } from '@angular/router'

export const TABLE_ROUTES: Routes = [
    {
        path: 'table-showcase.component',
        loadComponent: () => import('./table-showcase.component').then((m) => m.TableShowcaseComponent)
    },
    {
        path: 'table-server.component',
        loadComponent: () => import('./table-server.component').then((m) => m.TableServerComponent)
    },
    {
        path: 'table-selection.component',
        loadComponent: () => import('./table-selection.component').then((m) => m.TableSelectionComponent)
    }
]
