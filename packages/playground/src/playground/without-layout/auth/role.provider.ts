import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NbAuthService, NbAuthJWTToken, NbAuthToken } from '@liquid-js/lyr-auth';
import { NbRoleProvider } from '@liquid-js/lyr-security';

@Service({ autoProvided: false })
export class CustomRoleProvider implements NbRoleProvider {
  private readonly authService = inject(NbAuthService);

  getRole(): Observable<string> {
    return this.authService.onTokenChange().pipe(
      map((token: NbAuthToken) => {
        const role = token instanceof NbAuthJWTToken && token.isValid() ? token.getPayload()?.['role'] : undefined;
        return typeof role === 'string' ? role : 'guest';
      }),
    );
  }
}
