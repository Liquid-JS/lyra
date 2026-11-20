import { Routes } from '@angular/router'

export const QR_CODE_ROUTES: Routes = [
    {
        path: 'qr-code-showcase.component',
        loadComponent: () => import('./qr-code-showcase.component').then((m) => m.QrCodeShowcaseComponent)
    },
    {
        path: 'qr-code-download.component',
        loadComponent: () => import('./qr-code-download.component').then((m) => m.QrCodeDownloadComponent)
    }
]
