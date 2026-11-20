import { InjectionToken } from '@angular/core';

import type { NbRadioGroupComponent } from './radio-group.component';

/**
 * The radio group a radio belongs to. Radios read the group's name, value, disabled state, status and size from it.
 */
export const NB_RADIO_GROUP = new InjectionToken<NbRadioGroupComponent>('NB_RADIO_GROUP');
