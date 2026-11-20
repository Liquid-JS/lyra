import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';

import { NbButtonModule, NbListModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" [attr.dir]="'ltr'" style="width: 30rem">
      <nb-list>
        <nb-list-item class="structured">
          <span class="start">#</span>
          <nb-list-item-title>
            <a nbListItemLink class="link" href="#1042">Invoice 1042</a>
            <nb-list-item-description>Due 1 March</nb-list-item-description>
          </nb-list-item-title>
          <nb-list-item-actions><button nbButton size="small" class="pay">Pay</button></nb-list-item-actions>
        </nb-list-item>
        <nb-list-item class="plain"><span class="one">One</span><span class="two">Two</span></nb-list-item>
      </nb-list>
    </div>
  `,
  styleUrl: './list-item-layout.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbListModule, NbButtonModule],
})
class ListItemHostComponent {}

describe('nb-list-item layout and nbListItemLink', () => {
  let fixture: ComponentFixture<ListItemHostComponent>;

  const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;
  const rect = (selector: string) => element(selector).getBoundingClientRect();
  /** The element a pointer finds at the centre of another one. */
  const hitAt = (selector: string) => {
    const box = rect(selector);
    return document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(ListItemHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('should put the title in the free space with its description under it, and the actions at the end', () => {
    const item = rect('.structured');
    const title = rect('nb-list-item-title');
    expect(title.left).toBeGreaterThan(rect('.start').right);
    expect(rect('nb-list-item-description').top).toBeGreaterThanOrEqual(rect('.link').bottom - 1);
    expect(rect('nb-list-item-actions').left).toBeGreaterThanOrEqual(title.right);
    const paddingEnd = parseFloat(getComputedStyle(element('.structured')).paddingInlineEnd);
    expect(rect('nb-list-item-actions').right).toBeCloseTo(item.right - paddingEnd, 0);
    // The description is quieter than the title.
    expect(getComputedStyle(element('nb-list-item-description')).color).not.toBe(
      getComputedStyle(element('nb-list-item-title')).color,
    );
  });

  it('should keep the spacing of plain content', () => {
    expect(getComputedStyle(element('.structured')).columnGap).not.toBe('normal');
    expect(getComputedStyle(element('.plain')).columnGap).toBe('normal');
    expect(rect('.two').left).toBeCloseTo(rect('.one').right, 0);
  });

  it('should let the link cover the item, and keep its actions their own', () => {
    expect(element('.link').classList).toContain('list-item-link');
    expect(hitAt('nb-list-item-description')).toBe(element('.link'));
    expect(hitAt('.start')).toBe(element('.link'));
    expect(hitAt('.pay')).toBe(element('.pay'));
  });

  it('should show the link\'s hover on the item', async () => {
    const resting = getComputedStyle(element('.structured')).backgroundColor;
    await userEvent.hover(element('.link'));
    await expect.poll(() => getComputedStyle(element('.structured')).backgroundColor).not.toBe(resting);
  });
});
