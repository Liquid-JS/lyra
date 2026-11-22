import { animateExpand, expandDuration } from './expand-animation'

describe('expandDuration', () => {
    it('should take longer for taller content, but less than in proportion', () => {
        const [short, medium, tall] = [50, 200, 600].map(expandDuration)
        expect(short).toBeGreaterThan(150)
        expect(medium).toBeGreaterThan(short)
        expect(tall).toBeGreaterThan(medium)
        // Twelve times the height, not twelve times the time.
        expect(tall / short).toBeLessThan(2.5)
        expect(expandDuration(5000)).toBe(600)
        expect(expandDuration(0)).toBe(0)
    })
})

describe('animateExpand', () => {
    const element = (height: number) => {
        const container = document.createElement('div')
        container.style.overflow = 'hidden'
        container.innerHTML = `<div style="height: ${height}px"></div>`
        document.body.appendChild(container)
        return container
    }

    afterEach(() => document.body.replaceChildren())

    it('should time an expansion by the height it covers', () => {
        const short = element(40)
        const tall = element(800)
        animateExpand(short, true)
        animateExpand(tall, true)

        const duration = (target: HTMLElement) => Number(target.getAnimations()[0].effect?.getTiming().duration)
        expect(duration(short)).toBe(expandDuration(40))
        expect(duration(tall)).toBe(expandDuration(800))
    })

    it('should keep a duration it is given', () => {
        const target = element(800)
        animateExpand(target, true, { duration: 120 })
        expect(target.getAnimations()[0].effect?.getTiming().duration).toBe(120)
    })

    it('should keep a scroll container around it where it is as it starts to close', () => {
        const scroller = document.createElement('div')
        scroller.style.cssText = 'height: 200px; overflow: auto'
        const target = element(600)
        scroller.appendChild(target)
        scroller.insertAdjacentHTML('beforeend', '<div style="height: 100px"></div>')
        document.body.appendChild(scroller)
        scroller.scrollTop = 500

        // Collapsed by its styles, as a component's state does, then animated from the height it had.
        target.style.height = '0'
        animateExpand(target, false)

        expect(scroller.scrollTop).toBe(500)
    })

    describe('with content that grows while it opens', () => {
        const end = async (target: HTMLElement) => {
            const [animation] = target.getAnimations()
            await animation.ready
            const effect = animation.effect as KeyframeEffect
            return {
                height: effect.getKeyframes().at(-1)?.['height'],
                easing: effect.getTiming().easing,
                endTime: Number(animation.startTime) + Number(effect.getComputedTiming().endTime)
            }
        }
        const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))
        const grow = async (target: HTMLElement) => {
            target.querySelector('div')?.style.setProperty('height', '300px')
            // Observed after the next layout, and followed on the frame after.
            await frame()
            await frame()
            await frame()
        }

        it('should start over to its height as it starts, e.g. as the content renders', async () => {
            const target = element(100)
            animateExpand(target, true, { easing: 'ease-in-out' })
            await frame()

            await grow(target)

            expect(target.getAnimations()).toHaveLength(1)
            expect(await end(target)).toMatchObject({ height: '300px', easing: 'ease-in-out' })
        })

        it('should follow it later on, to end when it would have', async () => {
            const target = element(100)
            animateExpand(target, true, { duration: 1000 })
            const before = await end(target)
            await new Promise((resolve) => setTimeout(resolve, 300))

            await grow(target)

            expect(target.getAnimations()).toHaveLength(1)
            const after = await end(target)
            expect(after.height).toBe('300px')
            expect(after.easing).toBe('ease-out')
            expect(Math.abs(after.endTime - before.endTime)).toBeLessThan(50)
        })
    })
})
