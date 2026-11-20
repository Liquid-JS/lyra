import { NbToastrConfig } from './toastr-config';
import type { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import type { NbButtonAppearance } from '@liquid-js/lyr-core/base';
import type { NbToastRef } from './toastr.service';

/**
 * A button in a toast, e.g. to undo what the toast tells about.
 */
export interface NbToastAction {
  /** Text of the button. */
  text: string;
  /**
   * Runs when the button is clicked, with the toast. The toast closes after it; if it returns a promise, the button is
   * loading and the toast stays until it completes, and stays open if it fails, with the error going to Angular's
   * `ErrorHandler`.
   */
  action?: (toast: NbToastRef) => unknown;
  /** Whether the toast closes after the action; `true` by default. */
  close?: boolean;
  /** Status of the button: by default `control` in a toast of a color, `primary` in a `basic` or `control` toast. */
  status?: NbComponentOrCustomStatus;
  /** Appearance of the button; `ghost` by default. */
  appearance?: NbButtonAppearance;
}

export interface NbToast {
  title?: string;
  message: string;
  config: NbToastrConfig;
}
