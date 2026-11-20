import { Component, computed, inject, signal } from '@angular/core';
import {
  NbButtonComponent,
  NbDialogService,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbPrefixDirective,
  NbTagComponent,
  NbTagListComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { portrait } from '../shared/showcase-images';
import { SUMMIT_SPEAKERS, SummitSpeaker } from './summit-data';
import { SummitSpeakerDialogComponent } from './parts/summit-speaker-dialog.component';

/** The speakers as a grid of cards you can search, each opening in a dialog, and a call for more. */
@Component({
  selector: 'npg-summit-speakers',
  templateUrl: './summit-speakers.component.html',
  styleUrls: ['./summit-speakers.component.scss'],
  imports: [
    NbButtonComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbPrefixDirective,
    NbTagComponent,
    NbTagListComponent,
    NbUserComponent,
  ],
})
export class SummitSpeakersComponent {
  private readonly dialogs = inject(NbDialogService);

  readonly portrait = portrait;
  readonly query = signal('');
  readonly speakers = computed(() => {
    const query = this.query().trim().toLowerCase();
    return SUMMIT_SPEAKERS.filter(
      (speaker) =>
        !query ||
        [speaker.name, speaker.role, speaker.company, ...speaker.topics].some((text) =>
          text.toLowerCase().includes(query),
        ),
    );
  });

  open(speaker: SummitSpeaker) {
    this.dialogs.open(SummitSpeakerDialogComponent, { context: { speaker } });
  }
}
