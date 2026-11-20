import { Component, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbIconComponent,
  NbListComponent,
  NbListItemComponent,
  NbProgressBarComponent,
  NbTabComponent,
  NbTabsetComponent,
  NbToggleComponent,
} from '@liquid-js/lyr-core';
import { NbMediaTrack, NbVideoComponent } from '@liquid-js/lyr-extras/media';
import { NbMarkdownViewerComponent } from '@liquid-js/lyr-extras/markdown-viewer';

import {
  LEARN_CHAPTER_INDEX,
  LEARN_CHAPTERS,
  LEARN_COURSE,
  LEARN_LESSON_INDEX,
  LEARN_NOTES,
  LEARN_TRANSCRIPT,
} from './learn-data';

/** A time in the transcript, e.g. 5:12, in seconds. */
function seconds(time: string) {
  const [minutes, rest] = time.split(':').map(Number);
  return minutes * 60 + rest;
}

/** A lesson: the player, its notes and transcript, and the chapter's other lessons beside it. */
@Component({
  selector: 'npg-learn-lesson',
  templateUrl: './learn-lesson.component.html',
  styleUrls: ['./learn-lesson.component.scss'],
  imports: [
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbListComponent,
    NbListItemComponent,
    NbMarkdownViewerComponent,
    NbProgressBarComponent,
    NbTabComponent,
    NbTabsetComponent,
    NbToggleComponent,
    NbVideoComponent,
    RouterLink,
  ],
})
export class LearnLessonComponent {
  readonly course = LEARN_COURSE;
  readonly chapterIndex = LEARN_CHAPTER_INDEX;
  readonly chapter = LEARN_CHAPTERS[LEARN_CHAPTER_INDEX];
  readonly lessonIndex = LEARN_LESSON_INDEX;
  readonly lesson = this.chapter.lessons[LEARN_LESSON_INDEX];
  readonly nextChapter = LEARN_CHAPTERS[LEARN_CHAPTER_INDEX + 1];
  readonly notes = LEARN_NOTES;
  readonly transcript = LEARN_TRANSCRIPT;
  readonly poster = 'assets/showcase/learn/lesson-poster.webp';
  readonly resources = [
    { icon: 'file-text-outline', name: 'Component page template', meta: 'Docx · 48 KB' },
    { icon: 'grid-outline', name: 'Anatomy worksheet', meta: 'PDF · 1.2 MB' },
    { icon: 'link-2-outline', name: 'Three documentation sites worth copying', meta: 'Link' },
  ];

  readonly captions: NbMediaTrack[] = [
    { src: 'assets/showcase/learn/lesson.en.vtt', kind: 'captions', srclang: 'en', label: 'English' },
  ];
  readonly player = viewChild.required(NbVideoComponent);
  /** Where the video is, in seconds, and the transcript's line there. */
  readonly position = signal(0);
  readonly currentLine = computed(() => {
    const position = this.position();
    return this.transcript.reduce((current, line, index) => (seconds(line.time) <= position ? index : current), -1);
  });
  readonly complete = signal(!!this.lesson.done);

  readonly done = computed(() => this.chapter.lessons.filter((lesson) => lesson.done).length);
  readonly chapterProgress = computed(() => Math.round((this.done() / this.chapter.lessons.length) * 100));

  /** Plays the video from a line of the transcript. */
  jump(time: string) {
    const player = this.player();
    player.seek(seconds(time));
    if (player.state().paused ?? true) {
      player.togglePlay();
    }
  }
}
