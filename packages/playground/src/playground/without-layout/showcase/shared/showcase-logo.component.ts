import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SHOWCASE_LOGOS, ShowcaseLogoName } from './showcase-logos';

/**
 * A placeholder logo: in its own colours (`brand`), or in the text's colour (`mono`), which suits a restrained
 * layout. It's as tall as its host; set the host's height.
 */
@Component({
  selector: 'npg-showcase-logo',
  template: '',
  styles: `
    :host {
      display: inline-flex;
      height: 2rem;
    }

    :host ::ng-deep svg {
      height: 100%;
      width: auto;
    }
  `,
  host: {
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[innerHTML]': 'svg()',
  },
})
export class ShowcaseLogoComponent {
  protected readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<ShowcaseLogoName>();
  readonly colour = input<'brand' | 'mono'>('brand');
  /** What the logo stands for, for screen readers; without one, it's decoration and they skip it. */
  readonly label = input<string>();

  protected readonly svg = computed<SafeHtml>(() => {
    const { viewBox, markup } = SHOWCASE_LOGOS[this.name()];
    const paths = this.colour() === 'mono' ? markup.replace(/fill="#[0-9A-Fa-f]{3,8}"/g, 'fill="currentColor"') : markup;
    // The logos are this module's own markup, not input.
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" aria-hidden="true">${paths}</svg>`,
    );
  });
}
