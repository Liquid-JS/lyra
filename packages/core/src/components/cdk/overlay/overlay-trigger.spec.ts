import { TestBed } from '@angular/core/testing'
import { ComponentRef, DOCUMENT } from '@angular/core'
import { NbTrigger, NbTriggerStrategy, NbTriggerStrategyBuilderService, NB_DOCUMENT } from '@liquid-js/lyr-core'
import { userEvent } from 'vitest/browser'

const withContainer = (el: EventTarget) => () => ({ location: { nativeElement: el } } as ComponentRef<any>)
const createElement = (name = 'div') => {
    const el = document.createElement(name)
    document.body.appendChild(el)
    return el
}
const click = (el: EventTarget) => el.dispatchEvent(new Event('click', { bubbles: true }))
const mouseMove = (el: EventTarget) => el.dispatchEvent(new Event('mousemove'))
const mouseEnter = (el: EventTarget) => el.dispatchEvent(new Event('mouseenter'))
const mouseLeave = (el: EventTarget) => el.dispatchEvent(new Event('mouseleave'))
const focus = (el: EventTarget) => el.dispatchEvent(new Event('focusin', { bubbles: true }))
const blur = (el: EventTarget) => el.dispatchEvent(new Event('focusout', { bubbles: true }))
// The page losing focus, e.g. to the page around an iframe it's in.
const pageBlur = () => window.dispatchEvent(new FocusEvent('blur'))
const tab = (el: EventTarget) =>
    el.dispatchEvent(
        new KeyboardEvent('keydown', <any>{
            bubbles: true,
            key: 'Tab',
            keyCode: 9
        })
    )

describe('click-trigger-strategy', () => {
    let triggerStrategyBuilder: NbTriggerStrategyBuilderService
    let document: Document
    let host: HTMLElement
    let container: HTMLElement

    beforeEach(() => {
        const bed = TestBed.configureTestingModule({
            providers: [NbTriggerStrategyBuilderService, { provide: NB_DOCUMENT, useExisting: DOCUMENT }]
        })
        document = bed.inject(NB_DOCUMENT)
        triggerStrategyBuilder = bed.inject(NbTriggerStrategyBuilderService)
    })

    beforeEach(() => {
        host = createElement()
        container = createElement()
        triggerStrategyBuilder.trigger(NbTrigger.CLICK).host(host).container(withContainer(container))
    })

    it('should fire show$ when click on host without container', () => {
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()

        triggerStrategy.show$.subscribe(showSpy)
        click(host)

        expect(showSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when click on host with container', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        click(host)

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when click on document', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        click(document)

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when the page loses focus', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        pageBlur()

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should not fire hide$ when the page loses focus while focus is in the container', () => {
        const hideSpy = vi.fn()
        const input = document.createElement('input')
        container.appendChild(input)
        input.focus()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        pageBlur()

        expect(hideSpy).not.toHaveBeenCalled()
        input.remove()
    })

    it('should not fire hide$ when the page loses focus while closed', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()

        triggerStrategy.hide$.subscribe(hideSpy)
        pageBlur()

        expect(hideSpy).not.toHaveBeenCalled()
    })

    it('should not fire hide$ when click on container', () => {
        const triggerStrategy = triggerStrategyBuilder.build()
        const spy = vi.fn()

        triggerStrategy.hide$.subscribe(spy)
        click(container)

        expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should not destroy when host reattached', () => {
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()

        triggerStrategy.show$.subscribe(showSpy)

        click(host)

        expect(showSpy).toHaveBeenCalledTimes(1)

        document.body.removeChild(host)
        document.body.appendChild(host)

        click(host)

        expect(showSpy).toHaveBeenCalledTimes(2)
    })

    it('should handle a container getter that returns false while closed', () => {
    // e.g. the select returns `false` while its options aren't shown
        const triggerStrategy = triggerStrategyBuilder.container(() => false as unknown as ComponentRef<any>).build()
        const showSpy = vi.fn()
        const errorSpy = vi.fn()
        triggerStrategy.show$.subscribe({ next: showSpy, error: errorSpy })
        triggerStrategy.hide$.subscribe({ error: errorSpy })

        click(document)
        click(host)

        expect(errorSpy).not.toHaveBeenCalled()
        expect(showSpy).toHaveBeenCalled()
    })

    it('should fire show$ when click on host inside a shadow root', () => {
        const shadowHost = createElement()
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' })
        const hostInShadow = document.createElement('button')
        shadowRoot.appendChild(hostInShadow)
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.host(hostInShadow).container(() => undefined).build()

        triggerStrategy.show$.subscribe(showSpy)
        hostInShadow.dispatchEvent(new Event('click', { bubbles: true, composed: true }))

        expect(showSpy).toHaveBeenCalled()
        shadowHost.remove()
    })

    const escape = (el: EventTarget, init: KeyboardEventInit = {}) =>
        el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape', ...init }))

    it('should close on Escape, which the overlay handler does while it is shown, not hide$', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()
        triggerStrategy.hide$.subscribe(hideSpy)
        escape(document.body)

        expect(triggerStrategy.closesOnEscape).toBe(true)
        expect(hideSpy).not.toHaveBeenCalled()
    })

    describe('with other overlays', () => {
        const createPane = () => {
            const pane = createElement()
            pane.classList.add('cdk-overlay-pane')
            return pane
        }

        it('should not fire hide$ for a click in an overlay opened while shown, even if the click removes it', () => {
            let shown = false
            const ownPane = createPane()
            ownPane.appendChild(container)
            const triggerStrategy = triggerStrategyBuilder
                .container(() => (shown ? withContainer(container)() : undefined))
                .build()
            const hideSpy = vi.fn()
            triggerStrategy.show$.subscribe(() => (shown = true))
            triggerStrategy.hide$.subscribe(hideSpy)

            click(host)
            // e.g. the options of a select in the popover
            const nestedPane = createPane()
            const option = document.createElement('div')
            nestedPane.appendChild(option)
            option.addEventListener('click', () => nestedPane.remove())
            click(option)

            expect(hideSpy).not.toHaveBeenCalled()
            ownPane.remove()
        })

        it('should fire hide$ for a click in an overlay that was open before', () => {
            let shown = false
            const earlierPane = createPane()
            const triggerStrategy = triggerStrategyBuilder
                .container(() => (shown ? withContainer(container)() : undefined))
                .build()
            const hideSpy = vi.fn()
            triggerStrategy.show$.subscribe(() => (shown = true))
            triggerStrategy.hide$.subscribe(hideSpy)

            click(host)
            click(earlierPane)

            expect(hideSpy).toHaveBeenCalledTimes(1)
            earlierPane.remove()
        })
    })
})

describe('hover-trigger-strategy', () => {
    let triggerStrategyBuilder: NbTriggerStrategyBuilderService
    let document: Document
    let host: HTMLElement
    let container: HTMLElement

    beforeEach(() => {
        const bed = TestBed.configureTestingModule({
            providers: [NbTriggerStrategyBuilderService, { provide: NB_DOCUMENT, useExisting: DOCUMENT }]
        })
        document = bed.inject(NB_DOCUMENT)
        triggerStrategyBuilder = bed.inject(NbTriggerStrategyBuilderService)
    })

    beforeEach(() => {
        host = createElement()
        container = createElement()
        triggerStrategyBuilder.trigger(NbTrigger.HOVER).host(host).container(withContainer(container))
    })

    it('should fire show$ when hover on host', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()

        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()
        triggerStrategy.show$.subscribe(showSpy)
        mouseEnter(host)
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when hover out of host', async () => {
        vi.useFakeTimers()
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        mouseEnter(host)
        mouseLeave(host)
        mouseMove(document)
        await vi.advanceTimersByTimeAsync(100)

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should not fire hide$ when hover out to container', () => {
        const triggerStrategy = triggerStrategyBuilder.build()
        const spy = vi.fn()
        triggerStrategy.hide$.subscribe(spy)

        mouseEnter(host)
        mouseLeave(host)
        mouseMove(container)

        expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should not destroy when host reattached', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()

        triggerStrategy.show$.subscribe(showSpy)

        mouseEnter(host)

        // hover trigger strategy has 100 milliseconds delay before firing show$
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(1)

        document.body.removeChild(host)
        document.body.appendChild(host)

        mouseEnter(host)

        // hover trigger strategy has 100 milliseconds delay before firing show$
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(2)
    })

    it('should fire hide$ when the mouse moves after the host was removed', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        host.remove()
        mouseMove(document)

        expect(hideSpy).toHaveBeenCalledTimes(1)
    })
})

describe('hint-trigger-strategy', () => {
    let triggerStrategyBuilder: NbTriggerStrategyBuilderService
    let document: Document
    let host: HTMLElement
    let container: HTMLElement

    beforeEach(() => {
        const bed = TestBed.configureTestingModule({
            providers: [NbTriggerStrategyBuilderService, { provide: NB_DOCUMENT, useExisting: DOCUMENT }]
        })
        document = bed.inject(NB_DOCUMENT)
        triggerStrategyBuilder = bed.inject(NbTriggerStrategyBuilderService)
    })

    beforeEach(() => {
        host = createElement()
        container = createElement()
        triggerStrategyBuilder.trigger(NbTrigger.HINT).host(host).container(withContainer(container))
    })

    it('should fire show$ when hover on host', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.show$.subscribe(showSpy)
        mouseEnter(host)
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when hover out from host', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        mouseLeave(host)

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should not destroy when host reattached', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.show$.subscribe(showSpy)

        mouseEnter(host)

        // hint trigger strategy has 100 milliseconds delay before firing show$
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(1)

        document.body.removeChild(host)
        document.body.appendChild(host)

        mouseEnter(host)

        // hint trigger strategy has 100 milliseconds delay before firing show$
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(2)
    })

    it('should fire hide$ when the mouse moves after the host was removed', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        mouseMove(document)
        expect(hideSpy).not.toHaveBeenCalled()

        host.remove()
        mouseMove(document)

        expect(hideSpy).toHaveBeenCalledTimes(1)
    })

    it('should not fire show$ when the host was removed during the delay', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.show$.subscribe(showSpy)
        mouseEnter(host)
        host.remove()
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).not.toHaveBeenCalled()
    })
})

describe('hint-trigger-strategy with the keyboard', () => {
    let triggerStrategyBuilder: NbTriggerStrategyBuilderService
    let host: HTMLButtonElement
    let before: HTMLButtonElement
    let shown: boolean
    let strategy: NbTriggerStrategy
    const settle = () => new Promise((resolve) => setTimeout(resolve, 150))

    beforeEach(() => {
        vi.useRealTimers()
        const bed = TestBed.configureTestingModule({
            providers: [NbTriggerStrategyBuilderService, { provide: NB_DOCUMENT, useExisting: DOCUMENT }]
        })
        triggerStrategyBuilder = bed.inject(NbTriggerStrategyBuilderService)
        before = createElement('button') as HTMLButtonElement
        host = createElement('button') as HTMLButtonElement
        const container = createElement()
        shown = false
        strategy = triggerStrategyBuilder
            .trigger(NbTrigger.HINT)
            .host(host)
            .container(() => (shown ? withContainer(container)() : undefined))
            .build()
        strategy.show$.subscribe(() => (shown = true))
        strategy.hide$.subscribe(() => (shown = false))
    })

    afterEach(() => {
        before.remove()
        host.remove()
    })

    it('should show on keyboard focus, and hide when the focus leaves', async () => {
        before.focus()
        await userEvent.tab()
        expect(document.activeElement).toBe(host)
        await expect.poll(() => shown).toBe(true)

        await userEvent.tab({ shift: true })
        expect(shown).toBe(false)
    })

    it('should not show on the focus a click gives', async () => {
        await userEvent.click(host)
        await userEvent.unhover(host)
        await settle()
        expect(document.activeElement).toBe(host)
        expect(shown).toBe(false)
    })

    it('should stay while the keyboard focus is in the host, and close on Escape', async () => {
        before.focus()
        await userEvent.tab()
        await expect.poll(() => shown).toBe(true)

        mouseLeave(host)
        expect(shown).toBe(true)
        // The overlay handler closes it on Escape, see overlay-escape.spec.ts.
        expect(strategy.closesOnEscape).toBe(true)
    })
})

describe('focus-trigger-strategy', () => {
    let triggerStrategyBuilder: NbTriggerStrategyBuilderService
    let document: Document
    let host: HTMLElement
    let container: HTMLElement

    beforeEach(() => {
        const bed = TestBed.configureTestingModule({
            providers: [NbTriggerStrategyBuilderService, { provide: NB_DOCUMENT, useExisting: DOCUMENT }]
        })
        document = bed.inject(NB_DOCUMENT)
        triggerStrategyBuilder = bed.inject(NbTriggerStrategyBuilderService)
    })

    beforeEach(() => {
        host = createElement()
        container = createElement()
        triggerStrategyBuilder.trigger(NbTrigger.FOCUS).host(host).container(withContainer(container))
    })

    it('should fire show$ when focused into host', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()

        triggerStrategy.show$.subscribe(showSpy)
        focus(host)
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalled()
    })

    it('should fire show$ when clicked into host', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()

        triggerStrategy.show$.subscribe(showSpy)
        click(host)
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when clicked on document', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        click(document)

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when the page loses focus', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        pageBlur()

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when tab pressed', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        tab(host)

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should fire hide$ when focusout', () => {
        const hideSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(hideSpy)
        blur(host)
        focus(document)

        expect(hideSpy).toHaveBeenCalled()
    })

    it('should fire show$ once when focused and clicked into host', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()
        triggerStrategy.show$.subscribe(showSpy)
        focus(host)
        click(host)
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(1)
    })

    it('should not destroy when host reattached', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()

        triggerStrategy.show$.subscribe(showSpy)

        focus(host)

        // focus trigger strategy has 100 milliseconds delay before firing show$
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(1)

        document.body.removeChild(host)
        document.body.appendChild(host)

        focus(host)

        // focus trigger strategy has 100 milliseconds delay before firing show$
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(2)
    })
})

describe('noop-trigger-strategy', () => {
    let triggerStrategyBuilder: NbTriggerStrategyBuilderService
    let document: Document
    let host: HTMLElement
    let container: HTMLElement

    beforeEach(() => {
        const bed = TestBed.configureTestingModule({
            providers: [NbTriggerStrategyBuilderService, { provide: NB_DOCUMENT, useExisting: DOCUMENT }]
        })
        document = bed.inject(NB_DOCUMENT)
        triggerStrategyBuilder = bed.inject(NbTriggerStrategyBuilderService)
    })

    beforeEach(() => {
        host = createElement()
        container = createElement()
        triggerStrategyBuilder.trigger(NbTrigger.NOOP).host(host).container(withContainer(container))
    })

    it('should NOT fire show$ when hover/click/focus on host', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.container(() => undefined).build()
        triggerStrategy.show$.subscribe(showSpy)

        focus(host)
        click(host)
        mouseEnter(host)
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(0)
    })

    it('should NOT fire hide$ when hover out from host', async () => {
        vi.useFakeTimers()
        const showSpy = vi.fn()
        const triggerStrategy = triggerStrategyBuilder.build()

        triggerStrategy.hide$.subscribe(showSpy)
        mouseLeave(host)
        blur(host)
        focus(document)
        await vi.advanceTimersByTimeAsync(100)

        expect(showSpy).toHaveBeenCalledTimes(0)
    })
})
