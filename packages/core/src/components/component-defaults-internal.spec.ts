import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  NbCalendarActionsComponent,
  NbCalendarComponent,
  NbChatFormComponent,
  NbContentSizeSwitcherComponent,
  NbPaginationComponent,
  NbThemeModule,
  NbThemeSelectComponent,
  provideNbComponentDefaults,
} from '@liquid-js/lyr-core';

// Components that render controls of their own, under app defaults far from the built-in ones.
@Component({
  template: `
    <nb-pagination class="pagination" [length]="50" [pageSizeOptions]="[5, 10]" />
    <nb-calendar class="calendar" />
    <nb-calendar-actions class="actions" [showCurrentTimeButton]="true" />
    <nb-chat-form class="chat" />
    <nb-theme-select class="theme" />
    <nb-content-size-switcher class="switcher" />
  `,
  imports: [
    NbPaginationComponent,
    NbCalendarComponent,
    NbCalendarActionsComponent,
    NbChatFormComponent,
    NbThemeSelectComponent,
    NbContentSizeSwitcherComponent,
  ],
})
class HostComponent {}

describe('The controls inside components, under the app\'s defaults', () => {
  let element: HTMLElement;

  /** The size, shape and appearance classes of the first element a selector finds. */
  const looks = (selector: string) =>
    [...(element.querySelector(selector) as HTMLElement).classList].filter((name) =>
      /^(size|shape|appearance)-/.test(name),
    );

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [
        provideNbComponentDefaults({
          shape: 'round',
          size: 'giant',
          appearance: 'floating',
          button: { appearance: 'outline' },
          select: { appearance: 'hero' },
        }),
      ],
    });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('should keep chrome as designed: its size from the component, its appearance by its role', () => {
    // The pagination's controls are its size, the page size select an outline one, its buttons ghost.
    expect(looks('.pagination nb-select')).toEqual(expect.arrayContaining(['appearance-outline', 'size-small']));
    expect(looks('.pagination [nbButton]')).toEqual(expect.arrayContaining(['appearance-ghost', 'size-small']));
    // The calendar is an outline card, its header's buttons medium and ghost.
    expect(looks('.calendar nb-card')).toContain('appearance-outline');
    expect(looks('.calendar nb-calendar-view-mode [nbButton]')).toEqual(
      expect.arrayContaining(['appearance-ghost', 'size-medium']),
    );
    expect(looks('.calendar .next-month')).toEqual(expect.arrayContaining(['appearance-ghost', 'size-medium']));
    // The chat form's field and send button are medium.
    expect(looks('.chat textarea')).toContain('size-medium');
    expect(looks('.chat .send-button')).toContain('size-medium');
  });

  it('should let the app\'s shape reach chrome, and its look reach actions and controls of their own', () => {
    expect(looks('.pagination [nbButton]')).toContain('shape-round');
    expect(looks('.calendar .next-month')).toContain('shape-round');
    // Actions follow the app's buttons.
    expect(looks('.actions .apply-text-button')).toContain('appearance-outline');
    expect(looks('.chat .send-button')).toContain('appearance-outline');
    // The theme select is a select, and the switcher a button group, with the app's look.
    expect(looks('.theme nb-select')).toEqual(expect.arrayContaining(['appearance-hero', 'size-giant']));
    expect(looks('.switcher [nbButtonToggle]')).toContain('size-giant');
  });
});
