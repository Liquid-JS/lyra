import {
    ChangeDetectorRef,
    ComponentRef,
    Injector,
    InputSignalWithTransform,
    isSignal,
    isWritableSignal,
    reflectComponentType,
    Signal,
    signal,
    TemplateRef,
    Type,
    inject,
    Service
} from '@angular/core'

import { NbLayoutDirectionService } from '@liquid-js/lyr-core/base'
import { NbScrollStrategyOptions } from '../adapter/block-scroll-strategy-adapter'
import { NbComponentPortal, NbComponentType, NbOverlay, NbOverlayConfig, NbOverlayRef } from './mapping'

export type NbOverlayContent = Type<unknown> | TemplateRef<unknown> | string

/**
 * What `setComponentContext` accepts for a member: the write type of a signal input or model, the value of
 * another signal, or the member's own type.
 */
export type NbComponentContextValue<V> =
    V extends InputSignalWithTransform<infer _R, infer W> ? W : V extends Signal<infer S> ? S : V

/**
 * Values for the members of a dynamically created component, as written by `setComponentContext`.
 */
export type NbComponentContext<T> = { [K in keyof T]?: NbComponentContextValue<T[K]> }

const inputNames = new WeakMap<Type<unknown>, Map<string, string>>()

/**
 * Maps both the public and the property name of each input of `type` to its public name.
 */
function getInputNames(type?: Type<unknown>): Map<string, string> {
    if (!type) {
        return new Map()
    }
    let names = inputNames.get(type)
    if (!names) {
        names = new Map()
        for (const { propName, templateName } of reflectComponentType(type)?.inputs ?? []) {
            names.set(propName, templateName)
            names.set(templateName, templateName)
        }
        inputNames.set(type, names)
    }
    return names
}

/**
 * Writes `context` to the component. Inputs go through `setInput()`, so they're recorded as input changes, run
 * `ngOnChanges` and work as signal inputs. A writable signal is set, a read-only one replaced by one holding the
 * value, and other keys are assigned. The view is then marked for check.
 */
export function setComponentContext<T>(
    componentRef: ComponentRef<T>,
    context: NbComponentContext<T>
): ComponentRef<T> {
    const inputs = getInputNames(componentRef.componentType)
    const instance = componentRef.instance as Record<string, unknown>
    for (const [key, value] of Object.entries(context)) {
        const input = inputs.get(key)
        const member = instance[key]
        if (input) {
            componentRef.setInput(input, value)
        } else if (isSignal(member)) {
            if (isWritableSignal(member)) {
                member.set(value)
            } else {
                instance[key] = signal(value).asReadonly()
            }
        } else {
            instance[key] = value
        }
    }
    // The ref's own change detector is its host view; the component's view is the one to mark when it's OnPush.
    (componentRef.injector?.get(ChangeDetectorRef, null) ?? componentRef.changeDetectorRef).markForCheck()
    return componentRef
}

export function patch<T>(container: ComponentRef<T>, containerContext: NbComponentContext<T>): ComponentRef<T> {
    setComponentContext(container, containerContext)
    container.changeDetectorRef.detectChanges()
    return container
}

/**
 * Attaches `container` to the overlay. Pass the injector of the module that opens the overlay, so the container and
 * everything rendered inside it can use that module's providers; overlays are otherwise created from the root.
 */
export function createContainer<T>(
    ref: NbOverlayRef,
    container: NbComponentType<T>,
    context: NbComponentContext<T>,
    injector?: Injector
): ComponentRef<T> {
    const containerRef = ref.attach(new NbComponentPortal(container, null, injector ?? null))
    patch(containerRef, context)
    return containerRef
}

@Service()
export class NbOverlayService {
    protected readonly overlay = inject(NbOverlay)
    protected readonly layoutDirection = inject(NbLayoutDirectionService)

    get scrollStrategies(): NbScrollStrategyOptions {
        return this.overlay.scrollStrategies
    }

    create(config?: NbOverlayConfig): NbOverlayRef {
        const overlayRef = this.overlay.create(config)
        const direction = this.layoutDirection
            .onDirectionChange()
            .subscribe((dir) => overlayRef.setDirection(dir))
        // detachments() completes when the overlay is disposed; stop following the direction then, so disposed
        // overlays aren't kept alive until the next direction change.
        overlayRef.detachments().subscribe({ complete: () => direction.unsubscribe() })
        return overlayRef
    }
}
