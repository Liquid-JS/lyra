import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NB_AUTH_OPTIONS, NbAuthResolvedOptions } from '../../auth.options';
import { getDeepFromObject, NbPath, NbPathValue } from '../../helpers';
import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import { injectNbAuthTexts } from '../../texts';

@Component({
  selector: 'nb-logout',
  templateUrl: './logout.component.html',
})
export class NbLogoutComponent implements OnInit {
  protected readonly texts = injectNbAuthTexts();

  protected readonly service = inject(NbAuthService);
  protected readonly options = inject(NB_AUTH_OPTIONS);
  protected readonly router = inject(Router);

  redirectDelay: number = this.getConfigValue('forms.logout.redirectDelay');
  strategy: string = this.getConfigValue('forms.logout.strategy');

  ngOnInit() {
    this.logout(this.strategy);
  }

  logout(strategy: string) {
    this.service.logout(strategy).subscribe((result: NbAuthResult) => {
      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue<P extends NbPath<NbAuthResolvedOptions>>(key: P): NbPathValue<NbAuthResolvedOptions, P> {
    return getDeepFromObject(this.options, key);
  }
}
