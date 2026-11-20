import { ElementRef, WritableSignal } from '@angular/core';

/**
 * An `input[nbAutocomplete]`, for components that hold one, e.g. a tag list, which opens the options below itself.
 * Querying this instead of the directive keeps the autocomplete code out of an app that doesn't use one.
 */
export abstract class NbAutocompleteRef {
  /** The element the options open next to; the input by default. */
  abstract readonly overlayHost: WritableSignal<ElementRef | undefined>;
}
