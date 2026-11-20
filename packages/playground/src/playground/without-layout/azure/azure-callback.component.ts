import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbAuthResult, NbAuthService } from '@liquid-js/lyr-auth';
import { Router } from '@angular/router';
import { NbLayoutComponent, NbLayoutColumnComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-playground-azure-callback',
  templateUrl: './azure-callback.component.html',
  imports: [NbLayoutComponent, NbLayoutColumnComponent],
})
export class AzureCallbackComponent {
  private readonly authService = inject(NbAuthService);
  private readonly router = inject(Router);

  constructor() {
    this.authService
      .authenticate('azure')
      .pipe(takeUntilDestroyed())
      .subscribe((authResult: NbAuthResult) => {
        const redirect = authResult.getRedirect();
        if (authResult.isSuccess() && redirect) {
          void this.router.navigateByUrl(redirect);
        }
      });
  }
}
