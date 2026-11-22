const running = new WeakMap<HTMLElement, Animation>()

/**
 * How long a height change of `distance` pixels takes: longer for taller content, but less than in proportion, so a
 * long panel opening beside a short one closing doesn't rush, nor drag. About 200ms for 50px, 290ms for 200px and
 * 410ms for 600px, at most 600ms.
 */
export function expandDuration(distance: number): number {
    return distance > 0 ? Math.min(600, Math.round(120 + 12 * Math.sqrt(distance))) : 0
}

/**
 * Animates an element's height to its content height or to 0, after its styles changed to the new state.
 *
 * CSS can't transition to `height: auto`, so the heights are measured: the element's styles hold the end state, and the
 * animation covers the change from the height it had. A change while one is running starts from where it is, so it
 * turns back without a jump. Content that changes size while it opens, e.g. its own parts opening or images loading, is
 * followed to the end the animation was going to have, rather than reached with a jump once it ends. `keep` is held on
 * every frame, e.g. the visibility a collapsed element only gets at the end. Without a `duration`, it takes
 * {@link expandDuration} of the distance.
 */
export function animateExpand(
    element: HTMLElement,
    expanded: boolean,
    options: KeyframeAnimationOptions = {},
    keep: Keyframe = {}
) {
    if (typeof element.animate !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
    }

    const previous = running.get(element)
    let from: number
    if (previous) {
        from = element.getBoundingClientRect().height
        previous.cancel()
    } else if (expanded) {
        from = 0
    } else {
        // Measured at the height it had: laid out collapsed, even just to measure, a scroll container around it would
        // drop to its shorter content at once, rather than as it closes.
        const height = element.style.height
        element.style.height = 'auto'
        from = element.scrollHeight
        element.style.height = height
    }
    run(element, from, expanded ? element.scrollHeight : 0, options, keep)
}

function run(element: HTMLElement, from: number, to: number, options: KeyframeAnimationOptions, keep: Keyframe, elapsed?: number) {
    const animation = element.animate(
        [
            { ...keep, height: `${from}px` },
            { ...keep, height: `${to}px` }
        ],
        { duration: expandDuration(Math.abs(to - from)), ...options }
    )
    // One that takes over from another goes on at once, rather than holding still for the frame a new one waits to start.
    const timelineTime = document.timeline.currentTime
    if (elapsed !== undefined && timelineTime !== null) {
        animation.startTime = Number(timelineTime) - elapsed
    }
    running.set(element, animation)

    // The content's size, as it changes while it opens; the element's own height is the animated one. The animation is
    // changed on the next frame: changing layout while the observer reports would make it report again in that frame.
    let frame = 0
    const follow = () => {
        frame = 0
        const target = element.scrollHeight
        if (running.get(element) !== animation || Math.abs(target - to) < 1) {
            return
        }
        const timing = animation.effect?.getComputedTiming()
        const now = Number(animation.currentTime ?? 0)
        const current = element.getBoundingClientRect().height
        animation.cancel()
        if (Number(timing?.progress ?? 0) < 0.15) {
            // Content that settles as it renders, e.g. its own parts appearing: as if it had opened to that height
            // from the start, which this early is only a few pixels from where it is.
            run(element, from, target, options, keep, now)
        } else {
            // On from where it is, to end when this one would have, and without easing in again.
            const remaining = Number(timing?.endTime ?? 0) - now
            run(element, current, target, { ...options, duration: Math.max(remaining, 100), easing: 'ease-out' }, keep, 0)
        }
    }
    const observer = to > from && typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => {
            frame ||= requestAnimationFrame(follow)
        })
        : undefined
    Array.from(element.children).forEach((child) => observer?.observe(child))

    animation.onfinish = animation.oncancel = () => {
        observer?.disconnect()
        cancelAnimationFrame(frame)
        if (running.get(element) === animation) {
            running.delete(element)
        }
    }
}
