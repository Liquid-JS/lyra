import { DatePipe } from '@angular/common'
import { Component, computed, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardLinkDirective,
    NbCardMediaDirective,
    NbIconComponent,
    NbTagComponent,
    NbTagListComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { POSTS } from './site-posts'

/** A blog's list of posts, filtered by topic, with the latest one first and larger. */
@Component({
    selector: 'npg-site-blog',
    templateUrl: './site-blog.component.html',
    styleUrls: ['./site-blog.component.scss'],
    imports: [
        DatePipe,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardLinkDirective,
        NbCardMediaDirective,
        NbIconComponent,
        NbTagComponent,
        NbTagListComponent,
        NbUserComponent,
        RouterLink
    ]
})
export class SiteBlogComponent {
    readonly topics = ['All', ...new Set(POSTS.map((post) => post.tag))]
    readonly topic = signal('All')
    readonly posts = computed(() => POSTS.filter((post) => this.topic() === 'All' || post.tag === this.topic()))
}
