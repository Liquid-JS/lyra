import { Component, computed, effect, inject, input, linkedSignal, output, untracked } from '@angular/core';

import { injectNbDefaults } from '@liquid-js/lyr-core/base';
import { NbStatusService } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { ɵfocusOnClick as focusOnClick } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NB_RADIO_GROUP } from './radio-group-token';

/**
 * A radio button, styled like the design system's; a native `<input type="radio">` underneath.
 *
 * @stacked-example(Showcase, radio/radio-showcase.component)
 *
 * ### Installation
 *
 * Import `NbRadioGroupComponent`, `NbRadioComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbRadioGroupComponent, NbRadioComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbRadioModule` to your feature module.
 *
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbRadioModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * ### Usage
 *
 * Radios go in an `nb-radio-group`, which holds the value and binds to forms:
 *
 * ```html
 * <nb-radio-group [(ngModel)]="selectedOption">
 *   <nb-radio value="1">Option 1</nb-radio>
 *   <nb-radio value="2">Option 2</nb-radio>
 *   <nb-radio value="3">Option 3</nb-radio>
 * </nb-radio-group>
 * ```
 *
 * `disabled` disables single radios in a group:
 *
 * @stacked-example(Disabled, radio/radio-disabled.component)
 *
 * @styles
 *
 * radio-tiny-width:
 * radio-tiny-height:
 * radio-small-width:
 * radio-small-height:
 * radio-medium-width:
 * radio-medium-height:
 * radio-label-padding:
 * radio-large-width:
 * radio-large-height:
 * radio-giant-width:
 * radio-giant-height:
 * radio-border-style:
 * radio-border-width:
 * radio-text-font-family:
 * radio-text-padding:
 * radio-tiny-text-font-size:
 * radio-tiny-text-font-weight:
 * radio-tiny-text-line-height:
 * radio-small-text-font-size:
 * radio-small-text-font-weight:
 * radio-small-text-line-height:
 * radio-medium-text-font-size:
 * radio-medium-text-font-weight:
 * radio-medium-text-line-height:
 * radio-large-text-font-size:
 * radio-large-text-font-weight:
 * radio-large-text-line-height:
 * radio-giant-text-font-size:
 * radio-giant-text-font-weight:
 * radio-giant-text-line-height:
 * radio-outline-color:
 * radio-outline-width:
 * radio-basic-text-color:
 * radio-basic-border-color:
 * radio-basic-background-color:
 * radio-basic-checked-background-color:
 * radio-basic-checked-border-color:
 * radio-basic-inner-circle-color:
 * radio-basic-focus-border-color:
 * radio-basic-focus-inner-circle-color:
 * radio-basic-focus-background-color:
 * radio-basic-focus-checked-background-color:
 * radio-basic-focus-checked-border-color:
 * radio-basic-hover-background-color:
 * radio-basic-hover-border-color:
 * radio-basic-hover-inner-circle-color:
 * radio-basic-hover-checked-background-color:
 * radio-basic-hover-checked-border-color:
 * radio-basic-active-border-color:
 * radio-basic-active-inner-circle-color:
 * radio-basic-active-background-color:
 * radio-basic-active-checked-background-color:
 * radio-basic-active-checked-border-color:
 * radio-basic-disabled-background-color:
 * radio-basic-disabled-border-color:
 * radio-basic-disabled-text-color:
 * radio-basic-disabled-checked-background-color:
 * radio-basic-disabled-checked-border-color:
 * radio-basic-disabled-checked-inner-circle-color:
 * radio-primary-text-color:
 * radio-primary-border-color:
 * radio-primary-background-color:
 * radio-primary-checked-background-color:
 * radio-primary-checked-border-color:
 * radio-primary-inner-circle-color:
 * radio-primary-focus-border-color:
 * radio-primary-focus-inner-circle-color:
 * radio-primary-focus-background-color:
 * radio-primary-focus-checked-background-color:
 * radio-primary-focus-checked-border-color:
 * radio-primary-hover-background-color:
 * radio-primary-hover-border-color:
 * radio-primary-hover-inner-circle-color:
 * radio-primary-hover-checked-background-color:
 * radio-primary-hover-checked-border-color:
 * radio-primary-active-border-color:
 * radio-primary-active-inner-circle-color:
 * radio-primary-active-background-color:
 * radio-primary-active-checked-background-color:
 * radio-primary-active-checked-border-color:
 * radio-primary-disabled-background-color:
 * radio-primary-disabled-border-color:
 * radio-primary-disabled-text-color:
 * radio-primary-disabled-checked-background-color:
 * radio-primary-disabled-checked-border-color:
 * radio-primary-disabled-checked-inner-circle-color:
 * radio-success-text-color:
 * radio-success-border-color:
 * radio-success-background-color:
 * radio-success-checked-background-color:
 * radio-success-checked-border-color:
 * radio-success-inner-circle-color:
 * radio-success-focus-border-color:
 * radio-success-focus-inner-circle-color:
 * radio-success-focus-background-color:
 * radio-success-focus-checked-background-color:
 * radio-success-focus-checked-border-color:
 * radio-success-hover-background-color:
 * radio-success-hover-border-color:
 * radio-success-hover-inner-circle-color:
 * radio-success-hover-checked-background-color:
 * radio-success-hover-checked-border-color:
 * radio-success-active-border-color:
 * radio-success-active-inner-circle-color:
 * radio-success-active-background-color:
 * radio-success-active-checked-background-color:
 * radio-success-active-checked-border-color:
 * radio-success-disabled-background-color:
 * radio-success-disabled-border-color:
 * radio-success-disabled-text-color:
 * radio-success-disabled-checked-background-color:
 * radio-success-disabled-checked-border-color:
 * radio-success-disabled-checked-inner-circle-color:
 * radio-info-text-color:
 * radio-info-border-color:
 * radio-label-end-padding:
 * radio-info-background-color:
 * radio-info-checked-background-color:
 * radio-info-checked-border-color:
 * radio-info-inner-circle-color:
 * radio-info-focus-border-color:
 * radio-info-focus-inner-circle-color:
 * radio-info-focus-background-color:
 * radio-info-focus-checked-background-color:
 * radio-info-focus-checked-border-color:
 * radio-info-hover-background-color:
 * radio-info-hover-border-color:
 * radio-info-hover-inner-circle-color:
 * radio-info-hover-checked-background-color:
 * radio-info-hover-checked-border-color:
 * radio-info-active-border-color:
 * radio-info-active-inner-circle-color:
 * radio-info-active-background-color:
 * radio-info-active-checked-background-color:
 * radio-info-active-checked-border-color:
 * radio-info-disabled-background-color:
 * radio-info-disabled-border-color:
 * radio-info-disabled-text-color:
 * radio-info-disabled-checked-background-color:
 * radio-info-disabled-checked-border-color:
 * radio-info-disabled-checked-inner-circle-color:
 * radio-warning-text-color:
 * radio-warning-border-color:
 * radio-warning-background-color:
 * radio-warning-checked-background-color:
 * radio-warning-checked-border-color:
 * radio-warning-inner-circle-color:
 * radio-warning-focus-border-color:
 * radio-warning-focus-inner-circle-color:
 * radio-warning-focus-background-color:
 * radio-warning-focus-checked-background-color:
 * radio-warning-focus-checked-border-color:
 * radio-warning-hover-background-color:
 * radio-warning-hover-border-color:
 * radio-warning-hover-inner-circle-color:
 * radio-warning-hover-checked-background-color:
 * radio-warning-hover-checked-border-color:
 * radio-warning-active-border-color:
 * radio-warning-active-inner-circle-color:
 * radio-warning-active-background-color:
 * radio-warning-active-checked-background-color:
 * radio-warning-active-checked-border-color:
 * radio-warning-disabled-background-color:
 * radio-warning-disabled-border-color:
 * radio-warning-disabled-text-color:
 * radio-warning-disabled-checked-background-color:
 * radio-warning-disabled-checked-border-color:
 * radio-warning-disabled-checked-inner-circle-color:
 * radio-danger-text-color:
 * radio-danger-border-color:
 * radio-danger-background-color:
 * radio-danger-checked-background-color:
 * radio-danger-checked-border-color:
 * radio-danger-inner-circle-color:
 * radio-danger-focus-border-color:
 * radio-danger-focus-inner-circle-color:
 * radio-danger-focus-background-color:
 * radio-danger-focus-checked-background-color:
 * radio-danger-focus-checked-border-color:
 * radio-danger-hover-background-color:
 * radio-danger-hover-border-color:
 * radio-danger-hover-inner-circle-color:
 * radio-danger-hover-checked-background-color:
 * radio-danger-hover-checked-border-color:
 * radio-danger-active-border-color:
 * radio-danger-active-inner-circle-color:
 * radio-danger-active-background-color:
 * radio-danger-active-checked-background-color:
 * radio-danger-active-checked-border-color:
 * radio-danger-disabled-background-color:
 * radio-danger-disabled-border-color:
 * radio-danger-disabled-text-color:
 * radio-danger-disabled-checked-background-color:
 * radio-danger-disabled-checked-border-color:
 * radio-danger-disabled-checked-inner-circle-color:
 * radio-control-text-color:
 * radio-control-background-color:
 * radio-control-border-color:
 * radio-control-checked-background-color:
 * radio-control-checked-border-color:
 * radio-control-inner-circle-color:
 * radio-control-focus-border-color:
 * radio-control-focus-inner-circle-color:
 * radio-control-focus-background-color:
 * radio-control-focus-checked-background-color:
 * radio-control-focus-checked-border-color:
 * radio-control-hover-background-color:
 * radio-control-hover-border-color:
 * radio-control-hover-inner-circle-color:
 * radio-control-hover-checked-background-color:
 * radio-control-hover-checked-border-color:
 * radio-control-active-border-color:
 * radio-control-active-inner-circle-color:
 * radio-control-active-background-color:
 * radio-control-active-checked-background-color:
 * radio-control-active-checked-border-color:
 * radio-control-disabled-background-color:
 * radio-control-disabled-border-color:
 * radio-control-disabled-text-color:
 * radio-control-disabled-checked-background-color:
 * radio-control-disabled-checked-border-color:
 * radio-control-disabled-checked-inner-circle-color:
 * */
@Component({
  selector: 'nb-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NbRadioComponent<T = unknown> {
  // The app's defaults for this type, which the inputs below start from.
  protected readonly nbDefaults = injectNbDefaults('radio');

  protected readonly focusOnClick = focusOnClick;
  protected readonly statusService = inject(NbStatusService);
  protected readonly group = inject(NB_RADIO_GROUP, { optional: true });

  /** The native input's name; inside `nb-radio-group`, the group's name is used. */
  readonly name = input<string>();

  /**
   * Whether the radio is checked. Inside `nb-radio-group`, the group's value decides; a checked radio sets the
   * group's value when the group has none.
   */
  readonly checked = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /** The value the group takes when the radio is checked. */
  readonly value = input<T>();

  /** Disables the radio. Inside `nb-radio-group`, the group's `disabled` takes precedence once it's set. */
  readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /** `basic` (default), `primary`, `success`, `warning`, `danger`, `info` or `control`; in a group, the group's. */
  readonly status = input<NbComponentOrCustomStatus>('basic');

  /** `tiny`, `small`, `medium` (default), `large` or `giant`; in a group, the group's. */
  readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' });
  /** The size in use: the input's, the app's default, or 'medium'. */
  readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium');

  /**
   * Emits whether the radio is checked as that changes, as a checkbox's `checkedChange` does: when the user checks it,
   * and when checking another radio of its group unchecks it. For the value, listen to the group's `valueChange`.
   */
  readonly checkedChange = output<boolean>();

  protected readonly checkedState = linkedSignal(() => this.checked());

  // The state the radio renders with: its own, or its group's.
  readonly isChecked = computed(() => (this.group ? this.group.selectedValue() === this.value() : this.checkedState()));
  readonly resolvedName = computed(() => (this.group ? this.group.resolvedName() : this.name()));
  readonly isDisabled = computed(() => this.group?.isDisabled() ?? this.disabled());
  readonly resolvedStatus = computed(() => (this.group ? this.group.resolvedStatus() : this.status()));
  readonly resolvedSize = computed(() => (this.group ? this.group.size() : this.size()));

  protected readonly hostClasses = computed(() => [
    this.statusService.getStatusClass(this.resolvedStatus()),
    `size-${this.resolvedSize()}`,
  ]);

  constructor() {
    // Changes other than the `checked` input's, so `[(checked)]` follows the group too.
    let last: boolean | undefined;
    effect(() => {
      const checked = this.isChecked();
      untracked(() => {
        if (last !== undefined && checked !== last && checked !== this.checked()) {
          this.checkedChange.emit(checked);
        }
        last = checked;
      });
    });
  }

  onChange(event: Event) {
    event.stopPropagation();
    this.checkedState.set(true);
    this.group?.select(this.value());
  }

  onClick(event: Event) {
    event.stopPropagation();
  }
}
