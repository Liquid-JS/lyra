import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbAccordionComponent,
  NbAccordionItemBodyComponent,
  NbAccordionItemComponent,
  NbAccordionItemHeaderComponent,
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbIconComponent,
  NbTagComponent,
  NbTagListComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { portrait } from '../shared/showcase-images';
import { ShowcaseGrainComponent } from '../shared/showcase-grain.component';
import { ShowcaseLogoComponent } from '../shared/showcase-logo.component';
import {
  sessionById,
  speakerById,
  SUMMIT,
  SUMMIT_DAYS,
  SUMMIT_FAQ,
  SUMMIT_HOTELS,
  SUMMIT_SPEAKERS,
  SUMMIT_SPONSORS,
  SUMMIT_STATS,
  SUMMIT_TRACKS,
} from './summit-data';

/**
 * The front page: the conference's name as big as the screen on its colour, then the numbers, the featured speakers,
 * three sessions from the agenda, the sponsors, the venue with hotels, the questions people ask, and the tickets.
 */
@Component({
  selector: 'npg-summit-home',
  templateUrl: './summit-home.component.html',
  styleUrls: ['./summit-home.component.scss'],
  imports: [
    NbAccordionComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    NbTagComponent,
    NbTagListComponent,
    NbUserComponent,
    RouterLink,
    ShowcaseGrainComponent,
    ShowcaseLogoComponent,
  ],
})
export class SummitHomeComponent {
  readonly summit = SUMMIT;
  readonly stats = SUMMIT_STATS;
  readonly featured = SUMMIT_SPEAKERS.filter((speaker) => speaker.featured);
  readonly sponsors = SUMMIT_SPONSORS;
  readonly hotels = SUMMIT_HOTELS;
  readonly faq = SUMMIT_FAQ;
  readonly tracks = SUMMIT_TRACKS;
  readonly portrait = portrait;
  readonly speakerById = speakerById;

  /** Three sessions worth coming for, with their days. */
  readonly highlights = ['d1-keynote', 'd1-systems', 'd2-a11y']
    .map((id) => sessionById(id))
    .filter((item): item is NonNullable<typeof item> => !!item);

  readonly days = SUMMIT_DAYS;

  // The words that run along the hero's edge, as a strip that moves unless the reader prefers it not to.
  readonly ticker = ['Product', 'Design', 'Engineering', 'Two days', 'Austin', '48 speakers', 'One room'];
}
