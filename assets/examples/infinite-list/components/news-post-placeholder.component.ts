import { Component } from '@angular/core'

@Component({
    selector: 'nb-news-post-placeholder',
    templateUrl: './news-post-placeholder.component.html',
    styleUrls: ['../news-post-placeholder.component.scss'],
    host: { 'aria-label': 'Loading' }
})
export class NewsPostPlaceholderComponent {}
