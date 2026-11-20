import {
    DestroyRef,
    afterNextRender,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    Injector,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    viewChild
} from '@angular/core'
import { NbFocusTrap, NbFocusTrapFactoryService, NbComponentPortal, NbComponentType, NbTemplatePortal, NbOverlayContainerComponent } from '@liquid-js/lyr-core/cdk'
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent } from '@liquid-js/lyr-core/card'
import { NgTemplateOutlet } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NbButtonComponent } from '@liquid-js/lyr-core/button'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import {
    injectNbTexts,
    NbLocalize,
    ɵanimatePane as animatePane,
    ɵexpandDuration as expandDuration
} from '@liquid-js/lyr-core/base'
import { NbWindowRef } from './window-ref'
import { NB_WINDOW_CONTENT, NbWindowConfig, NbWindowState, NB_WINDOW_CONTEXT } from './window.options'

/** @internal */
declare const $localize: NbLocalize

let lastWindowId = 0

@Component({
    selector: 'nb-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss'],
    // Hosted content may not use signals, so it's checked on every change detection.
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NgTemplateOutlet,
        NbButtonComponent,
        NbIconComponent,
        NbCardBodyComponent,
        NbOverlayContainerComponent
    ],
    host: {
    // A dialog, as a dialog's container is, named by its title; modal while its backdrop covers the page.
        'role': 'dialog',
        '[attr.aria-labelledby]': 'titleId',
        '[attr.aria-modal]': 'isFullScreen() && config.hasBackdrop',
        '[class.full-screen]': 'isFullScreen()',
        '[class.docked]': 'docked()',
        '[class.minimized]': 'minimized()',
        // Above the other windows while it's the one used last; clicking or focusing it brings it there.
        '[style.z-index]': 'windowRef.layer()',
        '(pointerdown)': 'windowRef.toFront()',
        '(focusin)': 'windowRef.toFront()'
    }
})
export class NbWindowComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly texts = injectNbTexts('window', () => ({
        minimize: $localize`:@@nb.window.minimize:Minimize`,
        restore: $localize`:@@nb.window.restore:Restore`,
        collapse: $localize`:@@nb.window.collapse:Collapse`,
        expand: $localize`:@@nb.window.expand:Expand`,
        close: $localize`:@@nb.window.close:Close`
    }))

    readonly content = inject<TemplateRef<unknown> | NbComponentType>(NB_WINDOW_CONTENT)
    readonly context = inject(NB_WINDOW_CONTEXT)
    readonly windowRef = inject(NbWindowRef)
    readonly config = inject(NbWindowConfig)
    protected readonly focusTrapFactory = inject(NbFocusTrapFactoryService)
    protected readonly injector = inject(Injector)
    protected readonly elementRef = inject(ElementRef)
    private readonly destroyRef = inject(DestroyRef)
    protected readonly renderer = inject(Renderer2)

    /** @internal The id of the window's title, which names it. */
    readonly titleId = `nb-window-title-${lastWindowId++}`

    readonly isFullScreen = computed(() => this.windowRef.state === NbWindowState.FULL_SCREEN)

    readonly docked = computed(() => this.windowRef.state === NbWindowState.DOCKED)

    readonly minimized = computed(() => this.windowRef.state === NbWindowState.MINIMIZED)

    /**
     * A button to each other state the window can be in, of its `states`: Minimize, Collapse (to docked, Restore from
     * minimized) and Expand (to full screen).
     */
    protected readonly stateButtons = computed(() => {
        const state = this.windowRef.state
        const allowed = new Set(this.config.states)
        const texts = this.texts()
        const buttons = new Array<{ state: NbWindowState, label: string }>()
        if (allowed.has(NbWindowState.MINIMIZED) && state !== NbWindowState.MINIMIZED) {
            buttons.push({ state: NbWindowState.MINIMIZED, label: texts.minimize })
        }
        if (allowed.has(NbWindowState.DOCKED) && state !== NbWindowState.DOCKED) {
            buttons.push({
                state: NbWindowState.DOCKED,
                label: state === NbWindowState.MINIMIZED ? texts.restore : texts.collapse
            })
        }
        if (allowed.has(NbWindowState.FULL_SCREEN) && state !== NbWindowState.FULL_SCREEN) {
            buttons.push({ state: NbWindowState.FULL_SCREEN, label: texts.expand })
        }
        return buttons
    })

    /** The icon of the button to a state: Restore from minimized and Collapse both go to docked. */
    protected stateIcon(state: NbWindowState): string {
        if (state === NbWindowState.MINIMIZED) {
            return 'minus-outline'
        }
        if (state === NbWindowState.FULL_SCREEN) {
            return 'expand-outline'
        }
        if (this.windowRef.state === NbWindowState.MINIMIZED) {
            return 'chevron-up-outline'
        }
        return 'collapse-outline'
    }

    readonly overlayContainer = viewChild.required(NbOverlayContainerComponent)

    protected focusTrap?: NbFocusTrap

    ngOnInit() {
        const focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement)
        this.focusTrap = focusTrap
        focusTrap.blurPreviouslyFocusedElement()
        // The title the window focuses renders after this; focusing it now left the focus on the page.
        afterNextRender(() => focusTrap.focusInitialElement(), { injector: this.injector })
        // Tab stays in the window only while it's modal, over the page with its backdrop; docked or minimized, it's one
        // part of the page, which Tab moves on from.
        effect(() => (focusTrap.enabled = this.isFullScreen() && this.config.hasBackdrop), { injector: this.injector })

        if (this.config.windowClass) {
            this.renderer.addClass(this.elementRef.nativeElement, this.config.windowClass)
        }

        this.windowRef.stateChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ oldState, newState }) => this.animateStateChange(oldState, newState))
    }

    /** The card's height before the latest resize, which a change of state animates from. */
    private cardHeight = 0
    private resizeObserver?: ResizeObserver
    /** Whether the next resize of the card is a change of state, to animate. */
    private stateChanging = false

    /**
     * Covers a change of state: a docked window shrinks to its header or grows back over the time its height takes,
     * longer for a taller one; a window going full screen, or back, cross-fades, as it moves to the middle of the page.
     * The height is animated when the card resizes, as the new state may render before the change is observed.
     */
    private animateStateChange(oldState: NbWindowState | undefined, newState: NbWindowState) {
        const card = this.card()
        if (!oldState || oldState === newState || !card || this.reducedMotion()) {
            return
        }
        if (oldState === NbWindowState.FULL_SCREEN || newState === NbWindowState.FULL_SCREEN) {
            this.stateChanging = false
            afterNextRender(
                () =>
                    card.animate([{ opacity: 0.4, transform: 'scale(0.98)' }, { opacity: 1, transform: 'none' }], {
                        duration: 150,
                        easing: 'ease-out'
                    }),
                { injector: this.injector }
            )
            return
        }
        this.stateChanging = true
    }

    /** Watches the card's height: a change of state animates from the height before it, as the observer sees it. */
    private observeCardHeight() {
        const card = this.card()
        if (!card || typeof ResizeObserver !== 'function') {
            return
        }
        this.cardHeight = card.getBoundingClientRect().height
        this.resizeObserver = new ResizeObserver(() => {
            const to = card.getBoundingClientRect().height
            const from = this.cardHeight
            this.cardHeight = to
            if (this.stateChanging && to !== from) {
                this.stateChanging = false
                card.animate(
                    [
                        { height: `${from}px`, overflow: 'hidden' },
                        { height: `${to}px`, overflow: 'hidden' }
                    ],
                    { duration: expandDuration(Math.abs(to - from)), easing: 'ease-in-out' }
                )
            }
        })
        this.resizeObserver.observe(card)
    }

    private card(): HTMLElement | undefined {
        const card = (this.elementRef.nativeElement as HTMLElement).querySelector('nb-card')
        return card instanceof HTMLElement && typeof card.animate === 'function' ? card : undefined
    }

    private reducedMotion(): boolean {
        return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    ngAfterViewInit() {
    // The card fades and grows in, as a dialog's pane does; the host's transform places a full-screen window.
        const card = this.card()
        if (card) {
            void animatePane(card, true)
        }
        this.observeCardHeight()
        const content = this.content
        if (content instanceof TemplateRef) {
            this.attachTemplate(content)
        } else {
            this.attachComponent(content)
        }
    }

    ngOnDestroy() {
        this.resizeObserver?.disconnect()
        if (this.focusTrap) {
            this.focusTrap.restoreFocus()
        }

        this.close()
    }

    close() {
        this.windowRef.close()
    }

    protected attachTemplate(content: TemplateRef<unknown>) {
        this.overlayContainer().attachTemplatePortal(new NbTemplatePortal(content, undefined, this.context))
    }

    protected attachComponent(content: NbComponentType) {
        const portal = new NbComponentPortal(content, null, null)
        const ref = this.overlayContainer().attachComponentPortal(portal, this.context)
        this.windowRef.componentRef = ref

        ref.changeDetectorRef.detectChanges()
    }
}
