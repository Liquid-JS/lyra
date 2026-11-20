import { Component, input } from '@angular/core';
import { NewsPost } from '../news.service';

@Component({
  selector: 'nb-news-post',
  templateUrl: './news-post.component.html',
})
export class NewsPostComponent {
  readonly post = input.required<NewsPost>();
}
