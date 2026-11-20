import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const themes = ['default', 'dark'];
const statuses = ['primary', 'success', 'info', 'warning', 'danger'];

@Component({
  template: `
    @for (theme of themes; track theme) {
      <div [class]="'nb-theme-' + theme" [attr.data-theme]="theme">
        @for (status of statuses; track status) {
          @for (level of [1, 2, 3, 4, 5]; track level) {
            <span [class]="'border-probe-' + status + '-' + level"></span>
            @if (level < 5) {
              <span [class]="'background-probe-' + status + '-' + level"></span>
            }
          }
        }
      </div>
    }
  `,
  styleUrl: './status-colors.spec.scss',
  encapsulation: ViewEncapsulation.None,
})
class ThemesHostComponent {
  readonly themes = themes;
  readonly statuses = statuses;
}

describe('Theme status colours', () => {
  let fixture: ComponentFixture<ThemesHostComponent>;

  const style = (theme: string, selector: string) =>
    getComputedStyle(fixture.nativeElement.querySelector(`[data-theme=${theme}] ${selector}`) as HTMLElement);

  beforeEach(async () => {
    fixture = TestBed.createComponent(ThemesHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  for (const theme of themes) {
    it(`should take each status's backgrounds and borders from its own shades in the ${theme} theme`, () => {
      for (const status of statuses) {
        for (const level of [1, 2, 3, 4, 5]) {
          const border = style(theme, `.border-probe-${status}-${level}`);
          expect(border.color, `border-${status}-color-${level}`).toBe(border.backgroundColor);
          if (level < 5) {
            const background = style(theme, `.background-probe-${status}-${level}`);
            expect(background.color, `background-${status}-color-${level}`).toBe(background.backgroundColor);
          }
        }
      }
    });
  }
});
