import { NbOverlayRef } from './mapping';

const SHOWING = 'cdk-overlay-backdrop-showing';
/** How long a backdrop's fade is waited for before the overlay is removed anyway, as the CDK does. */
const FADE_TIMEOUT = 500;

/** Runs `done` once the backdrop's transition ends, or after a timeout for a backdrop that doesn't transition. */
function afterFade(backdrop: HTMLElement, done: () => void) {
  let finished = false;
  const finish = () => {
    if (!finished) {
      finished = true;
      done();
    }
  };
  backdrop.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, FADE_TIMEOUT);
}

/**
 * Disposes of a detached overlay once its backdrop has faded out: `detach()` starts the fade, while `dispose()` would
 * remove the backdrop at once.
 */
export function disposeAfterBackdrop(overlayRef: NbOverlayRef) {
  const backdrop = overlayRef.backdropElement;
  if (!backdrop) {
    overlayRef.dispose();
    return;
  }
  afterFade(backdrop, () => overlayRef.dispose());
}

/**
 * Shows or hides an overlay's backdrop that stays attached, with the fade the CDK gives it. Hiding, it's inert at
 * once, so it catches no click while it fades, and out of the way (`hidden`) after; shown, it fades in from there.
 */
export function fadeBackdrop(backdrop: HTMLElement, shown: boolean) {
  if (shown) {
    backdrop.removeAttribute('inert');
    backdrop.removeAttribute('hidden');
    // On the next frame, so the fade starts from the backdrop's hidden state.
    requestAnimationFrame(() => {
      if (!backdrop.hasAttribute('inert')) {
        backdrop.classList.add(SHOWING);
      }
    });
    return;
  }
  backdrop.setAttribute('inert', '');
  backdrop.classList.remove(SHOWING);
  afterFade(backdrop, () => {
    if (backdrop.hasAttribute('inert')) {
      backdrop.setAttribute('hidden', '');
    }
  });
}
