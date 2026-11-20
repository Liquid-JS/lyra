import { TestBed } from '@angular/core/testing'

import {
    NB_LAYOUT_SCROLL_BLOCK_CLASS,
    NbBlockScrollStrategyAdapter,
    NbLayoutScrollService,
    NbThemeModule,
    NbViewportRulerAdapter
} from '@liquid-js/lyr-core'

describe('NbBlockScrollStrategyAdapter', () => {
    let scrollService: NbLayoutScrollService
    let strategy: NbBlockScrollStrategyAdapter
    const html = document.documentElement

    /** The document as no overlay left it: other specs may leave one open, with the document locked. */
    const unlock = () => {
        html.classList.remove('cdk-global-scrollblock', NB_LAYOUT_SCROLL_BLOCK_CLASS)
        html.style.removeProperty('top')
        html.style.removeProperty('left')
    }

    beforeEach(() => {
        unlock()
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        scrollService = TestBed.inject(NbLayoutScrollService)
        // A short viewport scrolled down, so the document lock applies.
        const ruler = {
            getViewportSize: () => ({ width: 100, height: 10 }),
            getViewportScrollPosition: () => ({ top: 600, left: 0 })
        } as unknown as NbViewportRulerAdapter
        strategy = new NbBlockScrollStrategyAdapter(document, ruler, scrollService)
    })

    afterEach(() => {
        strategy.disable()
        unlock()
    })

    it('should lock the document when it scrolls', () => {
        strategy.enable()
        expect(html.classList).toContain('cdk-global-scrollblock')
        expect(html.style.top).toBe('-600px')

        strategy.disable()
        expect(html.classList).not.toContain('cdk-global-scrollblock')
    })

    // The layout blocks its container and marks the document; pinning the document too would move the page.
    it('should leave the document be when the layout scrolls in its own container', () => {
        const subscription = scrollService.onScrollableChange().subscribe((scrollable) => {
            html.classList.toggle(NB_LAYOUT_SCROLL_BLOCK_CLASS, !scrollable)
        })

        strategy.enable()
        expect(html.classList).toContain(NB_LAYOUT_SCROLL_BLOCK_CLASS)
        expect(html.classList).not.toContain('cdk-global-scrollblock')
        expect(html.style.top).toBe('')

        strategy.disable()
        expect(html.classList).not.toContain(NB_LAYOUT_SCROLL_BLOCK_CLASS)
        subscription.unsubscribe()
    })
})
