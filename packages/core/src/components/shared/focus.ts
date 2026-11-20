/**
 * Focuses the control a click landed on, as Chrome and Firefox do. Safari doesn't focus checkboxes, radios and buttons
 * on click, so its users would never blur them, which is what marks a control touched, and they'd show no focus.
 */
export function focusOnClick(event: Event) {
  const target = event.currentTarget as HTMLElement | null;
  if (target && target !== target.ownerDocument.activeElement) {
    target.focus({ preventScroll: true });
  }
}
