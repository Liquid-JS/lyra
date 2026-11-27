import { expandDuration } from './expand-animation'

const hidden: Keyframe = { opacity: 0, transform: 'scale(0.96)' }
const shown: Keyframe = { opacity: 1, transform: 'none' }
// A sheet slides up from below the screen, without fading, so a see-through sheet's backdrop blur shows throughout:
// the browser blurs nothing behind an element whose ancestor is partly transparent.
const below: Keyframe = { transform: 'translateY(100%)' }
const inPlace: Keyframe = { transform: 'none' }

/**
 * Fades and scales a pane, a dialog's or a window's, in as it opens, or out before it's removed; a `sheet` slides up
 * from the bottom and back down, over a time that suits its height. The overlay fades the backdrop itself. Resolves
 * when the animation ends, or right away with reduced motion or where elements don't animate (the server).
 */
export function animatePane(pane: HTMLElement, opening: boolean, sheet = false): Promise<void> {
    if (
        typeof pane.animate !== 'function' ||
    (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
        return Promise.resolve()
    }
    const duration = opening ? 150 : 100
    const animation = pane.animate(opening ? [hidden, shown] : [shown, hidden], {
        duration,
        easing: opening ? 'ease-out' : 'ease-in',
        // Closing holds the end, so the pane doesn't flash back before it's removed.
        fill: opening ? 'none' : 'forwards'
    })
    return new Promise((resolve) => {
        const done = () => resolve()
        animation.finished.then(done, done)
        // A timer too, for clocks an animation doesn't follow, e.g. a test's fake timers.
        setTimeout(done, duration + 50)
    })
}
