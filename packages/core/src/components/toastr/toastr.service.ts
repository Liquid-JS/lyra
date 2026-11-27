import { ComponentRef, EnvironmentInjector, inject, Service } from '@angular/core'
import { outputToObservable } from '@angular/core/rxjs-interop'
import { defer, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'

import { NbComponentPortal, NbOverlayRef, NbOverlayService, patch, NbPositionBuilderService, NbGlobalLogicalPosition, NbGlobalPosition, NbPositionHelper } from '@liquid-js/lyr-core/cdk'
import { NB_DOCUMENT } from '@liquid-js/lyr-core/base'
import { NbToastrContainerComponent } from './toastr-container.component'
import { NB_TOASTR_CONFIG, NbToastrConfig } from './toastr-config'
import { NbToast } from './model'
import { NbToastComponent } from './toast.component'

export class NbToastRef {
    /** Emits once the toast is closed, as a dialog's and a window's `onClose` do. */
    readonly onClose: Observable<void>
    /** Emits as the toast is clicked. */
    readonly onClick: Observable<void>

    constructor(
        private toastContainer: NbToastContainer,
        private toast: NbToast,
        /** The toast. */
        public toastInstance: NbToastComponent
    ) {
    // Read as they're observed, from the toast the ref has then.
        this.onClose = defer(() => outputToObservable(this.toastInstance.destroy))
        this.onClick = defer(() => outputToObservable(this.toastInstance.toastClick))
    }

    close() {
        this.toastContainer.destroy(this.toast)
    }
}

export class NbToastContainer {
    protected toasts = new Array<NbToast>()
    protected prevToast?: NbToast
    protected destroyTimeouts = new Map<NbToast, ReturnType<typeof setTimeout>>()

    get nativeElement() {
        return this.containerRef.location.nativeElement
    }

    constructor(
        protected position: NbGlobalPosition,
        protected containerRef: ComponentRef<NbToastrContainerComponent>,
        protected positionHelper: NbPositionHelper
    ) {}

    attach(toast: NbToast): NbToastRef | undefined {
        if (toast.config.preventDuplicates && this.isDuplicate(toast)) {
            return undefined
        }

        this.removeToastIfLimitReached(toast)
        const toastComponent: NbToastComponent = this.attachToast(toast)

        if (toast.config.destroyByClick) {
            this.subscribeOnClick(toastComponent, toast)
        }

        if (toast.config.closeButton) {
            this.subscribeOnCloseClick(toastComponent, toast)
        }

        if (toast.config.duration) {
            this.setDestroyTimeout(toast)
            this.subscribeOnHold(toastComponent, toast)
        }

        if (toast.config.actions?.length && !toast.config.closeButton) {
            // An action closes the toast unless it says otherwise.
            this.subscribeOnCloseClick(toastComponent, toast)
        }

        this.prevToast = toast

        const toastRef = new NbToastRef(this, toast, toastComponent)
        if (toastComponent) {
            toastComponent.ref = toastRef
        }

        return toastRef
    }

    destroy(toast: NbToast) {
        if (this.prevToast === toast) {
            this.prevToast = undefined
        }

        this.clearDestroyTimeout(toast)
        this.toasts = this.toasts.filter((t) => t !== toast)
        this.updateContainer()
    }

    protected isDuplicate(toast: NbToast): boolean {
        return toast.config.duplicatesBehaviour === 'previous'
            ? this.isDuplicatePrevious(toast)
            : this.isDuplicateAmongAll(toast)
    }

    protected isDuplicatePrevious(toast: NbToast): boolean {
        return !!this.prevToast && this.toastDuplicateCompareFunc(this.prevToast, toast)
    }

    protected isDuplicateAmongAll(toast: NbToast): boolean {
        return this.toasts.some((t) => this.toastDuplicateCompareFunc(t, toast))
    }

    protected toastDuplicateCompareFunc = (t1: NbToast, t2: NbToast): boolean => t1.message === t2.message && t1.title === t2.title && t1.config.status === t2.config.status

    protected removeToastIfLimitReached(toast: NbToast) {
        if (!toast.config.limit || this.toasts.length < toast.config.limit) {
            return
        }
        if (this.positionHelper.isTopPosition(toast.config.position)) {
            this.toasts.pop()
        } else {
            this.toasts.shift()
        }
    }

    protected attachToast(toast: NbToast): NbToastComponent {
        if (this.positionHelper.isTopPosition(toast.config.position)) {
            return this.attachToTop(toast)
        } else {
            return this.attachToBottom(toast)
        }
    }

    protected attachToTop(toast: NbToast): NbToastComponent {
        this.toasts.unshift(toast)
        this.updateContainer()
        return this.containerRef.instance.toasts()[0]
    }

    protected attachToBottom(toast: NbToast): NbToastComponent {
        this.toasts.push(toast)
        this.updateContainer()
        const toasts = this.containerRef.instance.toasts()
        return toasts[toasts.length - 1]
    }

    protected setDestroyTimeout(toast: NbToast) {
        this.clearDestroyTimeout(toast)
        this.destroyTimeouts.set(
            toast,
            setTimeout(() => this.destroy(toast), toast.config.duration)
        )
    }

    protected clearDestroyTimeout(toast: NbToast) {
        clearTimeout(this.destroyTimeouts.get(toast))
        this.destroyTimeouts.delete(toast)
    }

    // A toast's outputs complete when it's destroyed, which ends these subscriptions.
    protected subscribeOnCloseClick(toastComponent: NbToastComponent, toast: NbToast) {
        outputToObservable(toastComponent.closeClick).subscribe(() => this.destroy(toast))
    }

    // Paused while hovered (with `pauseOnHover`), focused, or an action runs; the full duration starts again after.
    protected subscribeOnHold(toastComponent: NbToastComponent, toast: NbToast) {
        outputToObservable(toastComponent.holdChange).subscribe((held) => {
            if (held) {
                this.clearDestroyTimeout(toast)
            } else if (this.toasts.includes(toast)) {
                // Not after an action closed it.
                this.setDestroyTimeout(toast)
            }
        })
    }

    protected subscribeOnClick(toastComponent: NbToastComponent, toast: NbToast) {
        outputToObservable(toastComponent.toastClick)
            .pipe(filter(() => toast.config.destroyByClick))
            .subscribe(() => this.destroy(toast))
    }

    protected updateContainer() {
    // A copy, so the container sees a changed input rather than the same array.
        patch(this.containerRef, { content: [...this.toasts], position: this.position })
    }
}

interface NbToastrOverlayWithContainer {
    overlayRef: NbOverlayRef
    toastrContainer: NbToastContainer
}

@Service({ autoProvided: false })
export class NbToastrContainerRegistry {
    protected readonly overlay = inject(NbOverlayService)
    protected readonly positionBuilder = inject(NbPositionBuilderService)
    protected readonly positionHelper = inject(NbPositionHelper)
    protected readonly document = inject(NB_DOCUMENT)
    protected readonly environmentInjector = inject(EnvironmentInjector, { optional: true })

    protected overlays = new Map<NbGlobalPosition, NbToastrOverlayWithContainer>()

    get(position: NbGlobalPosition): NbToastContainer {
        const logicalPosition: NbGlobalLogicalPosition = this.positionHelper.toLogicalPosition(position)

        let overlayWithContainer = this.overlays.get(logicalPosition)
        if (!overlayWithContainer || !this.existsInDom(overlayWithContainer.toastrContainer)) {
            if (overlayWithContainer) {
                overlayWithContainer.overlayRef.dispose()
            }
            overlayWithContainer = this.instantiateContainer(logicalPosition)
        }

        return overlayWithContainer.toastrContainer
    }

    protected instantiateContainer(position: NbGlobalLogicalPosition): NbToastrOverlayWithContainer {
        const toastrOverlayWithContainer = this.createContainer(position)
        this.overlays.set(position, toastrOverlayWithContainer)
        return toastrOverlayWithContainer
    }

    protected createContainer(position: NbGlobalLogicalPosition): NbToastrOverlayWithContainer {
        const positionStrategy = this.positionBuilder.global().position(position)
        const ref = this.overlay.create({ positionStrategy })
        this.addClassToOverlayHost(ref)
        const portal = new NbComponentPortal(NbToastrContainerComponent, null, this.environmentInjector ?? null)
        const containerRef = ref.attach(portal)
        return {
            overlayRef: ref,
            toastrContainer: new NbToastContainer(position, containerRef, this.positionHelper)
        }
    }

    protected addClassToOverlayHost(overlayRef: NbOverlayRef) {
        overlayRef.hostElement.classList.add('toastr-overlay-container')
    }

    protected existsInDom(toastContainer: NbToastContainer): boolean {
        return this.document.body.contains(toastContainer.nativeElement)
    }
}

/**
 * Shows toast notifications.
 *
 * @stacked-example(Showcase, toastr/toastr-showcase.component)
 *
 * `NbToastrService.show(message, title, config)` takes a message; the title and config are optional.
 *
 * ### Installation
 *
 * Add `provideNbToastr()` to the application providers:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbToastr(config)],
 * });
 * ```
 *
 * With NgModules:
 *
 * Import `NbToastrModule.forRoot()` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbToastrModule.forRoot(config),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * ### Usage
 *
 * `NbToastrService.show(...)` renders a toast and returns its `NbToastRef`, whose `close` method closes it:
 *
 * ```ts
 * const toastRef: NbToastRef = this.toastrService.show(...);
 * toastRef.close();
 * ```
 *
 * The config's options:
 *
 * `position` - where on the screen the toast appears.
 * Default is `top-end`. The theme's `toastr-offset` keeps toasts clear of what's fixed at the screen's edges, e.g.
 * `4.5rem 0 0` below a fixed header.
 * @stacked-example(Position, toastr/toastr-positions.component)
 *
 * `status` - the colour and icon of the toast.
 * Default is `basic`.
 * @stacked-example(Status, toastr/toastr-statuses.component)
 *
 * `duration` - how long the toast stays, in ms. `0` keeps it until it's closed: by a click, its close button or
 * an action.
 * Default is 3000.
 * @stacked-example(Duration, toastr/toastr-duration.component)
 *
 * `destroyByClick` - a click on the toast closes it.
 * Default is true.
 * @stacked-example(Destroy by click, toastr/toastr-destroy-by-click.component)
 *
 * `preventDuplicates` - drops a toast with the same title, message and status as one shown; `show` then returns
 * `undefined`.
 * Default is false.
 * @stacked-example(Prevent duplicates, toastr/toastr-prevent-duplicates.component)
 *
 * `duplicatesBehaviour` - what a duplicate is compared with: the previous toast (`previous`) or all visible ones
 * (`all`).
 * @stacked-example(Prevent duplicates behaviour , toastr/toastr-prevent-duplicates-behaviour.component)
 *
 * `limit` - how many toasts a position shows at once; the oldest goes when a new one exceeds it. Unlimited by
 * default.
 * @stacked-example(Prevent duplicates behaviour , toastr/toastr-limit.component)
 *
 * `icon` - a custom icon, by name or config; the status's icon by default, and `''` for none.
 * @stacked-example(Has icon, toastr/toastr-icon.component)
 *
 * `actions` - buttons under the message, e.g. to undo what the toast tells about. The toast closes after an action
 * (unless it sets `close: false`); an action that returns a promise shows a loading button until it completes. The
 * toast's timer is paused while the focus is in it, or an action runs.
 * @stacked-example(Actions, toastr/toastr-actions.component)
 * */
@Service({ autoProvided: false })
export class NbToastrService {
    protected readonly globalConfig = inject<NbToastrConfig>(NB_TOASTR_CONFIG)
    protected readonly containerRegistry = inject(NbToastrContainerRegistry)

    /**
     * Shows a toast and returns its ref, or `undefined` when `preventDuplicates` drops it.
     *
     * @param message the toast's text
     * @param title its title, above the text
     * @param userConfig an `NbToastrConfig`'s options over `NbToastrModule.forRoot()`'s, e.g. its `status`, `icon`
     * or `duration`; `success()` and the other statuses' methods take them too
     */
    show(message: string, title?: string, userConfig?: Partial<NbToastrConfig>): NbToastRef | undefined {
        const config = new NbToastrConfig({ ...this.globalConfig, ...userConfig })
        const container = this.containerRegistry.get(config.position)
        const toast = { message, title, config }
        return container.attach(toast)
    }

    /** `show` with the `success` status. */
    success(message: string, title?: string, config?: Partial<NbToastrConfig>): NbToastRef | undefined {
        return this.show(message, title, { ...config, status: 'success' })
    }

    /** `show` with the `info` status. */
    info(message: string, title?: string, config?: Partial<NbToastrConfig>): NbToastRef | undefined {
        return this.show(message, title, { ...config, status: 'info' })
    }

    /** `show` with the `warning` status. */
    warning(message: string, title?: string, config?: Partial<NbToastrConfig>): NbToastRef | undefined {
        return this.show(message, title, { ...config, status: 'warning' })
    }

    /** `show` with the `primary` status. */
    primary(message: string, title?: string, config?: Partial<NbToastrConfig>): NbToastRef | undefined {
        return this.show(message, title, { ...config, status: 'primary' })
    }

    /** `show` with the `danger` status. */
    danger(message: string, title?: string, config?: Partial<NbToastrConfig>): NbToastRef | undefined {
        return this.show(message, title, { ...config, status: 'danger' })
    }

    /** `show` with the `basic` status. */
    default(message: string, title?: string, config?: Partial<NbToastrConfig>): NbToastRef | undefined {
        return this.show(message, title, { ...config, status: 'basic' })
    }

    /** `show` with the `control` status. */
    control(message: string, title?: string, config?: Partial<NbToastrConfig>): NbToastRef | undefined {
        return this.default(message, title, { ...config, status: 'control' })
    }
}
