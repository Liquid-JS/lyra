import { Location } from '@angular/common';
import { Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbCardMediaDirective,
  NbPageIndicatorComponent,
} from '@liquid-js/lyr-core';

import { examplePicture, NgdExampleApp, themeId } from './example-apps';

// The size the pictures are made at, which the page keeps room for while they load.
const PICTURE_SIZES = { laptop: { width: 960, height: 600 }, phone: { width: 390, height: 844 } };

/**
 * An example app in the gallery: pictures of its screens in its own theme, one at a time with dots to move between
 * them, each a link to the screen.
 */
@Component({
  selector: 'ngd-example-app-card',
  template: `
    <nb-card>
      <div nbCardMedia>
      <div
        class="screens"
        [class.phone]="device() === 'phone'"
        [class.dragging]="dragging()"
        #screens
        (scroll)="onScroll()"
        (pointerdown)="startDrag($event)"
        (pointermove)="drag($event)"
        (pointerup)="endDrag()"
        (pointerleave)="endDrag()"
        (pointercancel)="endDrag()"
        (dragstart)="$event.preventDefault()">
        @for (screen of slides(); track screen.id; let index = $index) {
          <a
            class="screen"
            draggable="false"
            [href]="screen.link"
            [attr.aria-label]="app().name + ': ' + screen.title"
            (click)="skipDraggedClick($event)">
            <img
              draggable="false"
              [src]="screen.picture"
              [alt]="app().name + ' example, ' + screen.title + ' screen'"
              [width]="size().width"
              [height]="size().height"
              [attr.loading]="index ? 'lazy' : null" />
          </a>
        }
      </div>
      <div class="pager">
        <span class="current">{{ slides()[page()]?.title }}</span>
        @if (slides().length > 1) {
          <nb-page-indicator
            [count]="slides().length"
            [page]="page()"
            [attr.aria-label]="app().name + ' screens'"
            (pageChange)="show($event)" />
        }
      </div>
      </div>
      <nb-card-body>
        <h2 class="h5">{{ app().name }}</h2>
        <p>{{ app().summary }}</p>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./example-app-card.component.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbCardMediaDirective, NbPageIndicatorComponent],
})
export class NgdExampleAppCardComponent {
  protected readonly location = inject(Location);

  readonly app = input.required<NgdExampleApp>();

  protected readonly device = computed(() => this.app().devices[0]);
  protected readonly size = computed(() => PICTURE_SIZES[this.device()]);
  protected readonly slides = computed(() => {
    const app = this.app();
    return app.screens.map((screen) => ({
      ...screen,
      picture: examplePicture(app, screen),
      link: `${this.location.prepareExternalUrl(`example/${screen.id}`)}?theme=${themeId(app.theme)}`,
    }));
  });

  /** The screen shown. */
  protected readonly page = signal(0);
  protected readonly screens = viewChild.required<ElementRef<HTMLElement>>('screens');

  // The screen the strip is scrolling to after a dot or a drag, which the dots show until it gets there.
  protected target?: number;
  protected targetTimer?: ReturnType<typeof setTimeout>;

  protected show(page: number) {
    this.page.set(page);
    this.target = page;
    // In case it never gets there, e.g. when a swipe takes over.
    clearTimeout(this.targetTimer);
    this.targetTimer = setTimeout(() => (this.target = undefined), 1000);
    const strip = this.screens().nativeElement;
    strip.scrollTo({ left: strip.clientWidth * page * (getComputedStyle(strip).direction === 'rtl' ? -1 : 1) });
  }

  // Swiping or scrolling the pictures moves the dots along; on the way to a chosen screen, they stay on it.
  protected onScroll() {
    if (this.dragging()) {
      return;
    }
    const strip = this.screens().nativeElement;
    const page = Math.abs(strip.scrollLeft) / strip.clientWidth;
    if (this.target !== undefined) {
      if (Math.abs(page - this.target) < 0.01) {
        this.target = undefined;
      }
      return;
    }
    this.page.set(Math.round(page));
  }

  // A mouse swipes the pictures by dragging them, as a finger does: past a sixth of the width it moves to the next or
  // the previous screen, and short of it goes back. A drag doesn't follow the link it started on.
  protected readonly dragging = signal(false);
  protected dragStart?: { x: number; scroll: number };
  protected dragged = false;

  protected startDrag(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.button === 0) {
      this.dragStart = { x: event.clientX, scroll: this.screens().nativeElement.scrollLeft };
      this.dragged = false;
    }
  }

  protected drag(event: PointerEvent) {
    const start = this.dragStart;
    if (!start) {
      return;
    }
    const distance = event.clientX - start.x;
    if (!this.dragging() && Math.abs(distance) > 5) {
      this.dragging.set(true);
      this.dragged = true;
    }
    if (this.dragging()) {
      this.screens().nativeElement.scrollLeft = start.scroll - distance;
    }
  }

  protected endDrag() {
    const start = this.dragStart;
    this.dragStart = undefined;
    if (!start || !this.dragging()) {
      return;
    }
    const strip = this.screens().nativeElement;
    const moved = start.scroll - strip.scrollLeft;
    const rtl = getComputedStyle(strip).direction === 'rtl';
    const from = this.page();
    // Dragging towards the start shows the next screen: to the left, or in right-to-left text to the right.
    const step = Math.abs(moved) > strip.clientWidth / 6 ? (moved < 0 !== rtl ? 1 : -1) : 0;
    this.dragging.set(false);
    this.show(Math.min(this.slides().length - 1, Math.max(0, from + step)));
  }

  protected skipDraggedClick(event: Event) {
    if (this.dragged) {
      event.preventDefault();
      event.stopPropagation();
      this.dragged = false;
    }
  }
}
