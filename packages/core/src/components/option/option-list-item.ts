import { InjectionToken } from '@angular/core';

import { NbFocusableOption } from '@liquid-js/lyr-core/cdk';
import { ɵNbHighlightableOption as NbHighlightableOption } from '@liquid-js/lyr-core/cdk';

/**
 * An entry the keyboard moves through in an option list: an option, or the row of a nested option.
 */
export interface NbOptionListItem extends NbFocusableOption, NbHighlightableOption {
  readonly id: string;
  readonly disabled: boolean;
  readonly hidden: boolean;
}

/**
 * Provided by options and nested options, so a select can query both, in the order they're in.
 */
export const NB_OPTION_LIST_ITEM = new InjectionToken<NbOptionListItem>('NB_OPTION_LIST_ITEM');
