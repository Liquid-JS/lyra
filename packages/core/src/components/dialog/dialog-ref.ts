import { ComponentRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { disposeAfterBackdrop, NbOverlayRef } from '@liquid-js/lyr-core/cdk';
import { animateDialog } from './dialog-animation';

/**
 * A dialog `NbDialogService.open` opened: `close` closes it with a result, which `onClose` emits, `componentRef` is
 * the rendered component, as with `NbWindowRef`, and `onBackdropClick` the clicks on its backdrop. The dialog's
 * component can inject it.
 */
export class NbDialogRef<T, R = unknown> {

  /**
   * The rendered component, for a dialog opened with a component (not a template).
   */
  componentRef?: ComponentRef<T>;

  /**
   * Emits the clicks on the backdrop, whether or not they close the dialog.
   */
  readonly onBackdropClick: Observable<MouseEvent>;
  protected onClose$ = new Subject<R | undefined>();
  /**
   * Emits the result the dialog closes with: `undefined` when it's closed without one, e.g. by its backdrop.
   */
  readonly onClose: Observable<R | undefined> = this.onClose$.asObservable();

  constructor(protected overlayRef: NbOverlayRef) {
    this.onBackdropClick = this.overlayRef.backdropClick();
  }

  protected closing = false;

  /**
   * Closes the dialog: it fades out, then it's removed and `onClose` emits `res`. Closing it again meanwhile does
   * nothing.
   */
  close(res?: R) {
    if (this.closing) {
      return;
    }
    this.closing = true;
    // The backdrop fades out along with the pane, and the overlay goes once both have.
    this.overlayRef.detachBackdrop();
    void animateDialog(this.overlayRef.overlayElement, false).then(() => {
      this.overlayRef.detach();
      disposeAfterBackdrop(this.overlayRef);
      this.onClose$.next(res);
      this.onClose$.complete();
    });
  }
}
