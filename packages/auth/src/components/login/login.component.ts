import { ChangeDetectorRef, Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import {
    NbAlertComponent,
    NbInputDirective,
    NbCheckboxComponent,
    NbButtonComponent,
    NbIconComponent
} from '@liquid-js/lyr-core'
import { FormsModule } from '@angular/forms'
import { NB_AUTH_OPTIONS, NbAuthFormMessagesOptions, NbAuthResolvedOptions, NbAuthSocialLink } from '../../auth.options'
import { getDeepFromObject, NbPath, NbPathValue } from '../../helpers'

import { NbAuthService } from '../../services/auth.service'
import { NbAuthResult } from '../../services/auth-result'
import { NbAuthCredentials } from '../../models/user'
import { injectNbAuthTexts } from '../../texts'

@Component({
    selector: 'nb-login',
    templateUrl: './login.component.html',
    imports: [
        NbAlertComponent,
        FormsModule,
        NbInputDirective,
        RouterLink,
        NbCheckboxComponent,
        NbButtonComponent,
        NbIconComponent
    ]
})
export class NbLoginComponent {
    protected readonly texts = injectNbAuthTexts()

    protected readonly service = inject(NbAuthService)
    protected readonly options = inject(NB_AUTH_OPTIONS)
    protected readonly cd = inject(ChangeDetectorRef)
    protected readonly router = inject(Router)

    redirectDelay: number = this.getConfigValue('forms.login.redirectDelay')
    showMessages: NbAuthFormMessagesOptions = this.getConfigValue('forms.login.showMessages')
    strategy: string = this.getConfigValue('forms.login.strategy')

    errors = new Array<string>()
    messages = new Array<string>()
    // Remembered unless the user unticks it.
    user: NbAuthCredentials = { rememberMe: true }
    submitted = false
    socialLinks: NbAuthSocialLink[] = this.getConfigValue('forms.login.socialLinks')
    rememberMe: boolean = this.getConfigValue('forms.login.rememberMe')

    login() {
        this.errors = []
        this.messages = []
        this.submitted = true

        this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
            this.submitted = false

            if (result.isSuccess()) {
                this.messages = result.getMessages()
            } else {
                this.errors = result.getErrors()
            }

            const redirect = result.getRedirect()
            if (redirect) {
                setTimeout(() => this.router.navigateByUrl(redirect), this.redirectDelay)
            }
            this.cd.detectChanges()
        })
    }

    getConfigValue<P extends NbPath<NbAuthResolvedOptions>>(key: P): NbPathValue<NbAuthResolvedOptions, P> {
        return getDeepFromObject(this.options, key)
    }
}
