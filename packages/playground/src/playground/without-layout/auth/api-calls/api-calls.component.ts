import { Component, inject, signal } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Router, RouterOutlet } from '@angular/router'
import { of as observableOf } from 'rxjs'
import { catchError, delay } from 'rxjs/operators'
import { NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@liquid-js/lyr-auth'
import {
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbCardComponent,
    NbCardBodyComponent,
    NbCardHeaderComponent,
    NbListComponent,
    NbListItemComponent,
    NbButtonComponent
} from '@liquid-js/lyr-core'
import { Wine } from './wine'

@Component({
    selector: 'nb-playground-api-calls',
    templateUrl: './api-calls.component.html',
    imports: [
        NbButtonComponent,
        RouterOutlet,
        NbLayoutComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardBodyComponent,
        NbCardHeaderComponent,
        NbListComponent,
        NbListItemComponent
    ]
})
export class PlaygroundApiCallsComponent {
    private readonly authService = inject(NbAuthService)
    private readonly http = inject(HttpClient)
    private readonly router = inject(Router)
    protected readonly options = inject(NB_AUTH_OPTIONS)

    token?: NbAuthToken
    readonly wines = signal<Wine[]>([])
    redirectDelay = 0
    strategy = ''

    constructor() {
        this.redirectDelay = this.options.forms.logout.redirectDelay
        this.strategy = this.options.forms.logout.strategy

        this.authService.onTokenChange().subscribe((token: NbAuthToken) => {
            this.token = undefined
            if (token && token.isValid()) {
                this.token = token
            }
        })
    }

    logout() {
        this.authService
            .logout(this.strategy)
            .pipe(delay(this.redirectDelay))
            .subscribe(() => this.router.navigate(['/auth/login']))
    }

    loadWines() {
        this.http
            .get<Wine[]>('http://localhost:4400/api/wines')
            .pipe(
                catchError((err) => {
                    if (err instanceof HttpErrorResponse && err.status === 401) {
                        void this.router.navigate(['/auth/login'])
                    }
                    return observableOf([])
                })
            )
            .subscribe((wines) => this.wines.set(wines))
    }
}
