import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NB_DOCUMENT,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    NbTagComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { ShowcaseGlowComponent } from '../shared/showcase-glow.component'
import { illustration, portrait } from '../shared/showcase-images'
import { HOURS, PRACTITIONERS, REVIEWS, SERVICES, STUDIO, serviceOf } from './book-data'

/** The studio's page: what it offers, who gives it, what customers say, and where and when to find it. */
@Component({
    selector: 'npg-book-home',
    templateUrl: './book-home.component.html',
    styleUrls: ['./book-home.component.scss'],
    imports: [
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbIconComponent,
        NbTagComponent,
        NbUserComponent,
        RouterLink,
        ShowcaseGlowComponent
    ]
})
export class BookHomeComponent {
    protected readonly document = inject(NB_DOCUMENT)

    readonly studio = STUDIO
    readonly services = SERVICES
    readonly practitioners = PRACTITIONERS
    readonly reviews = REVIEWS
    readonly hours = HOURS
    readonly stars = [1, 2, 3, 4, 5]
    readonly year = new Date().getFullYear()

    readonly portrait = portrait
    readonly illustration = illustration
    readonly serviceOf = serviceOf

    scrollTo(section: string) {
        this.document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}
