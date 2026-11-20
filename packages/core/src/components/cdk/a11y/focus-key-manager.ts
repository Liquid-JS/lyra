import { Injector, isSignal, QueryList, Signal, Service } from '@angular/core'
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y'

export type NbFocusableOption = FocusableOption
export class NbFocusKeyManager<T> extends FocusKeyManager<T> {}

@Service()
export class NbFocusKeyManagerFactoryService<T extends NbFocusableOption> {
    /**
     * Creates a key manager over the items; a signal of items, such as a signal query, needs an injector.
     */
    create(items: QueryList<T> | T[]): NbFocusKeyManager<T>
    create(items: QueryList<T> | T[] | Signal<ReadonlyArray<T>>, injector: Injector): NbFocusKeyManager<T>
    create(
        ...args: [items: QueryList<T> | T[]] | [items: QueryList<T> | T[] | Signal<ReadonlyArray<T>>, injector: Injector]
    ): NbFocusKeyManager<T> {
        if (args.length === 1) {
            return new NbFocusKeyManager<T>(args[0])
        }
        const [items, injector] = args
        return isSignal(items) ? new NbFocusKeyManager<T>(items, injector) : new NbFocusKeyManager<T>(items)
    }
}
