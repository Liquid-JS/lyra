import { Injector, inject, Service } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NbAuthService } from '../auth.service';
import { NB_AUTH_INTERCEPTOR_HEADER } from '../../auth.options';
import { NbAuthToken } from '../token/token';

/**
 * Sends the token's value as it is, in the `NB_AUTH_INTERCEPTOR_HEADER` header (`Authorization` by default), with
 * every request that goes out while there is a token.
 */
@Service({ autoProvided: false })
export class NbAuthSimpleInterceptor implements HttpInterceptor {
  private readonly injector = inject(Injector);
  protected readonly headerName = inject(NB_AUTH_INTERCEPTOR_HEADER) ?? 'Authorization';

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.getToken().pipe(
      switchMap((token: NbAuthToken) => {
        if (token && token.getValue()) {
          req = req.clone({
            setHeaders: {
              [this.headerName]: token.getValue(),
            },
          });
        }
        return next.handle(req);
      }),
    );
  }

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }
}
