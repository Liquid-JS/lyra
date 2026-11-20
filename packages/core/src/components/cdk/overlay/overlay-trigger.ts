import { ComponentRef, inject, Service } from '@angular/core'
import { EMPTY, fromEvent as observableFromEvent, merge as observableMerge, Observable, Subject } from 'rxjs'
import { debounceTime, delay, filter, map, repeat, share, switchMap, takeUntil, takeWhile } from 'rxjs/operators'
import { NB_DOCUMENT, ɵisComposing as isComposing } from '@liquid-js/lyr-core/base'

export type NbTriggerValues = 'noop' | 'click' | 'hover' | 'hint' | 'focus'
export enum NbTrigger {
    NOOP = 'noop',
    CLICK = 'click',
    HOVER = 'hover',
    HINT = 'hint',
    FOCUS = 'focus'
}

/**
 * When an overlay shows and hides, as two event streams; each trigger (click, hover, hint, focus, noop) has its own
 * strategy.
 */
export interface NbTriggerStrategy {
    show$: Observable<never | Event>
    hide$: Observable<never | Event>
    /**
     * Whether Escape hides the container too: while it's shown, it's then the first overlay to close on Escape (see
     * `NbEscapeStack`), with the focus in it going back to the host.
     */
    readonly closesOnEscape?: boolean

    destroy(): void
}

/**
 * The base of the trigger strategies: it tells events on the host and the container apart, and stops listening when
 * destroyed. The strategies listen through the document, which works on the server too.
 */
export abstract class NbTriggerStrategyBase implements NbTriggerStrategy {
    destroy() {
        this.destroyed$.next()
    }

    protected destroyed$ = new Subject<void>()

    protected isNotOnHostOrContainer(element: Element | null): boolean {
        return !this.isOnHost(element) && !this.isOnContainer(element)
    }

    protected isOnHostOrContainer(element: Element | null): boolean {
        return this.isOnHost(element) || this.isOnContainer(element)
    }

    protected isOnHost(element: Element | null): boolean {
        return this.host.contains(element)
    }

    protected isOnContainer(element: Element | null): boolean {
        const container = this.container()
        return !!container && container.location.nativeElement.contains(element)
    }

    /**
     * Fires when the mouse moves while the container is shown for a host that was removed from the document,
     * e.g. an option of a closed select. A removed element never gets `mouseleave`.
     * */
    protected hostRemoved(): Observable<Event> {
        return observableFromEvent<Event>(this.document, 'mousemove').pipe(
            filter(() => !!this.container() && !this.host.isConnected)
        )
    }

    /**
     * Fires when the page loses focus while the container is shown, as a native select's list closes: e.g. a click in
     * the page around an iframe the page is in, which the page doesn't get, or another window. Focus in the container,
     * e.g. in a form in a popover, keeps it.
     * */
    protected pageBlur(): Observable<Event> {
        const view = this.document.defaultView
        if (!view) {
            return EMPTY
        }
        return observableFromEvent<Event>(view, 'blur').pipe(
            filter(() => !!this.container() && !this.isOnContainer(this.document.activeElement))
        )
    }

    abstract show$: Observable<Event>
    abstract hide$: Observable<Event>

    constructor(
        protected document: Document,
        protected host: HTMLElement,
        protected container: () => ComponentRef<unknown> | undefined
    ) {}
}

/**
 * Shows on a click on the host, and hides on a click anywhere else than the host, the container or an overlay opened
 * from it, when the page loses focus, and on Escape (`closesOnEscape`).
 */
export class NbClickTriggerStrategy extends NbTriggerStrategyBase {
    /** Overlay panes that were open when the container was shown; panes opened later are nested in the container. */
    protected panesBeforeShow?: Set<Element>

    // One stream decides on each click whether it shows or hides, from the container's state at the time of the
    // click; tracking the two separately would show the container and hide it again on the same click.
    protected click$: Observable<[boolean, Event, EventTarget[]]> = observableFromEvent<Event>(this.document, 'click').pipe(
        map((event: Event) => {
            // The composed path reaches into shadow roots, and keeps elements the click removed, such as a select option.
            const path = event.composedPath()
            const shouldShow = !this.container() && path.includes(this.host)
            if (shouldShow) {
                this.panesBeforeShow = new Set(Array.from(this.document.querySelectorAll('.cdk-overlay-pane')))
            }
            return [shouldShow, event, path] as [boolean, Event, EventTarget[]]
        }),
        share(),
        takeUntil(this.destroyed$)
    )

    readonly show$: Observable<Event> = this.click$.pipe(
        filter(([shouldShow]) => shouldShow),
        map(([, event]) => event),
        takeUntil(this.destroyed$)
    )

    readonly closesOnEscape = true

    readonly hide$: Observable<Event> = observableMerge(
        this.click$.pipe(
            filter(([shouldShow, , path]) => !shouldShow && !this.isInContainer(path) && !this.isInNestedOverlay(path)),
            map(([, event]) => event)
        ),
        this.pageBlur()
    ).pipe(takeUntil(this.destroyed$))

    protected isInContainer(path: EventTarget[]): boolean {
        const container = this.container()?.location?.nativeElement
        return !!container && path.includes(container)
    }

    /**
     * A click in an overlay opened while the container is shown, e.g. the options of a select in a popover,
     * is a click in the container.
     * */
    protected isInNestedOverlay(path: EventTarget[]): boolean {
        const container: Element = this.container()?.location?.nativeElement
        const panesBeforeShow = this.panesBeforeShow
        if (!container || !panesBeforeShow) {
            return false
        }

        const ownPane = container.closest('.cdk-overlay-pane')
        return path.some(
            (element) =>
                element instanceof Element &&
        element.classList.contains('cdk-overlay-pane') &&
        element !== ownPane &&
        !panesBeforeShow.has(element)
        )
    }
}

/**
 * Shows once the mouse has been over the host for 100 ms, and hides once it has left the host and the container, or
 * the host is removed from the document.
 */
export class NbHoverTriggerStrategy extends NbTriggerStrategyBase {
    show$: Observable<Event> = observableFromEvent<Event>(this.host, 'mouseenter').pipe(
        filter(() => !this.container()),
        // `delay`, `takeUntil` and `repeat` together: the mouse leaving within 100 ms cancels the show.
        delay(100),
        filter(() => this.host.isConnected),

        takeUntil(observableFromEvent(this.host, 'mouseleave')),
        repeat(),
        takeUntil(this.destroyed$)
    )

    hide$: Observable<Event> = observableMerge(
        observableFromEvent<Event>(this.host, 'mouseleave').pipe(
            switchMap(() =>
                observableFromEvent<Event>(this.document, 'mousemove').pipe(
                    debounceTime(100),
                    takeWhile(() => !!this.container()),
                    filter((event) => this.isNotOnHostOrContainer(event.target as Element))
                )
            )
        ),
        this.hostRemoved()
    ).pipe(takeUntil(this.destroyed$))
}

/**
 * Shows once the mouse has been over the host, or the keyboard focus in it, for 100 ms. Hides when the mouse leaves
 * the host and the keyboard focus isn't in it, when the focus leaves and the mouse isn't over it, when the host is
 * removed from the document, and on Escape (`closesOnEscape`).
 */
export class NbHintTriggerStrategy extends NbTriggerStrategyBase {
    /** Whether the keyboard focus is in the host: a focus a mouse click gives doesn't count. */
    protected hasKeyboardFocus() {
        return this.host.matches(':focus-visible') || !!this.host.querySelector(':focus-visible')
    }

    protected readonly hover$ = observableFromEvent<Event>(this.host, 'mouseenter').pipe(
    // `delay`, `takeUntil` and `repeat` together: the mouse leaving within 100 ms cancels the show.
        delay(100),
        filter(() => this.host.isConnected),

        takeUntil(observableFromEvent(this.host, 'mouseleave')),
        repeat(),
        takeUntil(this.destroyed$)
    )

    protected readonly keyboardFocus$ = observableFromEvent<FocusEvent>(this.host, 'focusin').pipe(
        filter((event) => event.target instanceof Element && event.target.matches(':focus-visible')),
        delay(100),
        filter(() => this.host.isConnected),

        takeUntil(observableFromEvent(this.host, 'focusout')),
        repeat(),
        takeUntil(this.destroyed$)
    )

    show$: Observable<Event> = observableMerge(this.hover$, this.keyboardFocus$).pipe(takeUntil(this.destroyed$))

    hide$: Observable<Event> = observableMerge(
        observableFromEvent(this.host, 'mouseleave').pipe(filter(() => !this.hasKeyboardFocus())),
        observableFromEvent<FocusEvent>(this.host, 'focusout').pipe(
            // Not while the focus moves inside the host, or the mouse is still over it.
            filter((event) => !this.host.contains(event.relatedTarget as Node | null) && !this.host.matches(':hover'))
        ),
        this.hostRemoved()
    ).pipe(takeUntil(this.destroyed$))

    readonly closesOnEscape = true
}

/**
 * Shows 100 ms after the host is focused or clicked, unless the focus leaves first. Hides when the focus moves
 * outside the host and the container, when Tab leaves the container, on a click outside both, and when the page
 * loses focus.
 */
export class NbFocusTriggerStrategy extends NbTriggerStrategyBase {
    protected focusOut$: Observable<Event> = observableFromEvent<Event>(this.host, 'focusout').pipe(
        switchMap(() =>
            observableFromEvent<Event>(this.document, 'focusin').pipe(
                takeWhile(() => !!this.container()),
                filter((event) => this.isNotOnHostOrContainer(event.target as Element))
            )
        ),
        takeUntil(this.destroyed$)
    )

    protected clickIn$: Observable<Event> = observableFromEvent<Event>(this.host, 'click').pipe(
        filter(() => !this.container()),
        takeUntil(this.destroyed$)
    )

    protected clickOut$: Observable<Event> = observableFromEvent<Event>(this.document, 'click').pipe(
        filter(() => !!this.container()),
        // The click's target may differ from the active element: a click that puts the focus back in the host doesn't
        // hide the container.
        filter((event) => {
            if (this.isNotOnHostOrContainer(event.target as Element)) {
                return this.isNotOnHostOrContainer(this.document.activeElement)
            }
            return false
        }),
        takeUntil(this.destroyed$)
    )

    protected tabKeyPress$: Observable<Event> = observableFromEvent<KeyboardEvent>(this.document, 'keydown').pipe(
        filter((event) => event.key === 'Tab' && !isComposing(event)),
        filter(() => !!this.container()),
        // Tab moves between the container's own controls; leaving it closes it with the focus going out.
        filter((event: Event) => !this.isOnContainer(event.target as Element)),
        takeUntil(this.destroyed$)
    )

    show$: Observable<Event> = observableMerge(observableFromEvent<Event>(this.host, 'focusin'), this.clickIn$).pipe(
        filter(() => !this.container()),
        debounceTime(100),

        takeUntil(observableFromEvent(this.host, 'focusout')),
        repeat(),
        takeUntil(this.destroyed$)
    )

    hide$ = observableMerge(this.focusOut$, this.tabKeyPress$, this.clickOut$, this.pageBlur()).pipe(
        takeUntil(this.destroyed$)
    )
}

/** Never shows or hides: the overlay is controlled from code. */
export class NbNoopTriggerStrategy extends NbTriggerStrategyBase {
    show$: Observable<Event> = EMPTY
    hide$: Observable<Event> = EMPTY
}

@Service()
export class NbTriggerStrategyBuilderService {
    protected readonly _document = inject(NB_DOCUMENT)

    protected _host?: HTMLElement
    protected _container: () => ComponentRef<unknown> | undefined = () => undefined
    protected _trigger?: NbTrigger

    trigger(trigger: NbTrigger): this {
        this._trigger = trigger
        return this
    }

    host(host: HTMLElement): this {
        this._host = host
        return this
    }

    container(container: () => ComponentRef<unknown> | undefined): this {
        this._container = container
        return this
    }

    build(): NbTriggerStrategy {
        const host = this._host
        if (!host) {
            throw new Error('Host have to be provided')
        }
        switch (this._trigger) {
            case NbTrigger.CLICK:
                return new NbClickTriggerStrategy(this._document, host, this._container)
            case NbTrigger.HINT:
                return new NbHintTriggerStrategy(this._document, host, this._container)
            case NbTrigger.HOVER:
                return new NbHoverTriggerStrategy(this._document, host, this._container)
            case NbTrigger.FOCUS:
                return new NbFocusTriggerStrategy(this._document, host, this._container)
            case NbTrigger.NOOP:
                return new NbNoopTriggerStrategy(this._document, host, this._container)
            default:
                throw new Error('Trigger have to be provided')
        }
    }
}
