import {
  Component,
  contentChildren,
  ElementRef,
  input,
  linkedSignal,
  output,
  Signal,
  signal,
  viewChild,
} from '@angular/core';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, ɵNbClassInput as NbClassInput } from '@liquid-js/lyr-core/base';
import { injectNbDefaults, NbComponentSize } from '@liquid-js/lyr-core/base';
import { NbPosition } from '@liquid-js/lyr-core/cdk';
import { NbOptionComponent } from '../option/option.component';
import { NbOptionListComponent } from '../option/option-list.component';
import { NbOptionGroupComponent } from '../option/option-group.component';
import { NbPortalDirective } from '@liquid-js/lyr-core/cdk';

// Component class scoped counter for aria attributes.
let lastAutocompleteId = 0;

/**
 * The options of an `input[nbAutocomplete]`, which the directive shows in an overlay below the input.
 */
@Component({
  selector: 'nb-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  imports: [NbPortalDirective, NbOptionListComponent],
  host: {
    '[class]': "'size-' + size()",
  },
})
export class NbAutocompleteComponent<T> {
  /**
   * The element the options are positioned at, which `NbAutocompleteDirective` sets when they first open.
   */
  hostRef?: ElementRef<HTMLElement>;

  /**
   * Id of the listbox, which the input's `aria-controls` points to while the options are open.
   */
  readonly id: string = `nb-autocomplete-${lastAutocompleteId++}`;

  /**
   * Current overlay position, which `NbAutocompleteDirective` sets and the options list renders with.
   */
  readonly overlayPosition = signal<NbPosition>('' as NbPosition);

  /**
   * The width of the element the options are positioned at, which the options take unless `optionsWidth` is set.
   */
  get hostWidth(): number {
    return this.hostRef?.nativeElement.getBoundingClientRect().width ?? 0;
  }

  /**
   * Turns a value into the text shown in the input, e.g. an object's name. It's given the text typed in the input
   * too.
   */
  readonly handleDisplayFn = input<(value: T | string) => string>();

  protected readonly nbDefaults = injectNbDefaults('input');

  // The size of the field it's attached to, which `NbAutocompleteDirective` gives it.
  protected readonly fieldSize = signal<Signal<NbComponentSize> | undefined>(undefined);

  /**
   * The size of the options: `tiny`, `small`, `medium`, `large` or `giant`. Unset, they match the field the
   * autocomplete is attached to, as a select's options match the select.
   */
  readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' });
  /** The size in use: the input's, the field's, the app's default for fields, or 'medium'. */
  readonly size = linkedSignal<NbComponentSize>(
    () => this.sizeInput() ?? this.fieldSize()?.() ?? this.nbDefaults().size ?? 'medium',
  );

  /**
   * Makes the first option active whenever the options open or change, so Enter selects it at once.
   */
  readonly activeFirst = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Class of the `nb-option-list` holding the options.
   */
  readonly optionsListClass = input<NbClassInput>();

  /**
   * Class of the overlay panel around the options list.
   */
  readonly optionsPanelClass = input<string | string[]>();

  /**
   * Width of the options list, in pixels; the input's width by default.
   */
  readonly optionsWidth = input<number>();

  /**
   * Emits the value of an option chosen with a click or Enter, and a value the form control writes.
   */
  readonly selectedChange = output<T | undefined>();

  /**
   * The options in the content, inside groups or not.
   */
  readonly options = contentChildren<NbOptionComponent<T>>(NbOptionComponent, { descendants: true });

  readonly optionGroups = contentChildren(NbOptionGroupComponent, { descendants: true });

  /**
   * The portal with the options list, which the directive attaches to its overlay.
   */
  readonly portal = viewChild(NbPortalDirective);

  readonly list = viewChild(NbOptionListComponent);

  /**
   * Called by `NbAutocompleteDirective` when the options first open, with the element they are positioned at, for
   * their width, and the size of the field they match.
   */
  setHost(hostRef: ElementRef<HTMLElement>, fieldSize?: Signal<NbComponentSize>) {
    this.hostRef = hostRef;
    this.fieldSize.set(fieldSize);
  }

  emitSelected(selected?: T) {
    this.selectedChange.emit(selected);
  }
}
