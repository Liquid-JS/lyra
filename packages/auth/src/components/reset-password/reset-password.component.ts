import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthFormMessagesOptions, NbAuthResolvedOptions } from '../../auth.options';
import { getDeepFromObject, NbPath, NbPathValue } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import { NbAuthCredentials } from '../../models/user';
import {
  NbAlertComponent,
  NbInputDirective,
  NbButtonComponent,
} from '@liquid-js/lyr-core';
import { FormsModule } from '@angular/forms';
import { injectNbAuthTexts } from '../../texts';

@Component({
  selector: 'nb-reset-password-page',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
  imports: [
    NbAlertComponent,
    FormsModule,
    NbInputDirective,
    NbButtonComponent,
    RouterLink,
  ],
})
export class NbResetPasswordComponent {
  protected readonly texts = injectNbAuthTexts();

  protected readonly service = inject(NbAuthService);
  protected readonly options = inject(NB_AUTH_OPTIONS);
  protected readonly cd = inject(ChangeDetectorRef);
  protected readonly router = inject(Router);

  redirectDelay: number = this.getConfigValue('forms.resetPassword.redirectDelay');
  showMessages: NbAuthFormMessagesOptions = this.getConfigValue('forms.resetPassword.showMessages');
  strategy: string = this.getConfigValue('forms.resetPassword.strategy');

  submitted = false;
  errors = new Array<string>();
  messages = new Array<string>();
  user: NbAuthCredentials = {};

  resetPass() {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.resetPassword(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  getConfigValue<P extends NbPath<NbAuthResolvedOptions>>(key: P): NbPathValue<NbAuthResolvedOptions, P> {
    return getDeepFromObject(this.options, key);
  }
}
