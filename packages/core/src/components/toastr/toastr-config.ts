import { InjectionToken } from '@angular/core';

import { NbGlobalLogicalPosition, NbGlobalPosition } from '@liquid-js/lyr-core/cdk';
import { NbComponentOrCustomStatus, NbComponentStatus } from '@liquid-js/lyr-core/base';
import { NbIconConfig } from '@liquid-js/lyr-core/icon';
import type { NbToastAction } from './model';

/** Each status's icon, from the `essentials` pack, written out whole so `scripts/essential-icons.ts` adds it. */
type StatusIcons = {
  [status in NbComponentStatus]: NbIconConfig;
};

export const NB_TOASTR_CONFIG = new InjectionToken<NbToastrConfig>('Default toastr options');

export type NbDuplicateToastBehaviour = 'previous' | 'all';

/**
 * A toast's options: the app's defaults from `provideNbToastr()`, which `NbToastrService.show` takes overrides of.
 */
export class NbToastrConfig {
  /**
   * Where on the screen the toast appears.
   */
  position: NbGlobalPosition = NbGlobalLogicalPosition.TOP_END;
  /**
   * The colour and icon of the toast. A `danger` or `warning` toast is announced as an alert, the others politely.
   */
  status: NbComponentOrCustomStatus = 'basic';
  /**
   * How long the toast stays, in ms. `0` keeps it until it's closed by a click, the close button or an action.
   */
  duration = 3000;
  /**
   * A click on the toast closes it.
   */
  destroyByClick = true;
  /**
   * Renders a close button in the top-end corner of the toast that destroys it.
   * */
  closeButton = false;
  /**
   * Accessible label of the close button; the `toastr` text of `NbTextsService` by default.
   * */
  closeButtonLabel?: string;
  /**
   * Buttons shown under the message, e.g. to undo what the toast tells about. While the focus is in a toast, or an
   * action runs, its auto-dismiss timer is paused; the full duration starts again after.
   * */
  actions = new Array<NbToastAction>();
  /**
   * Pauses the auto-dismiss timer while the pointer is over the toast.
   * The full duration starts again once the pointer leaves.
   * */
  pauseOnHover = false;
  /**
   * Drops a toast with the same title, message and status as the one `duplicatesBehaviour` compares it with;
   * `show` then returns `undefined`.
   */
  preventDuplicates = false;
  /**
   * What `preventDuplicates` compares a toast with: the previous toast, or all the visible ones.
   */
  duplicatesBehaviour: NbDuplicateToastBehaviour = 'previous';
  /**
   * How many toasts a position shows at once; the oldest goes when a new one exceeds it. Unlimited by default.
   */
  limit?: number;
  /**
   * A class added to the toast's element.
   */
  toastClass = '';
  /**
   * Has no effect at present: the toast shows its `icon` whenever there is one, and `icon: ''` leaves it out.
   */
  hasIcon = true;
  /**
   * A custom icon, by name or config. By default the status's icon, from `statusIcons` or the built-in ones; `''`
   * for none.
   */
  icon: string | NbIconConfig = 'email';
  /**
   * Replaces the built-in status icons for the statuses it lists, unless a toast sets its own `icon`.
   * */
  statusIcons: Partial<Record<NbComponentStatus, string | NbIconConfig>> = {};
  /**
   * The built-in icon of each status.
   */
  protected icons: StatusIcons = {
    danger: { icon: 'flash-outline', pack: 'essentials' },
    success: { icon: 'checkmark-outline', pack: 'essentials' },
    info: { icon: 'question-mark-outline', pack: 'essentials' },
    warning: { icon: 'alert-triangle-outline', pack: 'essentials' },
    primary: { icon: 'email-outline', pack: 'essentials' },
    control: { icon: 'email-outline', pack: 'essentials' },
    basic: { icon: 'email-outline', pack: 'essentials' },
  };

  constructor(config: Partial<NbToastrConfig>) {
    this.patchIcon(config);
    Object.assign(this, config);
  }

  protected patchIcon(config: Partial<NbToastrConfig>) {
    if (!('icon' in config)) {
      // A custom status has no icon of its own.
      const status = config.status ?? 'basic';
      const statusIcons: Partial<Record<string, string | NbIconConfig>> | undefined = config.statusIcons;
      const icons: Partial<Record<string, NbIconConfig>> = this.icons;
      config.icon = statusIcons?.[status] ?? { ...(icons[status] ?? this.icons.basic) };
    }
  }
}
