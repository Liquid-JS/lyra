import { DatePipe } from '@angular/common'
import { Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbAlertComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    NbInputDirective,
    NbTagComponent,
    NbTagListComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { POSTS } from './site-posts'

/** A blog post: its title and author, the text with a quote and a note, its topics and what to read next. */
@Component({
    selector: 'npg-site-article',
    templateUrl: './site-article.component.html',
    styleUrls: ['./site-article.component.scss'],
    imports: [
        DatePipe,
        NbAlertComponent,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbIconComponent,
        NbInputDirective,
        NbTagComponent,
        NbTagListComponent,
        NbUserComponent,
        RouterLink
    ]
})
export class SiteArticleComponent {
    /** The address new posts go to, once subscribed. */
    readonly subscribed = signal<string | undefined>(undefined)
    readonly post = POSTS[0]
    readonly next = POSTS.slice(1, 3)
}
