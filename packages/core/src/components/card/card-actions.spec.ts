import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbButtonModule, NbCardModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" [attr.dir]="dir()" style="width: 30rem">
      <nb-card class="plain">
        <nb-card-header>Title</nb-card-header>
        <nb-card-footer>Footer</nb-card-footer>
      </nb-card>
      <nb-card class="actions">
        <nb-card-header>
          <span class="title">Title</span>
          <nb-card-actions>
            <button nbButton size="medium">One</button>
            <button nbButton size="medium">Two</button>
          </nb-card-actions>
        </nb-card-header>
        <nb-card-footer>
          <nb-card-actions>
            <button nbButton size="small">Save</button>
          </nb-card-actions>
        </nb-card-footer>
      </nb-card>
      <nb-card class="inline">
        <nb-card-header>
          <span class="title">Title</span>
          <button nbButton ghost inline edge="end" size="medium">See all</button>
        </nb-card-header>
        <nb-card-footer>
          <button nbButton ghost inline edge="start" size="small">Compare</button>
        </nb-card-footer>
      </nb-card>
    </div>
  `,
  styleUrl: './card-actions.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbCardModule, NbButtonModule],
})
class CardActionsHostComponent {
  readonly dir = signal('ltr');
}

describe('NbCardActionsComponent', () => {
  let fixture: ComponentFixture<CardActionsHostComponent>;

  const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;
  const rect = (selector: string) => element(selector).getBoundingClientRect();
  const paddingEnd = (selector: string) => parseFloat(getComputedStyle(element(selector)).paddingInlineEnd);

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(CardActionsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should keep the header as tall as one without actions, with the buttons centered on its title', () => {
    expect(rect('.actions nb-card-header').height).toBe(rect('.plain nb-card-header').height);
    // Taller than the title's line, the buttons reach into the padding.
    expect(rect('.actions nb-card-header button').height).toBeGreaterThan(rect('.title').height);
    const button = rect('.actions nb-card-header button');
    const title = rect('.title');
    expect(button.top + button.height / 2).toBeCloseTo(title.top + title.height / 2, 0);
  });

  it('should put the actions at the end of the header', async () => {
    const header = rect('.actions nb-card-header');
    expect(rect('.actions nb-card-header button:last-child').right).toBeCloseTo(
      header.right - paddingEnd('.actions nb-card-header'),
      0,
    );

    fixture.componentInstance.dir.set('rtl');
    fixture.detectChanges();

    expect(rect('.actions nb-card-header button:last-child').left).toBeCloseTo(
      header.left + paddingEnd('.actions nb-card-header'),
      0,
    );
  });

  it('should keep a header or footer with an inline button as tall as with text, the button where actions are', () => {
    for (const part of ['nb-card-header', 'nb-card-footer']) {
      expect(rect(`.inline ${part}`).height).toBe(rect(`.plain ${part}`).height);
      const inline = rect(`.inline ${part} button`);
      const actions = rect(`.actions ${part} button`);
      const inlineMiddle = inline.top + inline.height / 2 - rect(`.inline ${part}`).top;
      const actionsMiddle = actions.top + actions.height / 2 - rect(`.actions ${part}`).top;
      expect(inlineMiddle).toBeCloseTo(actionsMiddle, 0);
    }
  });

  it('should keep a footer of actions as tall as a footer of text', () => {
    expect(rect('.actions nb-card-footer').height).toBe(rect('.plain nb-card-footer').height);
    const footer = rect('.actions nb-card-footer');
    expect(rect('.actions nb-card-footer button').right).toBeCloseTo(footer.right - paddingEnd('.actions nb-card-footer'), 0);
  });

  it('should leave headers without actions as they are', () => {
    expect(getComputedStyle(element('.plain nb-card-header')).display).toBe('block');
  });
});
