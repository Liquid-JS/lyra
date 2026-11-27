import { Injector, TemplateRef, Type, inject, Service } from '@angular/core'
import { NavigationStart, Router, UrlTree } from '@angular/router'
import { filter, takeUntil } from 'rxjs/operators'

import { NbComponentPortal, NbOverlayRef, NbScrollStrategy, NbTemplatePortal, NbGlobalPositionStrategy, NbPositionBuilderService, NbEscapeStack, NbOverlayService, setComponentContext, NbGlobalPosition, NbPositionHelper } from '@liquid-js/lyr-core/cdk'
import { NB_DOCUMENT, ɵnbSwipeToDismiss as nbSwipeToDismiss } from '@liquid-js/lyr-core/base'
import { NB_DIALOG_CONFIG, NbDialogConfig } from './dialog-config'
import { NbDialogRef } from './dialog-ref'
import { NbDialogContainerComponent } from './dialog-container'
import { NbConfirmDialogComponent, NbConfirmDialogOptions } from './confirm-dialog.component'
import { animateDialog } from './dialog-animation'

/**
 * Opens dialogs: a component or a template over the page, centred by default, with a backdrop that makes it modal.
 *
 * @stacked-example(Showcase, dialog/dialog-showcase.component)
 *
 * `open` takes the component or template and an optional configuration, and returns an `NbDialogRef` to close the
 * dialog with and to get its result from.
 *
 * ### Installation
 *
 * Add `provideNbDialog()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbDialog(config)],
 * });
 * ```
 * In a lazy loaded route, add `provideNbDialog()` to the route's `providers` instead, so the route gets its own instance.
 *
 * With NgModules:
 *
 * Import `NbDialogModule.forRoot()` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbDialogModule.forRoot(config),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * If you are using it in a lazy loaded module than you have to install it with `NbDialogModule.forChild()`:
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbDialogModule.forChild(config),
 *   ],
 * })
 * export class LazyLoadedModule { }
 * ```
 *
 * ### Usage
 *
 * ```ts
 * const dialogRef = this.dialogService.open(MyDialogComponent, { ... });
 * ```
 *
 * `NbDialogRef` holds the rendered component, closes the dialog and emits its result. The dialog's component can
 * inject it:
 *
 * ```ts
 * this.dialogService.open(MyDialogComponent, { ... });
 *
 * // my-dialog.component.ts
 * constructor(protected dialogRef: NbDialogRef) {
 * }
 *
 * close() {
 *   this.dialogRef.close();
 * }
 * ```
 *
 * A dialog can be a template instead of a component:
 * @stacked-example(Template ref, dialog/dialog-template.component)
 *
 * The dialog closes with a result, `dialogRef.close(result)`, which the opener gets from `onClose`:
 * @stacked-example(Result, dialog/dialog-result.component)
 *
 * `onClose` emits `unknown` unless `open` is told the result's type, after the content's:
 *
 * ```ts
 * this.dialogService
 *   .open<EditCustomerComponent, Customer>(EditCustomerComponent, { context: { customer } })
 *   .onClose.subscribe((saved) => saved && this.save(saved));
 * ```
 *
 * ### Configuration
 *
 * `open` takes options, and `provideNbDialog` or `NbDialogModule.forRoot({ ... })` sets their defaults:
 *
 * `context` - data for the content: a component gets it as its inputs, a template as `$implicit`.
 *
 * ```ts
 * this.dialogService.open(template, { context: 'pass data in template' });
 * ```
 *
 * ```html
 * <ng-template let-some-additional-data>
 *   {{ some-additional-data }}
 * <ng-template/>
 * ```
 *
 * `hasBackdrop` - shows a backdrop under the dialog, which makes it modal. Default is true.
 * @stacked-example(Backdrop, dialog/dialog-has-backdrop.component)
 *
 * `closeOnBackdropClick` - closes the dialog with a click on the backdrop. Default is true.
 * @stacked-example(Backdrop click, dialog/dialog-backdrop-click.component)
 *
 * `closeOnEsc` - closes the dialog with Escape. Default is true.
 * @stacked-example(Escape hit, dialog/dialog-esc.component)
 *
 * `closeOnNavigation` - closes the dialog when a navigation leaves its page, e.g. with the browser's back button. A
 * navigation that only changes the query or fragment, as apps do to keep state in the URL, leaves it open. Default is
 * false.
 *
 * `hasScroll` - lets the page scroll under the dialog. Default is false: the page can't scroll while a dialog is
 * open. Open the dialogs in a separate window and try to scroll.
 * @stacked-example(Scroll, dialog/dialog-scroll.component)
 *
 * `autoFocus` - focuses the dialog's first focusable element once it opens, or at least takes the focus off the
 * element that opened it, and returns the focus when it closes. Default is true. Without it the focus stays on the
 * opener, so Space opens the same dialog again: open the dialogs in a separate window, click the button without
 * focus and press Space a few times.
 * @stacked-example(Auto focus, dialog/dialog-auto-focus.component)
 *
 * `position` - where the dialog appears: `center` (default), `top`, `bottom`, or a corner such as `bottom-start` or
 * `top-right`, with `positionOffset` as the space to the viewport edges. A dialog without a backdrop in a corner
 * suits notices such as a cookie consent.
 * @stacked-example(Position, dialog/dialog-position.component)
 *
 * `sheet` - a sheet along the bottom of the screen, as a phone's: a card's details under the thumb, as wide as the
 * screen up to 36rem, flush with the bottom. It slides up as it opens and back down as it closes, rather than fading.
 * One that `closeOnBackdropClick` closes is swiped down to close too, once its content is scrolled to the top.
 * ```ts
 * this.dialogService.open(DetailsComponent, { sheet: true, closeOnBackdropClick: true })
 * ```
 *
 * ### Confirm dialog
 *
 * `confirm` asks the user to confirm an action and resolves to whether they did. Pass `action` to run it from the
 * dialog: it stays open while the action runs, so a failed request can be retried, and closes once it succeeds.
 * @stacked-example(Confirm, dialog/dialog-confirm.component)
 *
 * Set the default button texts and status, e.g. to translate them, with `provideNbConfirmDialog`.
 * @styles
 *
 * overlay-backdrop-background-color:
 */
@Service({ autoProvided: false })
export class NbDialogService {
    protected readonly document = inject(NB_DOCUMENT)
    protected readonly globalConfig = inject(NB_DIALOG_CONFIG)
    protected readonly positionBuilder = inject(NbPositionBuilderService)
    protected readonly overlay = inject(NbOverlayService)
    protected readonly injector = inject(Injector)
    protected readonly router = inject(Router, { optional: true })
    protected readonly positionHelper = inject(NbPositionHelper)
    protected readonly escapeStack = inject(NbEscapeStack)

    /**
     * Opens a dialog with the component or template. `R` is the type of the result the dialog closes with, which
     * `onClose` emits, e.g. `open<EditComponent, Customer>(EditComponent)`.
     *
     * @param content the component or template the dialog shows
     * @param userConfig an `NbDialogConfig`'s options over `NbDialogModule.forRoot()`'s, e.g. its `context`, `position`
     * or `dialogClass`
     */
    open<T, R = unknown>(content: Type<T> | TemplateRef<T>,
        userConfig: Partial<NbDialogConfig<Partial<T> | string>> = {}): NbDialogRef<T, R> {
        const config = new NbDialogConfig<Partial<T> | string>({ ...this.globalConfig, ...userConfig })
        const overlayRef = this.createOverlay(config)
        const dialogRef = new NbDialogRef<T, R>(overlayRef, !!config.sheet)
        // The dialog takes Escape while it's on top, before its content adds what it opens, e.g. a popover, above it. One
        // that doesn't close on Escape still keeps it from what's under it.
        const escape = this.escapeStack.add(() => {
            if (config.closeOnEsc) {
                dialogRef.close()
            }
        })
        dialogRef.onClose.subscribe(() => escape.remove())
        const container = this.createContainer(config, overlayRef)
        this.createContent(config, content, container, dialogRef)
        // Rendered before the browser paints, rather than with the next change detection, which can come a frame later.
        container.detectChanges()
        void animateDialog(overlayRef.overlayElement, true, !!config.sheet)

        this.registerCloseListeners(config, overlayRef, dialogRef)

        return dialogRef
    }

    /**
     * Asks the user to confirm an action; resolves to `true` once they confirm and `action`, if given, completes,
     * or to `false` when they cancel or the dialog closes otherwise.
     *
     * ```ts
     * const deleted = await this.dialogService.confirm({
     *   title: 'Delete the invoice?',
     *   message: "It can't be restored.",
     *   confirmText: 'Delete',
     *   status: 'danger',
     *   action: () => this.invoices.delete(id),
     * });
     * ```
     *
     * @param options what it asks, and its buttons: an `NbConfirmDialogOptions`
     * @param userConfig the dialog's config, as `open()` takes it, e.g. `{ position: 'top', positionOffset: '6rem' }`
     */
    confirm(options: NbConfirmDialogOptions, userConfig: Partial<NbDialogConfig> = {}): Promise<boolean> {
        const ids = NbConfirmDialogComponent.nextIds()
        const dialogRef = this.open(NbConfirmDialogComponent, {
            // The dialog handles Escape itself, so it can ignore it while the action runs.
            closeOnEsc: false,
            closeOnBackdropClick: false,
            role: 'alertdialog',
            ariaLabelledBy: ids.titleId,
            ariaDescribedBy: options.message ? ids.messageId : undefined,
            ...userConfig,
            context: { options, ...ids }
        })
        return new Promise((resolve) => dialogRef.onClose.subscribe((confirmed) => resolve(confirmed === true)))
    }

    protected createOverlay(config: NbDialogConfig): NbOverlayRef {
        const positionStrategy = this.createPositionStrategy(config)
        const scrollStrategy = this.createScrollStrategy(config.hasScroll)

        return this.overlay.create({
            positionStrategy,
            scrollStrategy,
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.dialogClass
        })
    }

    protected createPositionStrategy(config?: NbDialogConfig): NbGlobalPositionStrategy {
        const strategy = this.positionBuilder.global()
        const position = config?.sheet ? 'bottom' : config?.position ?? 'center'
        const offset = config?.sheet ? '' : config?.positionOffset ?? ''
        switch (position) {
            case 'center':
                return strategy.centerVertically().centerHorizontally()
            case 'top':
                return strategy.top(offset).centerHorizontally()
            case 'bottom':
                return strategy.bottom(offset).centerHorizontally()
        }
        // A physical corner, with start and end resolved for the layout direction.
        const [vertical, horizontal] = this.positionHelper.toPhysicalPosition(position as NbGlobalPosition).split('-')
        const placed = vertical === 'top' ? strategy.top(offset) : strategy.bottom(offset)
        return horizontal === 'left' ? placed.left(offset) : placed.right(offset)
    }

    protected createScrollStrategy(hasScroll: boolean): NbScrollStrategy {
        if (hasScroll) {
            return this.overlay.scrollStrategies.noop()
        } else {
            return this.overlay.scrollStrategies.block()
        }
    }

    protected createContainer(config: NbDialogConfig, overlayRef: NbOverlayRef): NbDialogContainerComponent {
        const injector = Injector.create({
            parent: this.createInjector(config),
            providers: [{ provide: NbDialogConfig, useValue: config }]
        })
        const containerPortal = new NbComponentPortal(NbDialogContainerComponent, null, injector)
        const containerRef = overlayRef.attach(containerPortal)
        return containerRef.instance
    }

    protected createContent<T, R>(config: NbDialogConfig,
        content: Type<T> | TemplateRef<T>,
        container: NbDialogContainerComponent,
        dialogRef: NbDialogRef<T, R>) {
        if (content instanceof TemplateRef) {
            const portal = this.createTemplatePortal(config, content, dialogRef)
            container.attachTemplatePortal(portal)
        } else {
            const portal = this.createComponentPortal(config, content, dialogRef)
            const componentRef = container.attachComponentPortal(portal)
            dialogRef.componentRef = componentRef

            if (config.context) {
                setComponentContext(componentRef, config.context)
            }
        }
    }

    protected createTemplatePortal<T, R>(config: NbDialogConfig,
        content: TemplateRef<unknown>,
        dialogRef: NbDialogRef<T, R>): NbTemplatePortal {
        return new NbTemplatePortal(content, undefined, { $implicit: config.context, dialogRef })
    }

    /**
     * The portal's injector, under the `viewContainerRef`'s or the service's, provides the `NbDialogRef` the dialog's
     * component injects.
     */
    protected createComponentPortal<T, R>(config: NbDialogConfig,
        content: Type<T>,
        dialogRef: NbDialogRef<T, R>): NbComponentPortal<T> {
        const injector = this.createInjector(config)
        const portalInjector = Injector.create({
            parent: injector,
            providers: [{ provide: NbDialogRef, useValue: dialogRef }]
        })
        return new NbComponentPortal(content, config.viewContainerRef, portalInjector)
    }

    protected createInjector(config: NbDialogConfig): Injector {
        return config.viewContainerRef && config.viewContainerRef.injector || this.injector
    }

    protected registerCloseListeners<T, R>(config: NbDialogConfig,
        overlayRef: NbOverlayRef,
        dialogRef: NbDialogRef<T, R>) {
        if (config.closeOnBackdropClick) {
            overlayRef.backdropClick().subscribe(() => dialogRef.close())

            // A sheet that its backdrop closes is swiped down to close too, its backdrop fading as it goes.
            if (config.sheet) {
                const stop = nbSwipeToDismiss(overlayRef.overlayElement, {
                    edge: 'bottom',
                    progress: (fraction) => overlayRef.backdropElement?.style.setProperty('opacity', fraction ? String(1 - fraction) : ''),
                    dismiss: () => dialogRef.close()
                })
                dialogRef.onClose.subscribe(() => stop())
            }
        }

        const router = this.router
        if (config.closeOnNavigation && router) {
            // The page a URL shows, without the query and fragment that apps change to keep state in the URL.
            const page = (url: string) => router.serializeUrl(new UrlTree(router.parseUrl(url).root))
            router.events
                .pipe(
                    filter((event) => event instanceof NavigationStart && page(event.url) !== page(router.url)),
                    takeUntil(dialogRef.onClose)
                )
                .subscribe(() => dialogRef.close())
        }
    }
}
