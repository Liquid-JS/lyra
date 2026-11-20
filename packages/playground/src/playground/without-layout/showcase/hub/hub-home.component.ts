import { DatePipe } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbBadgeComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardMediaDirective,
    NbIconComponent,
    NbListComponent,
    NbListItemComponent,
    NbTagComponent,
    NbTagListComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { ANNOUNCEMENTS, CELEBRATIONS, EVENTS, FEED, photoOf, TODAY } from './hub-data'

/** The intranet's front page: a greeting, the announcements and the feed, with today, quick actions and celebrations beside them. */
@Component({
    selector: 'npg-hub-home',
    templateUrl: './hub-home.component.html',
    styleUrls: ['./hub-home.component.scss'],
    imports: [
        DatePipe,
        NbBadgeComponent,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardMediaDirective,
        NbIconComponent,
        NbListComponent,
        NbListItemComponent,
        NbTagComponent,
        NbTagListComponent,
        NbUserComponent,
        RouterLink
    ]
})
export class HubHomeComponent {
    readonly today = TODAY
    readonly announcements = ANNOUNCEMENTS
    readonly events = EVENTS
    readonly feed = FEED
    readonly celebrations = CELEBRATIONS
    readonly photoOf = photoOf

    readonly actions = [
        { title: 'Book a room', icon: 'calendar-outline', link: '../requests' },
        { title: 'Request leave', icon: 'sun-outline', link: '../requests' },
        { title: 'New ticket', icon: 'alert-circle-outline', link: '../tickets' },
        { title: 'Find a person', icon: 'people-outline', link: '../people' }
    ]
}
