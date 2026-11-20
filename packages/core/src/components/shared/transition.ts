import { afterNextRender, inject, NgZone } from '@angular/core';

/**
 * Adds `nb-transition` to an element after its first render, so the styles it renders with don't animate in (#2254).
 * Call it in an injection context.
 */
export function enableTransitionsAfterRender(element: HTMLElement) {
  const zone = inject(NgZone);
  afterNextRender(() => zone.runOutsideAngular(() => setTimeout(() => element.classList.add('nb-transition'))));
}
