import { Component, inject, signal } from '@angular/core'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbListComponent,
    NbListItemComponent,
    NbInfiniteListDirective
} from '@liquid-js/lyr-core'
import { NewsPost, NewsService } from './news.service'
import { NewsPostComponent } from './components/news-post.component'
import { NewsPostPlaceholderComponent } from './components/news-post-placeholder.component'

@Component({
    templateUrl: './infinite-list-scroll-modes.component.html',
    styleUrls: ['infinite-news-list.component.scss', 'infinite-list-scroll-modes.component.scss'],
    providers: [NewsService],
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbListComponent,
        NbInfiniteListDirective,
        NbListItemComponent,
        NewsPostComponent,
        NewsPostPlaceholderComponent
    ]
})
export class InfiniteListScrollModesComponent {
    private readonly newsService = inject(NewsService)

    readonly firstCard = {
        news: signal<NewsPost[]>([]),
        placeholders: signal<unknown[]>([]),
        loading: false,
        pageToLoadNext: 1
    }
    readonly secondCard = {
        news: signal<NewsPost[]>([]),
        placeholders: signal<unknown[]>([]),
        loading: false,
        pageToLoadNext: 1
    }
    pageSize = 10

    loadNext(cardData: typeof this.firstCard) {
        if (cardData.loading) {
            return
        }

        cardData.loading = true
        cardData.placeholders.set(new Array(this.pageSize))
        this.newsService.load(cardData.pageToLoadNext, this.pageSize).subscribe((nextNews) => {
            cardData.placeholders.set([])
            cardData.news.update((loaded) => [...loaded, ...nextNews])
            cardData.loading = false
            cardData.pageToLoadNext++
        })
    }
}
