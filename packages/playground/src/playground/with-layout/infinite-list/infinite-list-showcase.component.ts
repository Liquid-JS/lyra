import { Component, inject, signal } from '@angular/core';
import { NewsPost, NewsService } from './news.service';
import { NbCardComponent, NbListComponent, NbListItemComponent, NbInfiniteListDirective } from '@liquid-js/lyr-core';
import { NewsPostComponent } from './components/news-post.component';
import { NewsPostPlaceholderComponent } from './components/news-post-placeholder.component';

@Component({
  templateUrl: './infinite-list-showcase.component.html',
  styleUrls: ['infinite-news-list.component.scss'],
  providers: [NewsService],
  imports: [
    NbCardComponent,
    NbListComponent,
    NbInfiniteListDirective,
    NbListItemComponent,
    NewsPostComponent,
    NewsPostPlaceholderComponent,
  ],
})
export class InfiniteListShowcaseComponent {
  private readonly newsService = inject(NewsService);

  readonly news = signal<NewsPost[]>([]);
  readonly placeholders = signal<unknown[]>([]);
  pageSize = 10;
  pageToLoadNext = 1;
  loading = false;

  loadNext() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.placeholders.set(new Array(this.pageSize));
    this.newsService.load(this.pageToLoadNext, this.pageSize).subscribe((news) => {
      this.placeholders.set([]);
      this.news.update((loaded) => [...loaded, ...news]);
      this.loading = false;
      this.pageToLoadNext++;
    });
  }
}
