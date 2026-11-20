import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  NbAccordionComponent,
  NbAccordionItemBodyComponent,
  NbAccordionItemComponent,
  NbAccordionItemHeaderComponent,
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbDatepickerDirective,
  NbDialogService,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbOptionComponent,
  NbPrefixDirective,
  NbProgressBarComponent,
  NbRangepickerComponent,
  NbSelectComponent,
  NbTagComponent,
  NbToastrService,
  NbUserComponent,
} from '@liquid-js/lyr-core';
import { map } from 'rxjs/operators';

import { illustration, portrait } from '../shared/showcase-images';
import {
  STAY_AMENITIES,
  STAY_FEATURED,
  STAY_GALLERY,
  STAY_HIGHLIGHTS,
  STAY_LARGE_PHOTOS,
  STAY_LISTINGS,
  STAY_RATING_BREAKDOWN,
  STAY_REVIEWS,
  STAY_RULES,
} from './stay-data';
import { StayRatingComponent } from './parts/stay-rating.component';
import { StayTripService } from './stay-trip.service';

/** A place: its photos, what it's like, what it has, its reviews, and beside them, booking it. */
@Component({
  selector: 'npg-stay-listing',
  templateUrl: './stay-listing.component.html',
  styleUrls: ['./stay-listing.component.scss'],
  imports: [
    CurrencyPipe,
    DecimalPipe,
    FormsModule,
    NbAccordionComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbDatepickerDirective,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbPrefixDirective,
    NbProgressBarComponent,
    NbRangepickerComponent,
    NbSelectComponent,
    NbTagComponent,
    NbUserComponent,
    RouterLink,
    StayRatingComponent,
  ],
})
export class StayListingComponent {
  protected readonly trips = inject(StayTripService);
  private readonly route = inject(ActivatedRoute);
  /** Stay's frame, which its screens' links go from: this one is at listing, or at listing/:id. */
  protected readonly shell = this.route.parent;
  private readonly router = inject(Router);
  private readonly toastr = inject(NbToastrService);
  private readonly dialog = inject(NbDialogService);

  readonly highlights = STAY_HIGHLIGHTS;
  readonly amenities = STAY_AMENITIES;
  readonly rules = STAY_RULES;
  readonly reviews = STAY_REVIEWS;
  readonly breakdown = STAY_RATING_BREAKDOWN;
  readonly gallery = STAY_GALLERY;
  readonly guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  readonly today = new Date();
  readonly illustration = (name: string) => illustration(name, 'notionists');

  /** The place the link names, or the featured one. */
  readonly listing = toSignal(
    this.route.paramMap.pipe(
      map((params) => STAY_LISTINGS.find((item) => item.id === params.get('id')) ?? STAY_FEATURED),
    ),
    { requireSync: true },
  );
  readonly largePhoto = computed(() => STAY_LARGE_PHOTOS[this.listing().id] ?? this.listing().image);
  readonly hostPhoto = computed(() => portrait(this.listing().host));
  readonly expanded = signal(false);
  /** The place's photos: the large one, then the rest. */
  readonly photos = computed(() => [this.largePhoto(), ...this.gallery]);
  /** How many reviews show before "Show more reviews". */
  readonly reviewsShown = 4;
  readonly allReviews = signal(false);
  readonly shownReviews = computed(() => (this.allReviews() ? this.reviews : this.reviews.slice(0, this.reviewsShown)));

  /** What the place is like, in the host's words. */
  readonly description = computed(() => {
    const { name, type, place, region, guests, bedrooms } = this.listing();
    return [
      `${name} is a ${type.toLowerCase()} for up to ${guests} on the edge of ${place}, ${region}: close enough to walk in for dinner, far enough that the only sound at night is the trees.`,
      `Inside, ${bedrooms === 1 ? 'the bedroom' : `each of the ${bedrooms} bedrooms`} has a proper mattress and blackout blinds. The kitchen is stocked for cooking, not just reheating: good knives, a cast-iron pan, oil, salt and spices, and coffee for the first morning.`,
      'Mornings start on the deck. There are trails from the door, a lake twenty minutes away and a farm shop on the lane that sells eggs on an honesty box. Ask for the map; we keep adding to it.',
    ];
  });

  constructor() {
    // The place being booked follows the one shown.
    effect(() => this.trips.listing.set(this.listing()));
  }

  reserve() {
    void this.router.navigate(['booking'], { relativeTo: this.shell });
  }

  /** Every photo of the place, in a dialog. */
  showPhotos(content: TemplateRef<unknown>) {
    this.dialog.open(content, { autoFocus: false });
  }

  share() {
    this.toastr.show('The link to this place is on your clipboard.', 'Link copied', { status: 'success' });
  }
}
