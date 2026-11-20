import { Service } from '@angular/core'
import { HttpResponse } from '@angular/common/http'

import { Observable, of as observableOf } from 'rxjs'
import { delay } from 'rxjs/operators'

import { NbAuthStrategy } from '../auth-strategy'
import { NbAuthResult } from '../../services/auth-result'
import { NbAuthStrategyClass } from '../../auth.options'
import { NbDummyAuthStrategyOptions, dummyStrategyOptions } from './dummy-strategy-options'

/**
 * A strategy without a backend, for setting up the auth before there is one: every action succeeds after `delay`
 * milliseconds with a simple token and a redirect to `/`, or fails when `alwaysFail` is set.
 *
 * Strategy settings:
 *
 * ```ts
 * export class NbDummyAuthStrategyOptions extends NbAuthStrategyOptions {
 *   name = '';
 *   token?: NbStrategyToken = {
 *     class: NbAuthSimpleToken,
 *   };
 *   delay?: number = 1000;
 *   alwaysFail?: boolean = false;
 * }
 * ```
 */
@Service({ autoProvided: false })
export class NbDummyAuthStrategy extends NbAuthStrategy<NbDummyAuthStrategyOptions> {
    protected override defaultOptions: NbDummyAuthStrategyOptions = dummyStrategyOptions

    static setup(options: NbDummyAuthStrategyOptions): [NbAuthStrategyClass, NbDummyAuthStrategyOptions] {
        return [NbDummyAuthStrategy, options]
    }

    authenticate(data?: unknown): Observable<NbAuthResult<HttpResponse<unknown>>> {
        return observableOf(this.createDummyResult(data)).pipe(delay(this.getOption('delay') ?? 0))
    }

    register(data?: unknown): Observable<NbAuthResult<HttpResponse<unknown>>> {
        return observableOf(this.createDummyResult(data)).pipe(delay(this.getOption('delay') ?? 0))
    }

    requestPassword(data?: unknown): Observable<NbAuthResult<HttpResponse<unknown>>> {
        return observableOf(this.createDummyResult(data)).pipe(delay(this.getOption('delay') ?? 0))
    }

    resetPassword(data?: unknown): Observable<NbAuthResult<HttpResponse<unknown>>> {
        return observableOf(this.createDummyResult(data)).pipe(delay(this.getOption('delay') ?? 0))
    }

    logout(data?: unknown): Observable<NbAuthResult<HttpResponse<unknown>>> {
        return observableOf(this.createDummyResult(data)).pipe(delay(this.getOption('delay') ?? 0))
    }

    refreshToken(data?: unknown): Observable<NbAuthResult<HttpResponse<unknown>>> {
        return observableOf(this.createDummyResult(data)).pipe(delay(this.getOption('delay') ?? 0))
    }

    protected createDummyResult(data?: unknown): NbAuthResult<HttpResponse<unknown>> {
        if (this.getOption('alwaysFail')) {
            return new NbAuthResult(false, this.createFailResponse(data), undefined, [this.texts().unknownError])
        }

        try {
            const token = this.createToken('test token', true)
            return new NbAuthResult(true, this.createSuccessResponse(data), '/', [], [this.texts().loginSuccess], token)
        } catch (err) {
            return new NbAuthResult(false, this.createFailResponse(data), undefined, [(err as Error).message])
        }
    }
}
