import { Signal, Service } from '@angular/core';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';

/**
 * Provided by a control that an `nb-form-field` can hold, such as `nbInput` or `nb-select`, with the state the field
 * renders its size and addons by: `{ provide: NbFormFieldControl, useExisting: MyControl }`.
 */
@Service({ autoProvided: false })
export abstract class NbFormFieldControl {
  /**
   * The control's state, which the form field renders its size and addons with.
   */
  abstract readonly controlState: Signal<NbFormControlState>;
}

/**
 * Provided next to `NbFormFieldControl` by a control that doesn't take a prefix or a suffix, e.g. `nb-select`, whose
 * arrow is at its end.
 */
@Service({ autoProvided: false })
export class NbFormFieldControlConfig {
  supportsPrefix = true;
  supportsSuffix = true;
}

export interface NbFormControlState {
  status: NbComponentOrCustomStatus;
  size: NbComponentSize;
  fullWidth: boolean;
  focused: boolean;
  disabled: boolean;
}
