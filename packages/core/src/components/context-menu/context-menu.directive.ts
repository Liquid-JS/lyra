import {
    Injector,
    afterNextRender,
    AfterViewInit,
    computed,
    DestroyRef,
    Directive,
    ElementRef,
    inject,
    input,
    OnChanges,
    OnDestroy,
    OnInit,
    signal
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { filter } from 'rxjs/operators'

import { NbDynamicOverlay, NbDynamicOverlayController, NbDynamicOverlayHandler, nbCreateDynamicOverlayHandler, NbOverlayConfig, NbAdjustment, NbAdjustmentValues, NbPosition, NbPositionValues, NbTrigger, NbTriggerValues } from '@liquid-js/lyr-core/cdk'
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbMenuItem, NbMenuService } from '@liquid-js/lyr-core/menu'
import { NbContextMenuComponent } from './context-menu.component'

export interface NbContextMenuContext {
    items: NbMenuItem[]
    tag?: string
    position: NbPosition
}

let lastContextMenuId = 0

/**
 * Opens a menu of items from an element, e.g. a profile button, in an overlay beside it.
 *
 * @stacked-example(Showcase, context-menu/context-menu-showcase.component)
 *
 * Pass the menu items:
 *
 * ```html
 * <button [nbContextMenu]="items"></button>
 * ...
 * items = [{ title: 'Profile' }, { title: 'Log out' }];
 * ```
 * ### Installation
 *
 * Import `NbContextMenuDirective` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbContextMenuDirective],
 * })
 * export class PageComponent { }
 * ```
 *
 * and add `provideNbMenu()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbMenu()],
 * });
 * ```
 *
 * With NgModules:
 *
 * Import `NbContextMenuModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbContextMenuModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * Also make sure `NbMenuModule` is imported to your `app.module`.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbMenuModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * ### Usage
 *
 * The menu inside is an `nb-menu`, so item clicks come through `NbMenuService`: give the menu an `nbContextMenuTag`
 * and listen for clicks with that tag. The menu closes after a click on an item.
 * @stacked-example(Menu item click, context-menu/context-menu-click.component)
 *
 * `nbContextMenuPlacement` puts the menu at the host's `bottom` (default), `top`, `start`, `end`, `left` or `right`,
 * or at a corner such as `bottom-start`:
 *
 * ```html
 * <button [nbContextMenu]="items" nbContextMenuPlacement="right"></button>
 * ```
 *
 * ```ts
 * items = [{ title: 'Profile' }, { title: 'Log out' }];
 * ```
 *
 * When the menu doesn't fit the viewport it moves to another side, `clockwise` by default; `nbContextMenuAdjustment`
 * changes that to `counterclockwise`, `vertical`, `horizontal`, or `noop` to keep it where it is:
 *
 * ```html
 * <button [nbContextMenu]="items" nbContextMenuAdjustment="counterclockwise"></button>
 * ```
 *
 * ```ts
 * items = [{ title: 'Profile' }, { title: 'Log out' }];
 * ```
 * `nbContextMenuTrigger` sets what opens and closes the menu:
 *
 * - `click` (default) opens it with a click on the host and closes it with a click elsewhere on the page. The host
 * is a disclosure then, with `aria-expanded` and `aria-controls`; a menu opened by keyboard takes the focus to its
 * first item, and Escape brings it back.
 * - `hint` opens it while the pointer is over the host.
 * - `hover` is `hint`, but the menu stays open while the pointer moves from the host onto it, so its items can be
 * clicked.
 * - `focus` opens it while the host has focus.
 * - `noop` leaves it to `show()`, `hide()` and `toggle()`.
 * @stacked-example(Available Triggers, context-menu/context-menu-modes.component.html)
 *
 * `noop` is for a menu opened from code, e.g. after a request or a check, or on a right click:
 * @stacked-example(Manual Control, context-menu/context-menu-noop.component)
 * @stacked-example(Manual Control, context-menu/context-menu-right-click.component)
 */
@Directive({
    selector: '[nbContextMenu]',
    host: {
        'class': 'context-menu-host',
        // A host the menu opens from on click says whether it's open, and what it opens, as a disclosure does.
        '[attr.aria-expanded]': 'discloses() ? expanded() : null',
        '[attr.aria-controls]': 'discloses() && expanded() ? containerId : null',
        '(click)': 'noteKeyboardOpen($event)'
    }
})
export class NbContextMenuDirective implements NbDynamicOverlayController, OnChanges, AfterViewInit, OnDestroy, OnInit {
    private readonly hostRef = inject(ElementRef)
    private readonly menuService = inject(NbMenuService)
    private readonly destroyRef = inject(DestroyRef)
    private readonly injector = inject(Injector)

    /**
     * Where the menu opens, relative to the host: `bottom` (default), `top`, `start`, `end`, `left`, `right`, or a
     * corner such as `bottom-start`.
     */
    readonly position = input<NbPosition, NbPositionValues>(NbPosition.BOTTOM, {
        alias: 'nbContextMenuPlacement',
        transform: (value) => value as NbPosition
    })

    /**
     * Where the menu moves when it doesn't fit the viewport: to the next side `clockwise` (default) or
     * `counterclockwise`, to the opposite side `vertical`ly or `horizontal`ly, or nowhere with `noop`.
     */
    readonly adjustment = input<NbAdjustment, NbAdjustmentValues>(NbAdjustment.CLOCKWISE, {
        alias: 'nbContextMenuAdjustment',
        transform: (value) => value as NbAdjustment
    })

    /**
     * The tag of the `nb-menu` inside, which tells its events apart in `NbMenuService`.
     */
    readonly tag = input<string>(undefined, { alias: 'nbContextMenuTag' })

    /**
     * The menu items. Without any, the menu doesn't open.
     */
    readonly items = input<NbMenuItem[], NbMenuItem[] | null | undefined>([], {
        alias: 'nbContextMenu',
        // An empty or missing list keeps the menu closed (see configureDynamicOverlay) instead of throwing.
        transform: (items) => items ?? []
    })

    /**
     * What opens and closes the menu: `click` (default), `hover`, `hint`, `focus` or `noop`.
     */
    readonly trigger = input<NbTrigger, NbTriggerValues>(NbTrigger.CLICK, {
        alias: 'nbContextMenuTrigger',
        transform: (value) => value as NbTrigger
    })

    /**
     * Class added to the overlay pane, for styling the menu.
     */
    readonly contextMenuClass = input('', { alias: 'nbContextMenuClass' })

    /** The menu's distance from its host, as a popover's `nbPopoverOffset`. */
    readonly offset = input(15, { alias: 'nbContextMenuOffset' })

    /** Keeps the menu from opening, as a popover's `nbPopoverDisabled`. */
    readonly disabled = input<boolean, NbBooleanInput>(false, {
        alias: 'nbContextMenuDisabled',
        transform: convertToBoolProperty
    })

    protected readonly overlayConfig = computed<NbOverlayConfig>(() => ({ panelClass: this.contextMenuClass() }))
    protected readonly overlayContext = computed<NbContextMenuContext>(() => ({
        items: this.items(),
        tag: this.tag(),
        position: this.position()
    }))

    private dynamicOverlay?: NbDynamicOverlay

    private readonly dynamicOverlayHandler =
        inject(NbDynamicOverlayHandler, { optional: true, self: true }) ?? nbCreateDynamicOverlayHandler()

    ngOnInit() {
        this.dynamicOverlayHandler
            .host(this.hostRef)
            .componentType(NbContextMenuComponent)
    }

    ngOnChanges() {
        this.rebuild()
    }

    protected readonly expanded = signal(false)
    protected readonly containerId = `nb-context-menu-${lastContextMenuId++}`
    protected readonly discloses = computed(() => this.trigger() === NbTrigger.CLICK)

    ngAfterViewInit() {
        const overlay = this.configureDynamicOverlay().build()
        this.dynamicOverlay = overlay
        overlay.isShown.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((shown) => {
            this.expanded.set(shown)
            overlay.containerElement?.setAttribute('id', this.containerId)
        })
        this.subscribeOnItemClick()
        // A menu the keyboard opens takes the focus to its first item, as a menu button's does, so the keyboard can go on
        // to choose one; Escape brings it back.
        overlay.isShown
            .pipe(
                filter((shown) => shown && this.openedByKeyboard),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() =>
                afterNextRender(
                    () => overlay.containerElement?.querySelector<HTMLElement>('a[href], button, [tabindex="0"]')?.focus(),
                    { injector: this.injector }
                )
            )
    }

    // Whether the host was last activated by the keyboard: its click then has no mouse button presses.
    private openedByKeyboard = false

    protected noteKeyboardOpen(event: MouseEvent) {
        this.openedByKeyboard = event.detail === 0
    }

    rebuild() {
        this.dynamicOverlay = this.configureDynamicOverlay()
            .rebuild()
    }

    show() {
        this.builtOverlay().show()
    }

    hide() {
        this.builtOverlay().hide()
    }

    toggle() {
        this.builtOverlay().toggle()
    }

    ngOnDestroy() {
        this.dynamicOverlayHandler.destroy()
    }

    private builtOverlay(): NbDynamicOverlay {
        if (!this.dynamicOverlay) {
            throw new Error('NbContextMenuDirective: the context menu is built once the view initialises.')
        }
        return this.dynamicOverlay
    }

    protected configureDynamicOverlay() {
        return this.dynamicOverlayHandler
            .position(this.position())
            .trigger(this.trigger())
            .disabled(this.disabled() || !this.items().length)
            .offset(this.offset())
            .adjustment(this.adjustment())
            .context(this.overlayContext())
            .overlayConfig(this.overlayConfig())
    }

    private subscribeOnItemClick() {
        this.menuService.onItemClick()
            .pipe(
                filter(({ tag }) => tag === this.tag() && this.trigger() !== NbTrigger.NOOP),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.hide())
    }
}
