import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import {
    NbAuthResult,
    NbAuthService,
    NB_AUTH_OPTIONS,
    nbAuthCreateToken,
    NbAuthJWTToken,
    NbAuthOAuth2Token,
    NbAuthBlockComponent,
    NbAuthCredentials,
    NbAuthFormMessagesOptions,
    NbAuthResolvedOptions,
    NbPath,
    NbPathValue,
    getDeepFromObject
} from '@liquid-js/lyr-auth'
import {
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbCardComponent,
    NbCardBodyComponent,
    NbAlertComponent,
    NbInputDirective,
    NbButtonComponent
} from '@liquid-js/lyr-core'
import { FormsModule } from '@angular/forms'
import { JsonPipe } from '@angular/common'

@Component({
    selector: 'nb-oauth2-password-login',
    templateUrl: './oauth2-password-login.component.html',
    styleUrls: ['./oauth2-password-login.component.scss'],
    imports: [
        NbButtonComponent,
        NbLayoutComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardBodyComponent,
        NbAuthBlockComponent,
        NbAlertComponent,
        FormsModule,
        NbInputDirective,
        JsonPipe
    ]
})
export class OAuth2PasswordLoginComponent {
    private readonly authService = inject(NbAuthService)
    protected readonly options = inject(NB_AUTH_OPTIONS)
    protected readonly router = inject(Router)

    readonly token = signal<NbAuthOAuth2Token | undefined>(undefined)
    redirectDelay = 0
    showMessages: NbAuthFormMessagesOptions = { success: false, error: false }
    strategy = ''

    readonly errors = signal<string[]>([])
    readonly messages = signal<string[]>([])
    user: NbAuthCredentials = {}
    readonly submitted = signal(false)

    constructor() {
        this.redirectDelay = this.getConfigValue('forms.login.redirectDelay')
        this.showMessages = this.getConfigValue('forms.login.showMessages')
        this.strategy = this.getConfigValue('forms.login.strategy')
    }

    login() {
        this.errors.set([])
        this.messages.set([])
        this.submitted.set(true)

        this.authService.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
            this.submitted.set(false)
            this.token.set(result.getToken() as NbAuthOAuth2Token)
            if (result.isSuccess()) {
                this.messages.set(result.getMessages())
            } else {
                this.errors.set(result.getErrors())
            }

            const redirect = result.getRedirect()
            if (redirect) {
                setTimeout(() => this.router.navigateByUrl(redirect), this.redirectDelay)
            }
        })
    }

    logout() {
        this.authService.logout('password').subscribe(() => {
            this.token.set(undefined)
        })
    }

    getConfigValue<P extends NbPath<NbAuthResolvedOptions>>(key: P): NbPathValue<NbAuthResolvedOptions, P> {
        return getDeepFromObject(this.options, key)
    }

    getClaims(rawToken: string) {
        if (!rawToken) {
            return undefined
        }
        return nbAuthCreateToken(NbAuthJWTToken, rawToken, this.strategy).getPayload()
    }
}
