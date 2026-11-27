/** How a panel is swiped away: toward which edge, what follows the drag, and what dismisses it. */
export interface NbSwipeToDismissOptions {
    /** The screen's edge the panel goes to, e.g. a sheet's `bottom` or a drawer's side. */
    edge: 'bottom' | 'left' | 'right'
    /** How far it's dragged, from 0 to 1 of its size, e.g. to fade a backdrop with it. */
    progress?: (fraction: number) => void
    /** Dismisses it, from where the drag left it: its `transform` holds the drag. */
    dismiss: () => void
}

// A drag starts past this many pixels along the edge's way, more than across it.
const SLOP = 10
// Dismisses past this share of the panel's size, or with a flick faster than this, in pixels a millisecond.
const DISTANCE = 0.3
const FLICK = 0.5

/**
 * Lets a touch swipe `panel` away toward an edge, e.g. a sheet down: it follows the finger, and goes once it's dragged
 * a third of its size or flicked; otherwise it moves back. Content scrolled away from that edge, e.g. a sheet's list
 * scrolled down, scrolls back first. Mice and pens don't drag it. Returns a function that stops it.
 *
 * @internal
 */
export function nbSwipeToDismiss(panel: HTMLElement, options: NbSwipeToDismissOptions): () => void {
    const { edge, progress, dismiss } = options
    const vertical = edge === 'bottom'
    let start: { x: number, y: number } | undefined
    let dragging = false
    let offset = 0
    let sample = { offset: 0, time: 0 }
    let velocity = 0

    const along = (touch: Touch, from: { x: number, y: number }) =>
        vertical ? touch.clientY - from.y : edge === 'right' ? touch.clientX - from.x : from.x - touch.clientX
    const across = (touch: Touch, from: { x: number, y: number }) => Math.abs(vertical ? touch.clientX - from.x : touch.clientY - from.y)
    const size = () => (vertical ? panel.offsetHeight : panel.offsetWidth)
    const transform = (distance: number) =>
        vertical ? `translateY(${distance}px)` : `translateX(${edge === 'right' ? distance : -distance}px)`

    // Whether what's under the finger scrolls, and isn't at its start that way, so the touch scrolls it.
    const scrolls = (target: EventTarget | null) => {
        for (let element = target instanceof Element ? target : null; element && element !== panel.parentElement; element = element.parentElement) {
            if (vertical ? element.scrollTop > 0 : element.scrollWidth > element.clientWidth && getComputedStyle(element).overflowX !== 'hidden') {
                return true
            }
        }
        return false
    }

    const settle = () => {
        start = undefined
        dragging = false
        if (!offset) {
            return
        }
        const from = panel.style.transform
        offset = 0
        progress?.(0)
        const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
        if (typeof panel.animate === 'function' && !reduced) {
            panel.animate([{ transform: from }, { transform: transform(0) }], { duration: 150, easing: 'ease-out' })
        }
        panel.style.transform = ''
    }

    const onStart = (event: TouchEvent) => {
        const touch = event.touches.length === 1 ? event.touches[0] : undefined
        start = touch && !scrolls(event.target) ? { x: touch.clientX, y: touch.clientY } : undefined
        dragging = false
    }

    const onMove = (event: TouchEvent) => {
        const touch = event.touches[0]
        if (!start || !touch) {
            return
        }
        const distance = along(touch, start)
        if (!dragging) {
            // Toward the edge, mostly, it's claimed from the first move, as the browser starts a scroll on it otherwise;
            // past a few pixels it drags. Any other way, the touch is the page's, e.g. a scroll.
            if (distance < 0 || across(touch, start) > distance) {
                start = undefined
                return
            }
            event.preventDefault()
            if (distance > SLOP) {
                dragging = true
                sample = { offset: 0, time: event.timeStamp }
            }
            return
        }
        event.preventDefault()
        offset = Math.max(0, distance)
        panel.style.transform = transform(offset)
        progress?.(Math.min(1, offset / (size() || 1)))
        const elapsed = event.timeStamp - sample.time
        if (elapsed > 0) {
            velocity = (offset - sample.offset) / elapsed
            sample = { offset, time: event.timeStamp }
        }
    }

    const onEnd = (event: TouchEvent) => {
        // A finger that stopped before it lifted didn't flick.
        const flicked = velocity > FLICK && event.timeStamp - sample.time < 100
        if (dragging && (offset > size() * DISTANCE || flicked)) {
            start = undefined
            dragging = false
            dismiss()
            return
        }
        settle()
    }

    panel.addEventListener('touchstart', onStart, { passive: true })
    // Not passive: a drag keeps the page from scrolling.
    panel.addEventListener('touchmove', onMove, { passive: false })
    panel.addEventListener('touchend', onEnd)
    panel.addEventListener('touchcancel', settle)
    return () => {
        panel.removeEventListener('touchstart', onStart)
        panel.removeEventListener('touchmove', onMove)
        panel.removeEventListener('touchend', onEnd)
        panel.removeEventListener('touchcancel', settle)
    }
}
