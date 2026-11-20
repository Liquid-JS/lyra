import { NbComponentOrCustomStatus, NbComponentStatus, NbJSThemeOptions } from '@liquid-js/lyr-core';

/**
 * A colour a chart draws a series or slice in: a status's, a custom status included, or a CSS colour of its own, e.g.
 * `#8f9bb3`, `rgb(143 155 179)` or a theme variable, `var(--color-info-300)`.
 */
export type NbChartColor =
  | NbComponentOrCustomStatus
  | `#${string}`
  | `rgb${string}`
  | `hsl${string}`
  | `oklch${string}`
  | `var(--${string})`;

/** The theme's colours and font, as a chart draws with them. */
export interface NbChartTheme {
  /** Each status's colour, and a light tint of it for areas. */
  status: Record<NbComponentStatus, { color: string; tint: string }>;
  /** A colour of the series' or slices' own, as the chart draws it, with a light tint of it for areas. */
  colorOf(color: NbChartColor): { color: string; tint: string };
  text: string;
  hint: string;
  grid: string;
  /** What slices are separated by: the background the chart is on, e.g. a card's. */
  surface: string;
  tooltipBackground: string;
  tooltipText: string;
  fontFamily: string;
  /** The theme's caption size in pixels, which follows the content size. */
  fontSize: number;
}

const STATUSES: NbComponentStatus[] = ['basic', 'primary', 'success', 'info', 'warning', 'danger', 'control'];

/** A colour with some transparency, from a hex or rgb colour; other colours as they are. */
function tint(color: string, alpha: number) {
  const hex = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(color);
  if (hex) {
    const [r, g, b] = hex.slice(1).map((channel) => parseInt(channel, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const rgb = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(color);
  return rgb ? `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})` : color;
}

/** The background an element shows on: its own, or its nearest ancestor's that has one. */
function surfaceOf(element: HTMLElement) {
  for (let current: Element | null = element; current; current = current.parentElement) {
    const background = getComputedStyle(current).backgroundColor;
    if (background && background !== 'transparent' && !/^rgba\(.*,\s*0\)$/.test(background)) {
      return background;
    }
  }
  return '';
}

/** A length such as `0.75rem` or `12px` in pixels. */
function pixels(length: string, rootFontSize: number) {
  const value = parseFloat(length);
  return length.trim().endsWith('rem') ? value * rootFontSize : value;
}

/**
 * Reads the theme an element shows: its CSS custom properties, or with a theme built without them, the theme's JS
 * variables.
 *
 * @internal
 */
export function nbReadChartTheme(element: HTMLElement, jsTheme?: NbJSThemeOptions): NbChartTheme {
  const style = getComputedStyle(element);
  const rootFontSize = parseFloat(getComputedStyle(element.ownerDocument.documentElement).fontSize) || 16;
  const variable = (name: string) => style.getPropertyValue(`--${name}`).trim();
  const js = (jsTheme?.variables ?? {}) as Record<string, string>;

  const status = Object.fromEntries(
    STATUSES.map((name) => {
      // Basic in the hint colour, as its fill colour is too faint for a line or a slice.
      const color =
        (name === 'basic' ? variable('text-hint-color') || js['fg'] : variable(`color-${name}-default`) || js[name]) ||
        js['fgText'] ||
        '#808080';
      return [name, { color, tint: variable(`color-${name}-transparent-200`) || tint(color, 0.16) }];
    }),
  ) as NbChartTheme['status'];

  // A colour the canvas can draw: a status's, or a CSS variable's value where the chart is, which it can't read itself.
  const colorOf = (value: NbChartColor) => {
    if (value in status) {
      return status[value as NbComponentStatus];
    }
    let color: string = value;
    // A custom status: its colour, as the theme defines it; otherwise a CSS colour name.
    if (/^[a-z][\w-]*$/i.test(value)) {
      const custom = variable(`color-${value}-default`);
      if (custom) {
        return { color: custom, tint: variable(`color-${value}-transparent-200`) || tint(custom, 0.16) };
      }
    }
    if (value.startsWith('var(')) {
      element.style.setProperty('--nb-chart-color', value);
      color = getComputedStyle(element).getPropertyValue('--nb-chart-color').trim() || value;
      element.style.removeProperty('--nb-chart-color');
    }
    return { color, tint: tint(color, 0.16) };
  };

  const caption = variable('text-caption-font-size');
  return {
    status,
    colorOf,
    text: variable('text-basic-color') || js['fgText'] || style.color,
    hint: variable('text-hint-color') || js['fg'] || style.color,
    grid: variable('divider-color') || js['separator'] || 'rgba(128, 128, 128, 0.24)',
    surface: surfaceOf(element) || variable('background-basic-color-1') || js['bg'] || '#ffffff',
    // As the theme's tooltips are.
    tooltipBackground:
      variable('tooltip-background-color') || variable('background-alternative-color-3') || js['fgText'] || '#222b45',
    tooltipText: variable('tooltip-text-color') || variable('text-alternate-color') || js['bg'] || '#ffffff',
    fontFamily: variable('font-family-primary') || js['fontMain'] || style.fontFamily,
    fontSize: caption ? pixels(caption, rootFontSize) : 0.75 * rootFontSize,
  };
}
