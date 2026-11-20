const running = new WeakMap<HTMLElement, Animation>();

/**
 * How long a height change of `distance` pixels takes: longer for taller content, but less than in proportion, so a
 * long panel opening beside a short one closing doesn't rush, nor drag. About 200ms for 50px, 290ms for 200px and
 * 410ms for 600px, at most 600ms.
 */
export function expandDuration(distance: number): number {
  return distance > 0 ? Math.min(600, Math.round(120 + 12 * Math.sqrt(distance))) : 0;
}

/**
 * Animates an element's height to its content height or to 0, after its styles changed to the new state.
 *
 * CSS can't transition to `height: auto`, so the heights are measured: the element's styles hold the end state, and the
 * animation covers the change from the height it had. A change while one is running starts from where it is, so it
 * turns back without a jump. `keep` is held on every frame, e.g. the visibility a collapsed element only gets at the end.
 * Without a `duration`, it takes {@link expandDuration} of the distance.
 */
export function animateExpand(
  element: HTMLElement,
  expanded: boolean,
  options: KeyframeAnimationOptions = {},
  keep: Keyframe = {},
) {
  if (typeof element.animate !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const previous = running.get(element);
  let from: number;
  if (previous) {
    from = element.getBoundingClientRect().height;
    previous.cancel();
  } else {
    // A collapsed element still lays out its content, so its scroll height is the height it collapses from.
    from = expanded ? 0 : element.scrollHeight;
  }
  const to = expanded ? element.scrollHeight : 0;

  const animation = element.animate(
    [
      { ...keep, height: `${from}px` },
      { ...keep, height: `${to}px` },
    ],
    { duration: expandDuration(Math.abs(to - from)), ...options },
  );
  running.set(element, animation);
  animation.onfinish = animation.oncancel = () => {
    if (running.get(element) === animation) {
      running.delete(element);
    }
  };
}
