import { Routes } from '@angular/router'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideNbAuth } from '@liquid-js/lyr-auth'
import { AuthAzureToken, AzureADB2CAuthStrategy } from './azure-adb2c-auth-strategy'

export const AZURE_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbAuth({
                strategies: [
                    AzureADB2CAuthStrategy.setup({
                        name: 'azure',
                        // Your app's own registration in your Azure AD B2C tenant, for the redirect URI below.
                        clientId: 'YOUR_APPLICATION_ID',
                        clientSecret: '',
                        authorize: {
                            endpoint: 'https://login.microsoftonline.com/YOUR_TENANT_ID/oauth2/authorize',
                            responseType: 'id_token',
                            scope: 'openid',
                            redirectUri: 'https://liquid-js.github.io/lyra/example/azure/callback',
                            params: {
                                p: 'B2C_1_YOUR_POLICY'
                            }
                        },
                        token: {
                            class: AuthAzureToken
                        },
                        redirect: {
                            success: '/example/azure'
                        }
                    })
                ]
            }),
            provideHttpClient(withInterceptorsFromDi()),
            AzureADB2CAuthStrategy
        ],
        children: [
            {
                path: '',
                loadComponent: () => import('./azure-login.component').then((m) => m.AzureLoginComponent)
            },
            {
                path: 'callback',
                loadComponent: () => import('./azure-callback.component').then((m) => m.AzureCallbackComponent)
            }
        ]
    }
]
