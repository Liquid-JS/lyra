import {
    AfterViewInit,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy,
    PLATFORM_ID,
    Renderer2,
    signal,
    viewChild
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { isPlatformBrowser } from '@angular/common'
import { filter } from 'rxjs/operators'

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, NbThemeService, NbSpinnerService, NbLayoutDirectionService, NbScrollPosition, NbLayoutScrollService, NbLayoutDimensions, NbLayoutRulerService, NB_WINDOW, NB_DOCUMENT } from '@liquid-js/lyr-core/base'
import { NB_LAYOUT_SCROLL_BLOCK_CLASS, NbOverlayContainerAdapter } from '@liquid-js/lyr-core/cdk'
import { NbRestoreScrollTopHelper } from './restore-scroll-top.service'

/**
 * The page's frame: a header, sidebars, columns and a footer. The components go inside it; it also applies the theme
 * and holds the overlays.
 *
 * @stacked-example(Showcase, layout/layout-showcase.component)
 *
 * ```html
 * <nb-layout>
 *  <nb-layout-header></nb-layout-header>
 *  <nb-layout-footer></nb-layout-footer>
 *  <nb-layout-column></nb-layout-column>
 *  <nb-sidebar></nb-sidebar>
 * </nb-layout>
 * ```
 * ### Installation
 *
 * Import `NbLayoutComponent`, `NbLayoutHeaderComponent`, `NbLayoutColumnComponent` and `NbLayoutFooterComponent` into
 * your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent, NbLayoutFooterComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbLayoutModule` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbLayoutModule,
 *   ],
 * })
 * export class AppModule { }
 * ```
 * ### Usage
 * The layout is at least as tall as the view port (`layout-min-height`). The page scrolls as a whole by default;
 * with `withScroll`, the layout's own container scrolls instead, so the body has no scrollbar. `windowMode` turns
 * the layout into a floating window, centred under a margin on wide screens, and scrolls inside it.
 *
 * Overlays, e.g. dialogs, popovers and toasts, are attached to the layout, so they lie over everything in it. The
 * layout also applies the theme: on a theme change it puts the theme's `nb-theme-<name>` class on the body, which
 * the theme's styles are scoped to. See [Enable Customizable Theme](theme/customization/enable-customizable-theme).
 * @stacked-example(Layout With Footer, layout/layout-w-footer.component)
 *
 * With `center`, the columns take the theme's `layout-content-width` and sit in the middle of wider screens:
 *
 * ```html
 * <nb-layout center>
 *   <nb-layout-header>Awesome Company</nb-layout-header>
 *
 *   <nb-layout-column>
 *     Hello World!
 *   </nb-layout-column>
 *
 *   <nb-layout-footer>Contact us</nb-layout-footer>
 * </nb-layout>
 * ```
 * @styles
 *
 * layout-background-color:
 * layout-text-color:
 * layout-text-font-family:
 * layout-text-font-size:
 * layout-text-font-weight:
 * layout-text-line-height:
 * layout-min-height:
 * layout-content-width:
 * layout-window-mode-min-width:
 * layout-window-mode-background-color:
 * layout-window-mode-padding-top:
 * layout-window-shadow:
 * layout-padding:
 * layout-medium-padding:
 * layout-small-padding:
 * layout-scrollbar-background-color:
 * layout-scrollbar-color:
 * layout-scrollbar-width:
 */
@Component({
    selector: 'nb-layout',
    styleUrls: ['./layout.component.scss'],
    templateUrl: './layout.component.html',
    host: {
        '[class.window-mode]': 'windowMode()',
        '[class.with-scroll]': 'withScrollValue()',
        '[class.with-subheader]': 'withSubheader()',
        '(window:scroll)': 'onScroll($event)',
        '(window:resize)': 'onResize($event)'
    }
})
export class NbLayoutComponent implements AfterViewInit, OnDestroy {
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly themeService = inject(NbThemeService)
    protected readonly spinnerService = inject(NbSpinnerService)
    protected readonly elementRef = inject(ElementRef)
    protected readonly renderer = inject(Renderer2)
    protected readonly window = inject(NB_WINDOW)
    protected readonly document = inject(NB_DOCUMENT)
    protected readonly platformId = inject(PLATFORM_ID)
    protected readonly layoutDirectionService = inject(NbLayoutDirectionService)
    protected readonly scrollService = inject(NbLayoutScrollService)
    protected readonly rulerService = inject(NbLayoutRulerService)
    protected readonly scrollTop = inject(NbRestoreScrollTopHelper)
    protected readonly overlayContainer = inject(NbOverlayContainerAdapter)

    protected scrollBlockClass = NB_LAYOUT_SCROLL_BLOCK_CLASS
    protected isScrollBlocked = false
    protected scrollableContainerOverflowOldValue = ''
    protected layoutPaddingOldValue?: { left: string, right: string }

    /** The columns take the theme's `layout-content-width` and sit in the middle of wider screens. */
    readonly center = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * The layout, with its sidebars and fixed header, floats like a window: centred, with a margin above it, on
     * screens wider than the theme's `$layout-window-mode-max-width`. The layout scrolls inside, as with `withScroll`.
     */
    readonly windowMode = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** The layout's own container scrolls, rather than the page; `windowMode` implies it. */
    readonly withScroll = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Scrolls to the top when the router navigates to another path; on by default. */
    readonly restoreScrollTop = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /**
     * Whether the scrollbars are on the layout: with `withScroll`, or in window mode.
     */
    readonly withScrollValue = computed(() => this.withScroll() || this.windowMode())

    /**
     * Whether the layout has a subheader, which `nb-layout-header` sets.
     */
    readonly withSubheader = signal(false)

    readonly scrollableContainerRef = viewChild.required('scrollableContainer', { read: ElementRef<HTMLElement> })

    readonly layoutContainerRef = viewChild.required('layoutContainer', { read: ElementRef<HTMLElement> })

    constructor() {
        this.registerAsOverlayContainer()

        this.themeService
            .onThemeChange()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((theme) => {
                const body = this.document.getElementsByTagName('body')[0]
                // Every other theme's class, not just the previous one's: a theme changed while no layout was on the page,
                // e.g. between one route's layout and the next, left its class behind.
                const current = `nb-theme-${theme.name}`
                Array.from(body.classList)
                    .filter((name) => name.startsWith('nb-theme-') && name !== current)
                    .forEach((name) => this.renderer.removeClass(body, name))
                this.renderer.addClass(body, current)
            })

        this.themeService
            .onAppendLayoutClass()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((className: string) => {
                this.renderer.addClass(this.elementRef.nativeElement, className)
            })

        this.themeService
            .onRemoveLayoutClass()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((className: string) => {
                this.renderer.removeClass(this.elementRef.nativeElement, className)
            })

        // Hides the global spinner once the loaders the app registered are done, or one fails, which is reported here as
        // nothing else waits for them.
        this.spinnerService.load().catch((error: unknown) => console.error(error))

        this.rulerService
            .onGetDimensions()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ listener }) => {
                listener.next(this.getDimensions())
                listener.complete()
            })

        this.scrollService
            .onGetPosition()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ listener }) => {
                listener.next(this.getScrollPosition())
                listener.complete()
            })

        this.scrollTop
            .shouldRestore()
            .pipe(
                filter(() => this.restoreScrollTop()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.scroll(0, 0)
            })

        this.scrollService
            .onScrollableChange()
            .pipe(
                filter(() => this.withScrollValue()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((scrollable: boolean) => {
                // The layout's container scrolls, so the layout blocks it in place of the CDK's block scroll strategy
                // (NbBlockScrollStrategyAdapter), which would position the html element.
                if (scrollable) {
                    this.enableScroll()
                } else {
                    this.blockScroll()
                }
            })

        if (this.window) {
            // The initial width, which the breakpoint changes build on.
            this.themeService.changeWindowWidth(this.window.innerWidth)
        }
    }

    ngAfterViewInit() {
        this.layoutDirectionService
            .onDirectionChange()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((direction) => (this.document.dir = direction))

        this.scrollService
            .onManualScroll()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ x, y }) => this.scroll(x, y))
    }

    ngOnDestroy() {
        this.unregisterAsOverlayContainer()
    }

    onScroll($event: Event) {
        this.scrollService.fireScrollChange($event)
    }

    onResize(event: Event) {
        this.themeService.changeWindowWidth((event.target as Window).innerWidth)
    }

    /** The client and scroll size of what scrolls: the layout's container with `withScroll`, the document otherwise. */
    getDimensions(): NbLayoutDimensions {
        let clientWidth
        let clientHeight
        let scrollWidth
        let scrollHeight = 0
        if (this.withScrollValue()) {
            const container = this.scrollableContainerRef().nativeElement
            clientWidth = container.clientWidth
            clientHeight = container.clientHeight
            scrollWidth = container.scrollWidth
            scrollHeight = container.scrollHeight
        } else {
            const { documentElement, body } = this.document
            clientWidth = documentElement.clientWidth || body.clientWidth
            clientHeight = documentElement.clientHeight || body.clientHeight
            scrollWidth = documentElement.scrollWidth || body.scrollWidth
            scrollHeight = documentElement.scrollHeight || body.scrollHeight
        }

        return {
            clientWidth,
            clientHeight,
            scrollWidth,
            scrollHeight
        }
    }

    /** The scroll position of what scrolls: the layout's container with `withScroll`, the window otherwise. */
    getScrollPosition(): NbScrollPosition {
        if (!isPlatformBrowser(this.platformId)) {
            return { x: 0, y: 0 }
        }

        if (this.withScrollValue()) {
            const container = this.scrollableContainerRef().nativeElement
            return { x: container.scrollLeft, y: container.scrollTop }
        }

        const documentRect = this.document.documentElement.getBoundingClientRect()

        const x =
            -documentRect.left ||
            this.document.body.scrollLeft ||
            this.window?.scrollX ||
            this.document.documentElement.scrollLeft ||
            0

        const y =
            -documentRect.top ||
            this.document.body.scrollTop ||
            this.window?.scrollY ||
            this.document.documentElement.scrollTop ||
            0

        return { x, y }
    }

    protected registerAsOverlayContainer() {
        if (this.overlayContainer.setContainer) {
            this.overlayContainer.setContainer(this.elementRef.nativeElement)
        }
    }

    protected unregisterAsOverlayContainer() {
        if (this.overlayContainer.clearContainer) {
            this.overlayContainer.clearContainer(this.elementRef.nativeElement)
        }
    }

    private scroll(x?: number, y?: number) {
        const { x: currentX, y: currentY } = this.getScrollPosition()
        x = x == null ? currentX : x
        y = y == null ? currentY : y

        if (!isPlatformBrowser(this.platformId)) {
            return
        }
        if (this.withScrollValue()) {
            const scrollable = this.scrollableContainerRef().nativeElement
            if (scrollable.scrollTo) {
                scrollable.scrollTo(x, y)
            } else {
                scrollable.scrollLeft = x
                scrollable.scrollTop = y
            }
        } else {
            this.window?.scrollTo(x, y)
        }
    }

    // The layout blocks its own scrollable container when the block scroll strategy asks, through NbLayoutScrollService;
    // only the layout knows that container.
    protected blockScroll() {
        if (this.isScrollBlocked) {
            return
        }

        this.isScrollBlocked = true

        this.renderer.addClass(this.document.documentElement, this.scrollBlockClass)

        const scrollableContainerElement = this.scrollableContainerRef().nativeElement
        const layoutElement = this.layoutContainerRef().nativeElement

        const layoutWithScrollWidth = layoutElement.clientWidth
        this.scrollableContainerOverflowOldValue = scrollableContainerElement.style.overflow
        scrollableContainerElement.style.overflow = 'hidden'
        const layoutWithoutScrollWidth = layoutElement.clientWidth
        const scrollWidth = layoutWithoutScrollWidth - layoutWithScrollWidth

        if (!scrollWidth) {
            return
        }

        this.layoutPaddingOldValue = {
            left: layoutElement.style.paddingLeft,
            right: layoutElement.style.paddingRight
        }

        if (this.layoutDirectionService.isLtr()) {
            layoutElement.style.paddingRight = `${scrollWidth}px`
        } else {
            layoutElement.style.paddingLeft = `${scrollWidth}px`
        }
    }

    private enableScroll() {
        if (this.isScrollBlocked) {
            this.isScrollBlocked = false

            this.renderer.removeClass(this.document.documentElement, this.scrollBlockClass)
            this.scrollableContainerRef().nativeElement.style.overflow = this.scrollableContainerOverflowOldValue

            if (this.layoutPaddingOldValue) {
                const layoutElement = this.layoutContainerRef().nativeElement
                layoutElement.style.paddingLeft = this.layoutPaddingOldValue.left
                layoutElement.style.paddingRight = this.layoutPaddingOldValue.right
                this.layoutPaddingOldValue = undefined
            }
        }
    }
}

/**
 * A column of the layout's content, between the sidebars; a layout can have any number. The columns share the width
 * in the order they're written, in the page's direction; `start` moves one to the start edge, `left` to the left
 * edge whatever the direction:
 *
 * @stacked-example(Column Left, layout/layout-column-left.component)
 */
@Component({
    selector: 'nb-layout-column',
    template: '<ng-content />',
    host: {
        '[class.left]': 'left() && !start()',
        '[class.start]': 'start()'
    }
})
export class NbLayoutColumnComponent {
    /** Moves the column to the left edge, whatever the direction of the page; `start` takes precedence. */
    readonly left = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** Moves the column to the start edge: the left in a left to right page, the right in a right to left one. */
    readonly start = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })
}

/**
 * The page's header, above the columns and sidebars. A `fixed` header stays at the top of the view port while the
 * page scrolls, and the sidebars start below it:
 *
 * @stacked-example(Fixed Header, layout/layout-fixed-header.component)
 *
 * A `subheader` header sits beside the sidebar, above the columns, rather than above the sidebar:
 * ```html
 * <nb-layout-header subheader></nb-layout-header>
 * ```
 * @stacked-example(Subheader, layout/layout-sidebar-subheader.component)
 * The sidebar then has no shadow, and the header can't be `fixed`.
 *
 * A layout can have both, a fixed header and a subheader:
 * @stacked-example(Subheader, layout/layout-subheader.component)
 * @styles
 *
 * header-background-color:
 * header-text-color:
 * header-text-font-family:
 * header-text-font-size:
 * header-text-font-weight:
 * header-text-line-height:
 * header-height:
 * header-padding:
 * header-shadow:
 */
@Component({
    selector: 'nb-layout-header',
    templateUrl: './layout-header.component.html',
    host: {
        '[class.fixed]': 'fixedValue()',
        '[class.subheader]': 'subheader()'
    }
})
export class NbLayoutHeaderComponent {
    private readonly layout = inject(NbLayoutComponent)

    /** The header stays at the top of the view port while the page scrolls. */
    readonly fixed = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** The header sits beside the sidebar, above the columns; it can't be `fixed`, and the sidebar loses its shadow. */
    readonly subheader = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** A subheader can't be fixed; the `fixed` input is kept, so it applies again when `subheader` is turned off. */
    readonly fixedValue = computed(() => this.fixed() && !this.subheader())

    constructor() {
        effect(() => this.layout.withSubheader.set(this.subheader()))
    }
}

/**
 * The page's footer, under the columns, beside the sidebars. A `fixed` footer stays at the bottom of the view port
 * while the columns scroll past it, clear of a phone's home bar, e.g. with a phone's navigation in it, shown only on
 * narrow screens with `*nbShownBelow`:
 *
 * ```html
 * <nb-layout-footer fixed *nbShownBelow="'md'">
 *   <nb-route-tabset [tabs]="sections" outlet="false" appearance="bar" />
 * </nb-layout-footer>
 * ```
 *
 * @styles
 *
 * footer-background-color:
 * footer-text-color:
 * footer-text-font-family:
 * footer-text-font-size:
 * footer-text-font-weight:
 * footer-text-line-height:
 * footer-text-highlight-color:
 * footer-padding:
 * footer-divider-color:
 * footer-divider-style:
 * footer-divider-width:
 * footer-shadow:
 */
@Component({
    selector: 'nb-layout-footer',
    templateUrl: './layout-footer.component.html',
    host: {
        '[class.fixed]': 'fixed()'
    }
})
export class NbLayoutFooterComponent {
    /** The footer stays at the bottom of the view port while the columns scroll past it. */
    readonly fixed = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })
}
