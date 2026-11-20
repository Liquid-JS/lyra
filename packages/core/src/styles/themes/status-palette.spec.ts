import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbButtonModule, NbThemeModule } from '@liquid-js/lyr-core';

const themes = ['default', 'palette-default', 'palette-lyra', 'palette-material', 'palette-grey'];
const shades = [100, 200, 300, 400, 500, 600, 700, 800, 900];

@Component({
  template: `
    @for (theme of themes; track theme) {
      <div [class]="'nb-theme-' + theme" [attr.data-theme]="theme">
        <button nbButton status="primary">Button</button>
      </div>
    }
  `,
  styleUrl: './status-palette.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbButtonModule],
})
class PaletteHostComponent {
  readonly themes = themes;
}

// The distance of two colours in OKLab, in percent.
const oklab = (color: string) => {
  const [r, g, b] = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((value) => {
    const channel = Number(value) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const distance = (a: string, b: string) => {
  const [x, y] = [oklab(a), oklab(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100;
};
const hex = (value: string) =>
  `rgb(${[1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)).join(', ')})`;

describe('nb-status-palette', () => {
  let fixture: ComponentFixture<PaletteHostComponent>;

  const theme = (name: string) => fixture.nativeElement.querySelector(`[data-theme=${name}]`) as HTMLElement;
  const color = (name: string, variable: string) => {
    const probe = document.createElement('span');
    theme(name).appendChild(probe);
    probe.style.color = `var(--${variable})`;
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };
  const errors = (name: string, status: string, expected: Record<number, string>) =>
    shades.map((shade) => distance(color(name, `color-${status}-${shade}`), hex(expected[shade])));
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value) / values.length;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(PaletteHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should make the default primary palette from its 500 shade', () => {
    const defaults = Object.fromEntries(shades.map((shade) => [shade, color('default', `color-primary-${shade}`)]));
    const found = shades.map((shade) => distance(color('palette-default', `color-primary-${shade}`), defaults[shade]));

    expect(mean(found)).toBeLessThan(3);
    expect(Math.max(...found)).toBeLessThan(5);
  });

  it('should make a palette close to a colour generator\'s for another colour', () => {
    // Made by the generator for #a855f7.
    const found = errors('palette-lyra', 'primary', {
      100: '#f5ddfe',
      200: '#e7bbfe',
      300: '#d699fc',
      400: '#c47ffa',
      500: '#a855f7',
      600: '#833ed4',
      700: '#622ab1',
      800: '#441b8f',
      900: '#2f1076',
    });

    expect(mean(found)).toBeLessThan(6);
    expect(Math.max(...found)).toBeLessThan(10);
  });

  it('should make a Material Design palette', () => {
    const found = errors('palette-material', 'primary', {
      100: '#c8d9db',
      200: '#a3c0c3',
      300: '#7ea6aa',
      400: '#629398',
      500: '#468086',
      600: '#3f787e',
      700: '#376d73',
      800: '#2f6369',
      900: '#205056',
    });

    // Not one of the palettes the steps were fitted to.
    expect(mean(found)).toBeLessThan(4);
    expect(Math.max(...found)).toBeLessThan(8);
  });

  it('should make the transparent shades and the statuses it is given', () => {
    expect(color('palette-lyra', 'color-primary-transparent-100')).toBe('rgba(168, 85, 247, 0.08)');
    expect(color('palette-lyra', 'color-primary-transparent-600')).toBe('rgba(168, 85, 247, 0.48)');
    expect(color('palette-lyra', 'color-success-500')).toBe(hex('#92e539'));
    expect(color('palette-lyra', 'color-info-500')).toBe(hex('#32d0fc'));
    // Statuses it isn't given come from the parent theme.
    expect(color('palette-lyra', 'color-danger-500')).toBe(color('default', 'color-danger-500'));
  });

  it('should make shades of a grey, lighter and darker in turn', () => {
    const lightness = shades.map((shade) => oklab(color('palette-grey', `color-basic-${shade}`))[0]);
    expect(lightness).toEqual([...lightness].sort((a, b) => b - a));
    expect(new Set(lightness).size).toBe(shades.length);
  });

  it('should colour the components of the theme', () => {
    const button = theme('palette-lyra').querySelector('button') as HTMLElement;
    expect(getComputedStyle(button).backgroundColor).toBe(hex('#a855f7'));
  });
});
