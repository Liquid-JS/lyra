import { inject, Service } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { NgdMdSection, NgdTextService } from './text.service'

@Service()
export class NgdArticleService {
    private readonly http = inject(HttpClient)
    private readonly textService = inject(NgdTextService)

    getArticle(source: string): Observable<NgdMdSection[]> {
        return this.http.get(`articles/${source}`, { responseType: 'text' }).pipe(
            map((article) => this.textService.mdToSections(article)),
            shareReplay(1)
        )
    }
}
