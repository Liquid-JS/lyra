import { InjectionToken, Signal } from '@angular/core'

import { NbComponentSize } from '@liquid-js/lyr-core/base'

/**
 * The size of the tags in a tag list, which tags placed in it take unless they set their own.
 */
export const NB_TAG_LIST_SIZE = new InjectionToken<Signal<NbComponentSize>>('NB_TAG_LIST_SIZE')
