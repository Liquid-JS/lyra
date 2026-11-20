import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  ErrorHandler,
  inject,
  InjectionToken,
  input,
  Provider,
  signal,
  TemplateRef,
} from '@angular/core';
import { isObservable, lastValueFrom, Observable } from 'rxjs';

import { NbButtonComponent } from '@liquid-js/lyr-core/button';
import { NbCardBodyComponent, NbCardComponent, NbCardFooterComponent, NbCardHeaderComponent } from '@liquid-js/lyr-core/card';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbDialogRef } from './dialog-ref';
import { NbEscapeStack } from '@liquid-js/lyr-core/cdk';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

export interface NbConfirmDialogOptions {
  /**
   * The question, e.g. "Delete the invoice?".
   */
  title: string;
  /**
   * More about what confirming does: text, or a template for richer content.
   */
  message?: string | TemplateRef<void>;
  /**
   * The confirm button's text, e.g. "Delete". Defaults to the `provideNbConfirmDialog` option, "Confirm" unless set.
   */
  confirmText?: string;
  /**
   * The cancel button's text. Defaults to the `provideNbConfirmDialog` option, "Cancel" unless set.
   */
  cancelText?: string;
  /**
   * The confirm button's status, e.g. `danger` for a destructive action. Defaults to the `provideNbConfirmDialog`
   * option, `primary` unless set.
   */
  status?: NbComponentOrCustomStatus;
  /**
   * Runs when the user confirms. The dialog stays open until it completes, with the confirm button loading and the
   * dialog not dismissable; if it fails, the dialog stays open so the user can retry or cancel, and the error goes to
   * Angular's `ErrorHandler`.
   */
  action?: () => Promise<unknown> | Observable<unknown>;
}

export type NbConfirmDialogDefaults = Pick<NbConfirmDialogOptions, 'confirmText' | 'cancelText' | 'status'>;

export const NB_CONFIRM_DIALOG_DEFAULTS = new InjectionToken<NbConfirmDialogDefaults>('Lyra Confirm Dialog Defaults', {
  providedIn: 'root',
  factory: () => ({ status: 'primary' }),
});

/**
 * Sets the default status and button texts of `NbDialogService.confirm`; the texts are the `confirmDialog` texts of
 * `NbTextsService` otherwise.
 */
export function provideNbConfirmDialog(defaults: NbConfirmDialogDefaults): Provider {
  return {
    provide: NB_CONFIRM_DIALOG_DEFAULTS,
    useValue: { status: 'primary', ...defaults },
  };
}

let lastConfirmDialogId = 0;

/**
 * The dialog `NbDialogService.confirm` opens.
 */
@Component({
  selector: 'nb-confirm-dialog',
  template: `
    <nb-card appearance="floating">
      <nb-card-header [id]="titleId"><span dir="auto">{{ options().title }}</span></nb-card-header>
      @if (options().message; as message) {
        <nb-card-body [id]="messageId">
          @if (isTemplate(message)) {
            <ng-container *ngTemplateOutlet="message" />
          } @else {
            <span dir="auto">{{ message }}</span>
          }
        </nb-card-body>
      }
      <nb-card-footer class="actions">
        <button nbButton outline type="button" [disabled]="busy()" (click)="cancel()">{{ cancelText() }}</button>
        <button nbButton type="button" [status]="status()" [loading]="busy()" (click)="confirm()">
          {{ confirmText() }}
        </button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: `
    :host {
      display: block;
      max-width: 32rem;
    }

    nb-card {
      margin: 0;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `,
  imports: [
    NgTemplateOutlet,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbButtonComponent,
  ],
})
export class NbConfirmDialogComponent {
  protected readonly dialogRef = inject<NbDialogRef<NbConfirmDialogComponent>>(NbDialogRef);
  protected readonly defaults = inject(NB_CONFIRM_DIALOG_DEFAULTS);
  protected readonly texts = injectNbTexts('confirmDialog', () => ({
    confirm: $localize`:@@nb.confirmDialog.confirm:Confirm`,
    cancel: $localize`:@@nb.confirmDialog.cancel:Cancel`,
  }));
  protected readonly errorHandler = inject(ErrorHandler);

  constructor() {
    // Escape cancels, unless the action is running; it's for this dialog only, not one it was opened from.
    const escape = inject(NbEscapeStack).add(() => this.cancel());
    inject(DestroyRef).onDestroy(() => escape.remove());
  }

  static nextIds() {
    const id = lastConfirmDialogId++;
    return { titleId: `nb-confirm-dialog-title-${id}`, messageId: `nb-confirm-dialog-message-${id}` };
  }

  readonly options = input.required<NbConfirmDialogOptions>();

  titleId = '';
  messageId = '';

  /**
   * Whether the action is running.
   */
  readonly busy = signal(false);

  protected readonly confirmText = computed(
    () => this.options().confirmText ?? this.defaults.confirmText ?? this.texts().confirm,
  );
  protected readonly cancelText = computed(
    () => this.options().cancelText ?? this.defaults.cancelText ?? this.texts().cancel,
  );
  protected readonly status = computed(() => this.options().status ?? this.defaults.status ?? 'primary');

  async confirm() {
    const { action } = this.options();
    if (!action) {
      this.dialogRef.close(true);
      return;
    }
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    try {
      const result = action();
      await (isObservable(result) ? lastValueFrom(result, { defaultValue: undefined }) : result);
      this.dialogRef.close(true);
    } catch (error) {
      this.errorHandler.handleError(error);
    } finally {
      this.busy.set(false);
    }
  }

  cancel() {
    if (!this.busy()) {
      this.dialogRef.close(false);
    }
  }

  protected isTemplate(message: string | TemplateRef<void>): message is TemplateRef<void> {
    return message instanceof TemplateRef;
  }
}
