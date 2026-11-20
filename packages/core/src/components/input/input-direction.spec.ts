import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NbInputModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" dir="rtl">
      <input nbInput type="email" class="email" />
      <input nbInput type="tel" class="tel" />
      <input nbInput type="url" class="url" />
      <input nbInput type="text" class="text" />
    </div>
  `,
  styleUrl: './input-direction.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbInputModule],
})
class InputDirectionHostComponent {}

describe('NbInputDirective in a right-to-left page', () => {
  it('should lay out emails, phone numbers and URLs left to right, from the left, in the page\'s direction', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), InputDirectionHostComponent],
    }).createComponent(InputDirectionHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const styleOf = (selector: string) => getComputedStyle(fixture.nativeElement.querySelector(selector));

    for (const field of ['.email', '.tel', '.url']) {
      // The field keeps the page's direction, so a form field's padding stays on its prefix's side.
      expect(styleOf(field).direction).toBe('rtl');
      expect(styleOf(field).textAlign).toBe('left');
      expect(styleOf(field).unicodeBidi).toBe('plaintext');
    }
    // Other text takes the page's direction and alignment.
    expect(styleOf('.text').unicodeBidi).not.toBe('plaintext');
    expect(styleOf('.text').textAlign).not.toBe('left');
    fixture.destroy();
  });
});
