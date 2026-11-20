import { Injector, inject, Service } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { NbAuthToken } from '../token/token'
import { NbAuthService } from '../auth.service'
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '../../auth.options'

/**
 * Sends the token as a `Bearer` authorization header, refreshing it first when it has expired. Without a valid token
 * the request goes without one, so the app gets the 401 or 403 and can act on it, e.g. go to the login page.
 *
 * `NB_AUTH_TOKEN_INTERCEPTOR_FILTER` says which requests to leave alone, and the default leaves all of them alone:
 * provide a filter that returns `false` for the requests that need the token.
 */
@Service({ autoProvided: false })
export class NbAuthJWTInterceptor implements HttpInterceptor {
    private readonly injector = inject(Injector)
    protected readonly filter = inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER)

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // The filter returns `true` for the requests to leave alone.
        if (!this.filter(req)) {
            return this.authService.isAuthenticatedOrRefresh()
                .pipe(
                    switchMap((authenticated) => {
                        if (authenticated) {
                            return this.authService.getToken().pipe(
                                switchMap((token: NbAuthToken) => {
                                    const JWT = `Bearer ${token.getValue()}`
                                    req = req.clone({
                                        setHeaders: {
                                            Authorization: JWT
                                        }
                                    })
                                    return next.handle(req)
                                })
                            )
                        } else {
                            // Request is sent to server without authentication so that the client code
                            // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
                            return next.handle(req)
                        }
                    })
                )
        } else {
            return next.handle(req)
        }
    }

    protected get authService(): NbAuthService {
        return this.injector.get(NbAuthService)
    }

}
