/**
 * Calls `onMove` when an element moves on the page without scrolling or resizing, e.g. when a sidebar opens beside it
 * or content above it grows; returns a function that stops watching.
 *
 * An `IntersectionObserver` whose root margin shrinks the viewport to the element's own box sees all of it; once the
 * element moves, part of it falls outside that box and the observer reports it. Each report watches the new box. This
 * is how Floating UI's `autoUpdate` follows layout shifts, without measuring on every frame.
 */
export function observeMove(element: Element, onMove: () => void): () => void {
  const root = element.ownerDocument.documentElement;
  let observer: IntersectionObserver | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const stop = () => {
    clearTimeout(timeout);
    observer?.disconnect();
    observer = undefined;
  };

  const watch = (notify: boolean, threshold = 1) => {
    stop();
    const { left, top, width, height } = element.getBoundingClientRect();
    if (notify) {
      onMove();
    }
    // An element that isn't rendered has no box to watch.
    if (!width || !height) {
      return;
    }
    const inset = [top, root.clientWidth - (left + width), root.clientHeight - (top + height), left];
    const rootMargin = inset.map((side) => `${-Math.floor(side)}px`).join(' ');
    let first = true;
    const report = ([entry]: IntersectionObserverEntry[]) => {
      const ratio = entry.intersectionRatio;
      if (ratio !== threshold) {
        if (!first) {
          watch(true);
          return;
        }
        // The box was measured before a pending layout change: watch the part that's in view, or look again in a
        // moment if none of it is.
        if (ratio) {
          watch(false, ratio);
        } else {
          timeout = setTimeout(() => watch(false, 1e-7), 1000);
        }
      }
      first = false;
    };
    const options = { rootMargin, threshold: Math.max(0, Math.min(1, threshold)) || 1 };
    try {
      // The document as root lets the margin apply in a page shown in a frame too.
      observer = new IntersectionObserver(report, { ...options, root: element.ownerDocument });
    } catch {
      observer = new IntersectionObserver(report, options);
    }
    observer.observe(element);
  };

  if (typeof IntersectionObserver === 'undefined') {
    return () => undefined;
  }
  watch(false);
  return stop;
}
