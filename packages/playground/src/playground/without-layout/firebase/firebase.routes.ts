import { Routes } from '@angular/router'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getAuth, provideAuth } from '@angular/fire/auth'
import { getDatabase, provideDatabase } from '@angular/fire/database'
import {
    provideNbFirebaseAuth,
    NbFirebasePasswordStrategy,
    NbFirebaseGoogleStrategy
} from '@liquid-js/lyr-firebase-auth'
import { provideNbAuth } from '@liquid-js/lyr-auth'
import { FirebaseAPIService } from './firebase-api.service'

export const FIREBASE_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideNbFirebaseAuth(),
            provideNbAuth({
                forms: {
                    login: {
                        strategy: 'password',
                        rememberMe: true,
                        socialLinks: []
                    },
                    register: {
                        strategy: 'password',
                        terms: true,
                        socialLinks: []
                    },
                    logout: {
                        strategy: 'password'
                    },
                    requestPassword: {
                        strategy: 'password',
                        socialLinks: []
                    },
                    resetPassword: {
                        strategy: 'password',
                        socialLinks: []
                    },
                    validation: {
                        password: {
                            required: true,
                            minLength: 6,
                            maxLength: 50
                        },
                        email: {
                            required: true
                        },
                        fullName: {
                            required: false,
                            minLength: 4,
                            maxLength: 50
                        }
                    }
                },
                strategies: [
                    NbFirebasePasswordStrategy.setup({
                        name: 'password',
                        login: {
                            redirect: {
                                success: 'example/firebase/password-showcase'
                            }
                        },
                        register: {
                            redirect: {
                                success: 'example/firebase/password-showcase'
                            }
                        },
                        logout: {
                            redirect: {
                                success: 'example/firebase/login'
                            }
                        },
                        requestPassword: {
                            redirect: {
                                success: 'example/firebase/login'
                            }
                        },
                        resetPassword: {
                            redirect: {
                                success: 'example/firebase/login'
                            }
                        }
                    }),
                    NbFirebaseGoogleStrategy.setup({
                        name: 'google'
                    })
                ]
            }),
            provideFirebaseApp(() => initializeApp({
                apiKey: 'AIzaSyBEvySH74-sISCTkCC6lXUd3zzYj26GjRk',
                authDomain: 'auth-sample-f48f1.firebaseapp.com',
                databaseURL: 'https://auth-sample-f48f1.firebaseio.com',
                projectId: 'auth-sample-f48f1',
                storageBucket: 'auth-sample-f48f1.appspot.com',
                messagingSenderId: '246754092661',
                appId: '1:246754092661:web:c2606b9ecdbed579673a3c'
            })),
            provideAuth(() => getAuth()),
            provideDatabase(() => getDatabase()),
            FirebaseAPIService
        ],
        children: [
            {
                path: '',
                loadComponent: () => import('./firebase-playground.component').then((m) => m.FirebasePlaygroundComponent),
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
                path: 'password-showcase',
                loadComponent: () => import('./password-auth-showcase/password-auth-showcase.component').then((m) => m.PasswordAuthShowcaseComponent)
            },
            {
                path: 'social-auth-showcase',
                loadComponent: () => import('./identity-proders-auth-showcase/identity-providers-auth-showcase.component').then((m) => m.IdentityProvidersAuthShowcaseComponent)
            }
        ]
    }
]
