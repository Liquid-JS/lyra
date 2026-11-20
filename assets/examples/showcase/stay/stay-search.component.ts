import { CurrencyPipe, NgTemplateOutlet } from '@angular/common'
import { Component, computed, inject, signal, TemplateRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import {
    NbAutocompleteComponent,
    NbAutocompleteDirective,
    NbBadgeComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardLinkDirective,
    NbCardMediaDirective,
    NbCheckboxComponent,
    NbDatepickerDirective,
    NbDialogService,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbPaginationComponent,
    NbPrefixDirective,
    NbRangepickerComponent,
    NbSelectComponent,
    NbSliderComponent,
    NbSliderValue,
    NbTagComponent,
    NbTagListComponent
} from '@liquid-js/lyr-core'

import {
    STAY_FEATURES,
    STAY_LISTINGS,
    STAY_PLACES,
    STAY_PRICE_RANGE,
    STAY_TYPES,
    StayFeature,
    StayType
} from './stay-data'
import { StayRatingComponent } from './parts/stay-rating.component'
import { StayTripService } from './stay-trip.service'

type StaySort = 'recommended' | 'price-low' | 'price-high' | 'rating'

/** Finding a place: where, when and for whom, the filters, and the places that fit, a page at a time. */
@Component({
    selector: 'npg-stay-search',
    templateUrl: './stay-search.component.html',
    styleUrls: ['./stay-search.component.scss'],
    imports: [
        CurrencyPipe,
        FormsModule,
        NbAutocompleteComponent,
        NbAutocompleteDirective,
        NbBadgeComponent,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardLinkDirective,
        NbCardMediaDirective,
        NbCheckboxComponent,
        NbDatepickerDirective,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbOptionComponent,
        NbPaginationComponent,
        NbPrefixDirective,
        NbRangepickerComponent,
        NbSelectComponent,
        NbSliderComponent,
        NbTagComponent,
        NbTagListComponent,
        NgTemplateOutlet,
        RouterLink,
        StayRatingComponent
    ]
})
export class StaySearchComponent {
    protected readonly trips = inject(StayTripService)
    private readonly dialogService = inject(NbDialogService)

    readonly types = STAY_TYPES
    readonly features = STAY_FEATURES
    readonly priceRange = STAY_PRICE_RANGE
    readonly guestOptions = [1, 2, 3, 4, 5, 6, 7, 8]
    readonly today = new Date()
    readonly pageSize = 8

    readonly where = signal('')
    readonly selectedTypes = signal(new Set<StayType>())
    readonly selectedFeatures = signal(new Set<StayFeature>())
    readonly price = signal<NbSliderValue>({ start: STAY_PRICE_RANGE.min, end: STAY_PRICE_RANGE.max })
    readonly minRating = signal(0)
    readonly sort = signal<StaySort>('recommended')
    readonly page = signal(0)

    /** The places that match what's typed, to pick from. */
    readonly suggestions = computed(() => {
        const typed = this.where().trim().toLowerCase()
        return STAY_PLACES.filter((place) => place.toLowerCase().includes(typed))
    })

    readonly results = computed(() => {
        const where = this.where().trim().toLowerCase()
        const types = this.selectedTypes()
        const features = this.selectedFeatures()
        const price = this.price()
        const [low, high] =
            typeof price === 'object' && price ? [price.start ?? 0, price.end ?? Infinity] : [0, Infinity]
        const minRating = this.minRating()
        const found = STAY_LISTINGS.filter(
            (listing) =>
                (!where || `${listing.place} ${listing.region}`.toLowerCase().includes(where)) &&
        (!types.size || types.has(listing.type)) &&
        [...features].every((feature) => listing.features.includes(feature)) &&
        listing.price >= low &&
        listing.price <= high &&
        listing.rating >= minRating
        )
        const sort = this.sort()
        return sort === 'price-low'
            ? [...found].sort((a, b) => a.price - b.price)
            : sort === 'price-high'
                ? [...found].sort((a, b) => b.price - a.price)
                : sort === 'rating'
                    ? [...found].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
                    : found
    })

    readonly shown = computed(() => {
        const start = this.page() * this.pageSize
        return this.results().slice(start, start + this.pageSize)
    })

    /** How many filters are on, for the button that opens them on a phone. */
    readonly activeFilters = computed(() => {
        const price = this.price()
        const priceChanged =
            typeof price === 'object' &&
            !!price &&
            (price.start !== STAY_PRICE_RANGE.min || price.end !== STAY_PRICE_RANGE.max)
        const rated = this.minRating() ? 1 : 0
        return this.selectedTypes().size + this.selectedFeatures().size + (priceChanged ? 1 : 0) + rated
    })

    readonly formatPrice = (value: number) => `$${value}`

    toggleType(type: StayType) {
        this.selectedTypes.update((types) => toggled(types, type))
        this.page.set(0)
    }

    toggleFeature(feature: StayFeature) {
        this.selectedFeatures.update((features) => toggled(features, feature))
        this.page.set(0)
    }

    clearFilters() {
        this.selectedTypes.set(new Set())
        this.selectedFeatures.set(new Set())
        this.price.set({ start: STAY_PRICE_RANGE.min, end: STAY_PRICE_RANGE.max })
        this.minRating.set(0)
        this.page.set(0)
    }

    /** On a phone, the filters open over the results. */
    openFilters(filters: TemplateRef<unknown>) {
        this.dialogService.open(filters, { dialogClass: 'stay-filters-dialog' })
    }
}

function toggled<T>(set: Set<T>, item: T): Set<T> {
    const next = new Set(set)
    if (!next.delete(item)) {
        next.add(item)
    }
    return next
}
