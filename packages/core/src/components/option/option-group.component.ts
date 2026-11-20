import { Component, computed, ElementRef, inject, input, Signal, signal } from '@angular/core';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

let lastOptionGroupId = 0;

/**
 * Groups the options of a select or autocomplete under a `title`; a `disabled` group disables its options. The group
 * hides while a search leaves out all its options.
 *
 * @styles
 *
 * option-group-text-color:
 * option-group-text-font-weight:
 * option-group-tiny-start-padding:
 * option-group-small-start-padding:
 * option-group-medium-start-padding:
 * option-group-large-start-padding:
 * option-group-giant-start-padding:
 **/
@Component({
  selector: 'nb-option-group',
  styleUrls: ['./option-group.component.scss'],
  templateUrl: './option-group.component.html',
  host: {
    role: 'group',
    // Hidden when a select's search leaves out all its options.
    '[class.filtered]': 'allFiltered()',
    '[attr.aria-labelledby]': 'titleId',
    '[attr.disabled]': "disabled() ? '' : null",
  },
})
export class NbOptionGroupComponent {
  protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly titleId = `nb-option-group-title-${lastOptionGroupId++}`;

  readonly title = input<string>();

  /**
   * Disables the options in the group.
   */
  readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  // Options register themselves; importing them here would be circular.
  protected readonly options = signal(new Array<{ filtered: Signal<boolean> }>());
  protected readonly allFiltered = computed(() => {
    const options = this.options();
    return options.length > 0 && options.every((option) => option.filtered());
  });

  addOption(option: { filtered: Signal<boolean> }) {
    this.options.update((options) => [...options, option]);
  }

  removeOption(option: { filtered: Signal<boolean> }) {
    this.options.update((options) => options.filter((existing) => existing !== option));
  }

  /**
   * Set by its select: whether nothing in the group is in view, e.g. the list is drilled into a nested option outside
   * it, which hides it; or whether the list is drilled into a nested option in it, which hides only its title.
   */
  setNestedView(collapsed: boolean, drilledInto: boolean) {
    const host = this.elementRef.nativeElement;
    host.classList.toggle('nb-option-collapsed', collapsed);
    host.querySelector(`#${this.titleId}`)?.classList.toggle('nb-option-collapsed', drilledInto);
    host.setAttribute('role', drilledInto ? 'none' : 'group');
  }
}
