import { Component, input } from '@angular/core'

/**
 * A soft glow of a colour, for behind a page's content: a radial gradient from the colour at its centre to nothing at
 * its edge, which looks like a blurred blob without a blur filter, whose stale paint Safari keeps as the page changes.
 * Place and size it with the host's own styles, e.g. `position: absolute; inset: -10rem auto auto -10rem; width: 40rem`,
 * inside an `overflow: hidden` ancestor; it's square, and stays out of the way of the pointer.
 */
@Component({
    selector: 'npg-showcase-glow',
    template: '',
    styles: `
    :host {
      display: block;
      aspect-ratio: 1;
      pointer-events: none;
      background: radial-gradient(
        circle closest-side,
        color-mix(in srgb, var(--glow-color) var(--glow-opacity), transparent) var(--glow-solid),
        color-mix(in srgb, var(--glow-color) calc(var(--glow-opacity) / 2), transparent) var(--glow-half),
        transparent
      );
    }
  `,
    host: {
        '[style.--glow-color]': 'color()',
        '[style.--glow-opacity]': 'opacity() + "%"',
        '[style.--glow-solid]': 'solid() + "%"',
        '[style.--glow-half]': 'half() + "%"'
    }
})
export class ShowcaseGlowComponent {
    /** The glow's colour, as a CSS colour, e.g. `var(--color-primary-400)`. */
    readonly color = input('var(--color-primary-400)')
    /** How opaque its centre is, in percent. */
    readonly opacity = input(70)
    /** Up to which share of its radius it's fully that opaque, in percent. */
    readonly solid = input(0)
    /** At which share of its radius it's half as opaque, in percent. */
    readonly half = input(50)
}
