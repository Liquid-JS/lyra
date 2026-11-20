import { Component, computed, inject, input } from '@angular/core';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbDialogRef,
  NbIconComponent,
  NbTagComponent,
  NbTagListComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { portrait } from '../../shared/showcase-images';
import { sessionById, SUMMIT_TRACKS, SummitSpeaker } from '../summit-data';

/** A speaker in a dialog: who they are, what they talk about, and when. */
@Component({
  selector: 'npg-summit-speaker-dialog',
  template: `
    <nb-card class="dialog">
      <nb-card-header>
        <nb-user size="large" [name]="speaker().name" [title]="speaker().role + ', ' + speaker().company" [picture]="portrait(speaker().name)" />
        <button nbButton ghost size="small" type="button" aria-label="Close" (click)="ref.close()">
          <nb-icon icon="close-outline" />
        </button>
      </nb-card-header>
      <nb-card-body>
        <nb-tag-list>
          @for (topic of speaker().topics; track topic) {
            <nb-tag appearance="outline" size="tiny" [text]="topic" />
          }
        </nb-tag-list>
        <p>{{ speaker().bio }}</p>
        @if (session(); as item) {
          <div class="session">
            <span class="caption">{{ item.day.label }} · {{ item.session.start }}–{{ item.session.end }} · {{ item.session.room }}</span>
            <strong>{{ item.session.title }}</strong>
            @if (item.session.track !== 'break') {
              <nb-tag size="tiny" [status]="tracks[item.session.track].status" [text]="tracks[item.session.track].label" />
            }
          </div>
        }
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="primary" type="button" (click)="ref.close()">Done</button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: `
    .dialog {
      width: min(32rem, calc(100vw - 2rem));
      margin: 0;
    }

    nb-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    nb-card-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    p {
      margin: 0;
    }

    .session {
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 0.375rem;
      padding: 1rem;
      background: var(--color-basic-200);
    }

    nb-card-footer {
      display: flex;
      justify-content: flex-end;
    }
  `,
  imports: [
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbTagComponent,
    NbTagListComponent,
    NbUserComponent,
  ],
})
export class SummitSpeakerDialogComponent {
  protected readonly ref = inject(NbDialogRef<SummitSpeakerDialogComponent>);
  readonly speaker = input.required<SummitSpeaker>();
  readonly tracks = SUMMIT_TRACKS;
  readonly portrait = portrait;
  readonly session = computed(() => {
    const id = this.speaker().session;
    return id ? sessionById(id) : undefined;
  });
}
