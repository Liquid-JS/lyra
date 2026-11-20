import { ElementRef, inject, Injectable, SimpleChange, Type, Injector } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { skip, takeUntil } from 'rxjs/operators'

import { NbLayoutDirectionService } from '@liquid-js/lyr-core/base'
import { NbTrigger, NbTriggerStrategy, NbTriggerStrategyBuilderService } from '../overlay-trigger'
import { NbEscapeEntry, NbEscapeStack } from '../overlay-escape'
import {
    NbAdjustableConnectedPositionStrategy,
    NbAdjustment,
    NbPosition,
    NbPositionBuilderService
} from '../overlay-position'
import { NbRenderableContainer } from '../overlay-container'
import { NbOverlayContent, NbOverlayService } from '../overlay-service'
import { NbOverlayConfig, NbOverlayContainer } from '../mapping'
import { NbDynamicOverlay } from './dynamic-overlay'

export class NbDynamicOverlayChange extends SimpleChange {
    constructor(previousValue: unknown, currentValue: unknown, firstChange: boolean = false) {
        super(previousValue, currentValue, firstChange)
    }

    isChanged(): boolean {
        return this.currentValue !== this.previousValue
    }
}

/** The handler settings changed since the overlay was last built or rebuilt. */
export interface NbDynamicOverlayChanges {
    host?: NbDynamicOverlayChange
    trigger?: NbDynamicOverlayChange
    disabled?: NbDynamicOverlayChange
    position?: NbDynamicOverlayChange
    adjustment?: NbDynamicOverlayChange
    componentType?: NbDynamicOverlayChange
    content?: NbDynamicOverlayChange
    context?: NbDynamicOverlayChange
    offset?: NbDynamicOverlayChange
    overlayConfig?: NbDynamicOverlayChange
}

/**
 * Builds and keeps up a dynamic overlay from the settings the overlay directives give it: `build()` creates the
 * overlay once `componentType` and `host` are set, and `rebuild()` applies the settings changed since, replacing
 * only what they affect (the position strategy, the trigger, the content or the container component).
 */
// Provided with constructor injection, which @Service doesn't support.
@Injectable()
export class NbDynamicOverlayHandler {
    protected _componentType?: Type<NbRenderableContainer>
    protected _host?: ElementRef
    protected _context: object = {}
    protected _content?: NbOverlayContent
    protected _trigger: NbTrigger = NbTrigger.NOOP
    protected _disabled = false
    protected _position: NbPosition = NbPosition.TOP
    protected _adjustment: NbAdjustment = NbAdjustment.NOOP
    protected _offset = 15
    protected _overlayConfig: NbOverlayConfig = {}

    protected dynamicOverlay?: NbDynamicOverlay
    protected triggerStrategy?: NbTriggerStrategy
    protected escapeEntry?: NbEscapeEntry
    protected escapeSubscription?: Subscription

    protected positionStrategy?: NbAdjustableConnectedPositionStrategy

    protected changes: NbDynamicOverlayChanges = {}

    protected destroy$ = new Subject<void>()

    /* eslint-disable @angular-eslint/prefer-inject -- constructor injection on purpose, see the note on the class */
    constructor(
        private positionBuilder: NbPositionBuilderService,
        private triggerStrategyBuilder: NbTriggerStrategyBuilderService,
        private dynamicOverlayService: NbDynamicOverlay,
        private directionService: NbLayoutDirectionService,
        private escapeStack?: NbEscapeStack
    ) {}
    /* eslint-enable @angular-eslint/prefer-inject */

    host(host: ElementRef) {
        this.changes.host = new NbDynamicOverlayChange(this._host, host)
        this._host = host
        return this
    }

    trigger(trigger: NbTrigger) {
        this.changes.trigger = new NbDynamicOverlayChange(this._trigger, trigger)
        this._trigger = trigger
        return this
    }

    disabled(disabled: boolean) {
        this.changes.disabled = new NbDynamicOverlayChange(this._disabled, disabled)
        this._disabled = disabled
        return this
    }

    position(position: NbPosition) {
        this.changes.position = new NbDynamicOverlayChange(this._position, position)
        this._position = position
        return this
    }

    adjustment(adjustment: NbAdjustment) {
        this.changes.adjustment = new NbDynamicOverlayChange(this._adjustment, adjustment)
        this._adjustment = adjustment
        return this
    }

    componentType(componentType: Type<NbRenderableContainer>) {
        this.changes.componentType = new NbDynamicOverlayChange(this._componentType, componentType)
        this._componentType = componentType
        return this
    }

    content(content?: NbOverlayContent) {
        this.changes.content = new NbDynamicOverlayChange(this._content, content)
        this._content = content
        return this
    }

    context(context: object) {
        this.changes.context = new NbDynamicOverlayChange(this._context, context)
        this._context = context
        return this
    }

    offset(offset: number) {
        this.changes.offset = new NbDynamicOverlayChange(this._offset, offset)
        this._offset = offset
        return this
    }

    overlayConfig(overlayConfig: NbOverlayConfig) {
        this.changes.overlayConfig = new NbDynamicOverlayChange(this._overlayConfig, overlayConfig)
        this._overlayConfig = overlayConfig
        return this
    }

    build() {
        const componentType = this._componentType
        if (!componentType || !this._host) {
            throw Error(`NbDynamicOverlayHandler: at least 'componentType' and 'host' should be
      passed before building a dynamic overlay.`)
        }
        this.dynamicOverlay = this.dynamicOverlayService.create(
            componentType,
            this._content,
            this._context,
            this.createPositionStrategy(),
            this._overlayConfig,
            this._disabled
        )

        this.connect()
        this.clearChanges()

        return this.dynamicOverlay
    }

    rebuild() {
    // Directives call it from lifecycle hooks that may run before build(), so nothing to rebuild is no error.
        if (!this.dynamicOverlay) {
            return undefined
        }

        if (this.isPositionStrategyUpdateRequired()) {
            this.dynamicOverlay.setPositionStrategy(this.createPositionStrategy())
        }

        if (this.isTriggerStrategyUpdateRequired()) {
            this.connect()
        }

        if (this.isContainerRerenderRequired()) {
            this.dynamicOverlay.setContentAndContext(this._content, this._context)
        }

        if (this.isComponentTypeUpdateRequired() && this._componentType) {
            this.dynamicOverlay.setComponent(this._componentType)
        }

        if (this.isOverlayConfigUpdateRequired()) {
            this.dynamicOverlay.setOverlayConfig(this._overlayConfig)
        }

        if (this.isDisabledUpdated()) {
            this.dynamicOverlay.setDisabled(this._disabled)
        }

        this.clearChanges()
        return this.dynamicOverlay
    }

    connect() {
        if (!this.dynamicOverlay) {
            throw new Error(`NbDynamicOverlayHandler: cannot connect to DynamicOverlay
      as it is not created yet. Call build() first`)
        }
        this.disconnect()
        this.subscribeOnTriggers(this.dynamicOverlay)
        this.subscribeOnDirectionChange()
    }

    disconnect() {
        if (this.triggerStrategy) {
            this.triggerStrategy.destroy()
        }
        this.escapeSubscription?.unsubscribe()
        this.escapeEntry?.remove()
        this.escapeEntry = undefined
    }

    destroy() {
        this.destroy$.next()
        this.destroy$.complete()

        this.disconnect()
        this.clearChanges()
        if (this.dynamicOverlay) {
            this.dynamicOverlay.dispose()
        }
    }

    protected createPositionStrategy() {
        return this.positionBuilder
            .connectedTo(this.requireHost())
            .position(this._position)
            .adjustment(this._adjustment)
            .offset(this._offset)
            .direction(this.directionService.getDirection())
    }

    protected subscribeOnTriggers(dynamicOverlay: NbDynamicOverlay) {
        this.triggerStrategy = this.triggerStrategyBuilder
            .trigger(this._trigger)
            .host(this.requireHost().nativeElement)
            .container(() => dynamicOverlay.getContainer())
            .build()

        this.triggerStrategy.show$.subscribe(() => dynamicOverlay.show())
        this.triggerStrategy.hide$.subscribe(() => dynamicOverlay.hide())

        // While it's shown, it's the first to close on Escape, unless something opened after it, e.g. a popover from it.
        const escapeStack = this.escapeStack
        if (this.triggerStrategy.closesOnEscape && escapeStack) {
            const host = this.requireHost().nativeElement
            this.escapeSubscription = dynamicOverlay.isShown.subscribe((shown) => {
                this.escapeEntry?.remove()
                this.escapeEntry = shown
                    ? escapeStack.add(() => {
                        // Focus in the container goes back to the host.
                        if (dynamicOverlay.getContainer()?.location.nativeElement.contains(host.ownerDocument.activeElement)) {
                            host.focus()
                        }
                        dynamicOverlay.hide()
                    })
                    : undefined
            })
        }
    }

    protected subscribeOnDirectionChange() {
        this.directionService
            .onDirectionChange()
            .pipe(skip(1), takeUntil(this.destroy$))
            .subscribe(() => {
                this.dynamicOverlay?.setPositionStrategy(this.createPositionStrategy())
            })
    }

    protected requireHost(): ElementRef {
        if (!this._host) {
            throw Error('NbDynamicOverlayHandler: \'host\' should be passed before building a dynamic overlay.')
        }
        return this._host
    }

    protected isContainerRerenderRequired() {
        return this.isContentUpdated() || this.isContextUpdated() || this.isPositionStrategyUpdateRequired()
    }

    protected isPositionStrategyUpdateRequired(): boolean {
        return this.isAdjustmentUpdated() || this.isPositionUpdated() || this.isOffsetUpdated() || this.isHostUpdated()
    }

    protected isTriggerStrategyUpdateRequired(): boolean {
        return this.isTriggerUpdated() || this.isHostUpdated()
    }

    protected isComponentTypeUpdateRequired(): boolean {
        return this.isComponentTypeUpdated()
    }

    private isOverlayConfigUpdateRequired(): boolean {
        return this.isOverlayConfigUpdated()
    }

    protected isComponentTypeUpdated(): boolean {
        return !!this.changes.componentType?.isChanged()
    }

    protected isContentUpdated(): boolean {
        return !!this.changes.content?.isChanged()
    }

    protected isContextUpdated(): boolean {
        return !!this.changes.context?.isChanged()
    }

    protected isAdjustmentUpdated(): boolean {
        return !!this.changes.adjustment?.isChanged()
    }

    protected isPositionUpdated(): boolean {
        return !!this.changes.position?.isChanged()
    }

    protected isHostUpdated(): boolean {
        return !!this.changes.host?.isChanged()
    }

    protected isTriggerUpdated(): boolean {
        return !!this.changes.trigger?.isChanged()
    }

    protected isOffsetUpdated(): boolean {
        return !!this.changes.offset?.isChanged()
    }

    protected isOverlayConfigUpdated(): boolean {
        return !!this.changes.overlayConfig?.isChanged()
    }

    protected isDisabledUpdated(): boolean {
        return !!this.changes.disabled?.isChanged()
    }

    protected clearChanges() {
        this.changes = {}
    }
}

/**
 * Creates a handler with its own dynamic overlay. Overlay directives call it while they are constructed, so the
 * overlay picks up the injector of the module that declares them. Declaring the handler in the directives'
 * `providers` instead would make a popover, tooltip and context menu on the same element share one overlay.
 */
export function nbCreateDynamicOverlayHandler(): NbDynamicOverlayHandler {
    const overlay = new NbDynamicOverlay(inject(NbOverlayService), inject(NbOverlayContainer), inject(Injector))
    return new NbDynamicOverlayHandler(
        inject(NbPositionBuilderService),
        inject(NbTriggerStrategyBuilderService),
        overlay,
        inject(NbLayoutDirectionService),
        inject(NbEscapeStack)
    )
}
