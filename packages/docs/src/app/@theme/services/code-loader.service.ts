import { inject, Service } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, ReplaySubject } from 'rxjs'
import { share } from 'rxjs/operators'

@Service()
export class NgdCodeLoaderService {
    private readonly http = inject(HttpClient)

    /**
     * Contains cached files by url.
     * */
    private cache = new Map<string, Observable<string>>()

    load(path: string): Observable<string> {
        const url = this.buildFilePath(path)
        const cached = this.cache.get(url)

        return cached ? cached : this.buildRequest(url)
    }

    private buildFilePath(path: string): string {
        return `assets/examples/${path}`
    }

    private buildRequest(url: string): Observable<string> {
        const request = this.http.get(url, { responseType: 'text' })
            .pipe(
                share({
                    connector: () => new ReplaySubject(1),
                    resetOnError: false,
                    resetOnComplete: false,
                    resetOnRefCountZero: false
                })
            )

        this.cache.set(url, request)

        return request
    }
}
