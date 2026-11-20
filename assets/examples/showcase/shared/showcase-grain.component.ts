import { Component, input } from '@angular/core'

// Noise, as an SVG the browser draws once and tiles: a touch of texture over flat colour.
const NOISE =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * A film of grain over an area, which gives flat colour and gradients a printed, paper-like texture. It covers its
 * positioned ancestor (`position: absolute; inset: 0`), stays out of the way of the pointer, and blends with what's
 * under it; put it last in the area so it's on top, or set its `z-index`.
 */
@Component({
    selector: 'npg-showcase-grain',
    template: '',
    styles: `
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image: var(--grain-image);
      background-size: 160px 160px;
      mix-blend-mode: var(--grain-blend);
      opacity: var(--grain-opacity);
    }
  `,
    host: {
        '[style.--grain-image]': 'noise',
        '[style.--grain-opacity]': 'opacity()',
        '[style.--grain-blend]': 'blend()'
    }
})
export class ShowcaseGrainComponent {
    protected readonly noise = NOISE
    /** How strong the grain is, 0 to 1; a little goes a long way. */
    readonly opacity = input(0.12)
    /** How it blends with what's under it: `overlay` on light and dark alike, `multiply` to darken, `screen` to lighten. */
    readonly blend = input<'overlay' | 'multiply' | 'screen' | 'soft-light'>('overlay')
}
