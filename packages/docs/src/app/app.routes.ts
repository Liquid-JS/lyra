import { Routes } from '@angular/router'

import { structure } from '../structure'
import { loadDocs } from './docs-data'
import { NGD_AREA } from './app.options'

export const routes: Routes = [
    {
        path: '',
        // The home page alone: as a prefix, the guard would load the data for every address, the examples' too.
        pathMatch: 'full',
        canMatch: [loadDocs],
        loadChildren: () => import('./home/home.routes').then((m) => m.HOME_ROUTES)
    },
    // Each docs area, e.g. /components, with its own sidebar.
    ...structure.map((area) => ({
        path: area.path,
        canMatch: [loadDocs],
        providers: [{ provide: NGD_AREA, useValue: area.path }],
        loadChildren: () => import('./documentation/documentation.routes').then((m) => m.documentationRoutes(area))
    })),
    // The live examples, in the docs' frames and on their own: the API data isn't needed, so they don't load it.
    {
        path: 'example',
        loadChildren: () => import('./example/example.routes').then((m) => m.EXAMPLE_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
]
