import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { Injector, isSignal, QueryList, Signal, Service } from '@angular/core';

export type NbHighlightableOption = Highlightable;
export class NbActiveDescendantKeyManager<T> extends ActiveDescendantKeyManager<T> {}

@Service()
export class NbActiveDescendantKeyManagerFactoryService<T extends NbHighlightableOption> {
  /**
   * Creates a key manager over the items; a signal of items, such as a signal query, needs an injector.
   */
  create(items: QueryList<T> | T[]): NbActiveDescendantKeyManager<T>;
  create(items: QueryList<T> | T[] | Signal<readonly T[]>, injector: Injector): NbActiveDescendantKeyManager<T>;
  create(
    ...args: [items: QueryList<T> | T[]] | [items: QueryList<T> | T[] | Signal<readonly T[]>, injector: Injector]
  ): NbActiveDescendantKeyManager<T> {
    if (args.length === 1) {
      return new NbActiveDescendantKeyManager<T>(args[0]);
    }
    const [items, injector] = args;
    return isSignal(items)
      ? new NbActiveDescendantKeyManager<T>(items, injector)
      : new NbActiveDescendantKeyManager<T>(items);
  }
}

export enum NbKeyManagerActiveItemMode {
  RESET_ACTIVE = -1,
  FIRST_ACTIVE = 0,
}
