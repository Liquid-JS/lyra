import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbDividerModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" style="width: 30rem">
      <nb-divider class="plain" />
      <nb-divider class="labelled">or</nb-divider>
      <div class="row" style="display: flex; align-items: center; height: 3rem">
        <span>Home</span><nb-divider vertical class="in-row" /><span>Help</span>
      </div>
      <p class="text">Home <nb-divider vertical class="in-text" /> Help</p>
      <hr />
    </div>
  `,
  styleUrl: './divider.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbDividerModule],
})
class DividerHostComponent {}

describe('nb-divider', () => {
  let fixture: ComponentFixture<DividerHostComponent>;

  const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;
  const rect = (selector: string) => element(selector).getBoundingClientRect();
  const line = (selector: string, pseudo = '::before') => getComputedStyle(element(selector), pseudo);

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(DividerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should be a separator, vertical when it says so', () => {
    expect(element('.plain').getAttribute('role')).toBe('separator');
    expect(element('.plain').hasAttribute('aria-orientation')).toBe(false);
    expect(element('.in-row').getAttribute('role')).toBe('separator');
    expect(element('.in-row').getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should draw a full-width line, broken by its content in the middle', () => {
    expect(line('.plain').borderTopWidth).toBe('1px');
    const before = parseFloat(line('.plain', '::before').width);
    const after = parseFloat(line('.plain', '::after').width);
    expect(before + after).toBeCloseTo(rect('.plain').width, 0);

    const content = element('.labelled .divider-content').getBoundingClientRect();
    expect(parseFloat(getComputedStyle(element('.labelled .divider-content')).paddingInlineStart)).toBeGreaterThan(0);
    // Centred, with the line on both sides.
    const labelled = rect('.labelled');
    expect(content.left - labelled.left).toBeCloseTo(labelled.right - content.right, 0);
    expect(parseFloat(line('.labelled', '::after').width)).toBeGreaterThan(100);
  });

  it('should be as tall as a flex row, or as the text around it', () => {
    expect(rect('.in-row').height).toBeCloseTo(rect('.row').height, 0);
    expect(line('.in-row').borderTopStyle).toBe('none');
    expect(line('.in-row').borderLeftWidth).toBe('1px');

    const fontSize = parseFloat(getComputedStyle(element('.text')).fontSize);
    expect(rect('.in-text').height).toBeGreaterThanOrEqual(fontSize - 0.5);
    expect(rect('.in-text').height).toBeLessThan(fontSize * 2);
  });

  it('should give a plain hr the same line', () => {
    const hr = getComputedStyle(element('hr'));
    expect(hr.borderTopWidth).toBe('1px');
    expect(hr.borderTopColor).toBe(line('.plain').borderTopColor);
    expect(hr.borderBottomStyle).toBe('none');
  });
});
