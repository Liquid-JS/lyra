import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const themes = ['default', 'dark', 'cosmic', 'corporate', 'material-light', 'material-dark'];

@Component({
  template: `
    @for (theme of themes; track theme) {
      <div [class]="'nb-theme-' + theme"><span class="probe" [attr.data-theme]="theme">Link</span></div>
    }
  `,
  styleUrl: './focus-text.spec.scss',
  encapsulation: ViewEncapsulation.None,
})
class ThemesHostComponent {
  readonly themes = themes;
}

const luminance = (color: string) => {
  const [r, g, b] = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((value) => {
    const channel = Number(value) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

describe('Theme focus text', () => {
  let fixture: ComponentFixture<ThemesHostComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ThemesHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  for (const theme of themes) {
    it(`should keep a focused link readable on a card in the ${theme} theme`, () => {
      const probe = fixture.nativeElement.querySelector(`[data-theme=${theme}]`) as HTMLElement;
      const style = getComputedStyle(probe);

      expect(contrast(style.color, style.backgroundColor)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
