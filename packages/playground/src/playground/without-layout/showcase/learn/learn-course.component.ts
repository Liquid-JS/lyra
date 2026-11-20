import { CurrencyPipe, DecimalPipe } from '@angular/common';
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
  NbCardHeaderComponent,
  NbCardMediaDirective,
  NbIconComponent,
  NbProgressBarComponent,
  NbTagComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { illustration, portrait } from '../shared/showcase-images';
import {
  cover,
  LEARN_CHAPTER_INDEX,
  LEARN_CHAPTERS,
  LEARN_COURSE,
  LEARN_LEVEL_STATUS,
  LEARN_OUTCOMES,
  LEARN_REVIEWS,
} from './learn-data';
import { LearnStarsComponent } from './parts/learn-stars.component';

/** A course: what it covers, its chapters and lessons with the learner's progress, the instructor and the reviews. */
@Component({
  selector: 'npg-learn-course',
  templateUrl: './learn-course.component.html',
  styleUrls: ['./learn-course.component.scss'],
  imports: [
    CurrencyPipe,
    DecimalPipe,
    LearnStarsComponent,
    NbAccordionComponent,
    NbAccordionItemBodyComponent,
    NbAccordionItemComponent,
    NbAccordionItemHeaderComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardMediaDirective,
    NbIconComponent,
    NbProgressBarComponent,
    NbTagComponent,
    NbUserComponent,
    RouterLink,
  ],
})
export class LearnCourseComponent {
  readonly course = LEARN_COURSE;
  readonly chapters = LEARN_CHAPTERS;
  readonly currentChapter = LEARN_CHAPTER_INDEX;
  readonly outcomes = LEARN_OUTCOMES;
  readonly reviews = LEARN_REVIEWS;
  readonly cover = cover(LEARN_COURSE);
  readonly instructorPhoto = portrait(LEARN_COURSE.instructor);
  readonly levelStatus = LEARN_LEVEL_STATUS;

  readonly lessons = LEARN_CHAPTERS.flatMap((chapter) => chapter.lessons);
  readonly done = this.lessons.filter((lesson) => lesson.done).length;
  readonly progress = Math.round((this.done / this.lessons.length) * 100);

  readonly includes = [
    { icon: 'video-outline', text: `${this.course.hours} hours of video` },
    { icon: 'checkmark-square-2-outline', text: `${this.chapters.length} chapter quizzes` },
    { icon: 'file-text-outline', text: 'Worksheets and templates' },
    { icon: 'award-outline', text: 'Certificate on completion' },
    { icon: 'unlock-outline', text: 'Yours for good, with updates' },
  ];

  protected readonly illustration = illustration;

  minutes(chapter: { lessons: { minutes: number }[] }): number {
    return chapter.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
  }

  doneIn(chapter: { lessons: { done?: boolean }[] }): number {
    return chapter.lessons.filter((lesson) => lesson.done).length;
  }
}
