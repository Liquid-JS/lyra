import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { userEvent } from 'vitest/browser';

import { NbInputModule, NbTagModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default">
      <nb-tag-list [formControl]="tags">
        <input nbTagInput aria-label="Tags" />
      </nb-tag-list>
      <!-- The inputs the list's colours are compared with. -->
      <input nbInput class="reference" aria-label="Reference" />
      <input nbInput class="reference-disabled" aria-label="Disabled reference" disabled />
    </div>
  `,
  styleUrl: './tag-list-size.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbInputModule, NbTagModule, ReactiveFormsModule],
})
class TagStatesHostComponent {
  readonly tags = new FormControl<string[]>(['Design']);
}

// A tag list with an input is a field: it has an input's colours under the pointer and disabled.
describe('nb-tag-list with an input, by state', () => {
  let fixture: ComponentFixture<TagStatesHostComponent>;

  const list = () => fixture.nativeElement.querySelector('nb-tag-list') as HTMLElement;
  const style = (selector: string) => getComputedStyle(fixture.nativeElement.querySelector(selector) as HTMLElement);
  /** A style's value once it has stopped changing, as after a transition. */
  const settled = async (read: () => string) => {
    let last = '';
    await expect
      .poll(
        () => {
          const now = read();
          const done = now === last;
          last = now;
          return done;
        },
        { interval: 100 },
      )
      .toBe(true);
    return last;
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(TagStatesHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('should have an input\'s border under the pointer, keeping its background, and be disabled as one', async () => {
    // The input's colours under the pointer, once it has them.
    const rest = style('.reference').backgroundColor;
    await userEvent.hover(fixture.nativeElement.querySelector('.reference'));
    await expect.poll(() => style('.reference').backgroundColor).not.toBe(rest);
    const hovered = {
      border: await settled(() => style('.reference').borderTopColor),
      background: await settled(() => style('.reference').backgroundColor),
    };

    // The field's hover background is a filled basic tag's colour, so the list keeps its own.
    const own = getComputedStyle(list()).backgroundColor;
    expect(own).not.toBe(hovered.background);
    await userEvent.hover(list());
    await expect.poll(() => getComputedStyle(list()).borderTopColor).toBe(hovered.border);
    await expect.poll(() => getComputedStyle(list()).backgroundColor).toBe(own);

    await userEvent.unhover(list());
    fixture.componentInstance.tags.disable();
    fixture.detectChanges();
    expect(list().classList).toContain('disabled');
    await expect.poll(() => getComputedStyle(list()).backgroundColor).toBe(style('.reference-disabled').backgroundColor);
    await expect.poll(() => getComputedStyle(list()).borderTopColor).toBe(style('.reference-disabled').borderTopColor);
  });

  it('should darken a filled basic tag under the pointer, which lightening would lose in the field', async () => {
    const tag = fixture.nativeElement.querySelector('nb-tag') as HTMLElement;
    const probe = (variable: string) => {
      const span = document.createElement('span');
      span.style.color = `var(--${variable})`;
      list().append(span);
      const value = getComputedStyle(span).color;
      span.remove();
      return value;
    };
    await userEvent.hover(tag);
    await expect.poll(() => getComputedStyle(tag).backgroundColor).toBe(probe('tag-filled-basic-active-background-color'));
    expect(getComputedStyle(tag).backgroundColor).not.toBe(getComputedStyle(list()).backgroundColor);
  });
});
