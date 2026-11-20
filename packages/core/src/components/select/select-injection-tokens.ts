import { InjectionToken } from '@angular/core';

import type { NbSelectComponent } from './select.component';

/**
 * The select an option belongs to; `nb-select` provides it.
 */
export const NB_SELECT_INJECTION_TOKEN = new InjectionToken<NbSelectComponent>('NB_SELECT_INJECTION_TOKEN');
