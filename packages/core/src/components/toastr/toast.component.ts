import {
  Component,
  computed,
  ElementRef,
  ErrorHandler,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  signal,
} from '@angular/core';

import { NbStatusService } from '@liquid-js/lyr-core/base';
import { NbIconConfig, NbIconComponent } from '@liquid-js/lyr-core/icon';
import { NbButtonComponent } from '@liquid-js/lyr-core/button';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbToast, NbToastAction } from './model';
import type { NbToastRef } from './toastr.service';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/**
 * A toast, as `NbToastrService` shows it. A `danger` or `warning` toast is a live `alert`, announced at once; the
 * others are a polite `status`. Its auto-dismiss timer pauses while the focus is in it, an action runs, or (with
 * `pauseOnHover`) the pointer is over it.
 *
 * @styles
 *
 * toastr-border-style:
 * toastr-border-width:
 * toastr-border-radius:
 * toastr-padding:
 * toastr-shadow:
 * toastr-text-font-family:
 * toastr-text-font-size:
 * toastr-text-font-weight:
 * toastr-text-line-height:
 * toastr-title-text-font-family:
 * toastr-title-text-font-size:
 * toastr-title-text-font-weight:
 * toastr-title-text-line-height:
 * toastr-basic-background-color:
 * toastr-basic-border-color:
 * toastr-basic-text-color:
 * toastr-icon-basic-background-color:
 * toastr-icon-basic-color:
 * toastr-destroyable-basic-hover-background-color:
 * toastr-destroyable-basic-hover-border-color:
 * toastr-primary-background-color:
 * toastr-primary-border-color:
 * toastr-primary-text-color:
 * toastr-icon-primary-background-color:
 * toastr-icon-primary-color:
 * toastr-destroyable-primary-hover-background-color:
 * toastr-destroyable-primary-hover-border-color:
 * toastr-success-background-color:
 * toastr-success-border-color:
 * toastr-success-text-color:
 * toastr-icon-success-background-color:
 * toastr-icon-success-color:
 * toastr-destroyable-success-hover-background-color:
 * toastr-destroyable-success-hover-border-color:
 * toastr-info-background-color:
 * toastr-info-border-color:
 * toastr-info-text-color:
 * toastr-icon-info-background-color:
 * toastr-icon-info-color:
 * toastr-destroyable-info-hover-background-color:
 * toastr-destroyable-info-hover-border-color:
 * toastr-warning-background-color:
 * toastr-warning-border-color:
 * toastr-warning-text-color:
 * toastr-icon-warning-background-color:
 * toastr-icon-warning-color:
 * toastr-destroyable-warning-hover-background-color:
 * toastr-destroyable-warning-hover-border-color:
 * toastr-danger-background-color:
 * toastr-danger-border-color:
 * toastr-danger-text-color:
 * toastr-icon-danger-background-color:
 * toastr-icon-danger-color:
 * toastr-destroyable-danger-hover-background-color:
 * toastr-destroyable-danger-hover-border-color:
 * toastr-control-background-color:
 * toastr-control-border-color:
 * toastr-control-text-color:
 * toastr-icon-control-background-color:
 * toastr-icon-control-color:
 * toastr-destroyable-control-hover-background-color:
 * toastr-destroyable-control-hover-border-color:
 * */
@Component({
  selector: 'nb-toast',
  styleUrls: ['./toast.component.scss'],
  templateUrl: './toast.component.html',
  imports: [NbIconComponent, NbButtonComponent],
  host: {
    'aria-atomic': 'true',
    '[attr.role]': 'role()',
    '[attr.aria-live]': 'ariaLive()',
    '[class]': 'statusClass()',
    '[class.destroy-by-click]': 'destroyByClick()',
    '[class.has-close-button]': 'closeButton()',
    '[class.has-actions]': 'actions().length > 0',
    '[class.has-icon]': 'hasIcon()',
    '[class.custom-icon]': 'customIcon()',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class NbToastComponent implements OnInit, OnDestroy {
  protected readonly texts = injectNbTexts('toastr', () => ({
    close: $localize`:@@nb.toastr.close:Close`,
  }));

  protected readonly renderer = inject(Renderer2);
  protected readonly elementRef = inject(ElementRef);
  protected readonly statusService = inject(NbStatusService);

  readonly toast = input.required<NbToast>();

  readonly destroy = output<void>();
  readonly toastClick = output<void>();
  readonly closeClick = output<void>();
  readonly pointerEnter = output<void>();
  readonly pointerLeave = output<void>();
  /**
   * Whether the toast's auto-dismiss timer is paused: the pointer is over it (with `pauseOnHover`), the focus is in it,
   * or an action runs.
   */
  readonly holdChange = output<boolean>();

  /**
   * The toast's ref, which actions get; set by its container.
   */
  ref?: NbToastRef;

  protected readonly errorHandler = inject(ErrorHandler);
  protected readonly hovered = signal(false);
  protected readonly focused = signal(false);
  // The action that runs, whose button is loading.
  protected readonly pending = signal<NbToastAction | undefined>(undefined);
  protected wasHeld = false;
  protected returnFocus?: HTMLElement;
  protected readonly held = computed(
    () => (this.hovered() && this.toast().config.pauseOnHover) || this.focused() || !!this.pending(),
  );

  readonly actions = computed(() => this.toast().config.actions ?? []);

  // Buttons stand out on the toast: light on a toast of a color, of the primary color on a light one.
  protected readonly actionStatus = computed<NbComponentOrCustomStatus>(() => {
    const { status } = this.toast().config;
    return status === 'basic' || status === 'control' ? 'primary' : 'control';
  });

  // The close button is chrome: ghost, light on a toast of a colour, as its text is, and basic on a light one.
  protected readonly closeStatus = computed<NbComponentOrCustomStatus>(() => {
    const { status } = this.toast().config;
    return status === 'basic' || status === 'control' ? 'basic' : 'control';
  });

  protected readonly isUrgent = computed(() => {
    const { status } = this.toast().config;
    return status === 'danger' || status === 'warning';
  });

  readonly role = computed(() => (this.isUrgent() ? 'alert' : 'status'));

  readonly ariaLive = computed(() => (this.isUrgent() ? 'assertive' : 'polite'));

  protected readonly statusClass = computed(() => this.statusService.getStatusClass(this.toast().config.status));

  readonly destroyByClick = computed(() => this.toast().config.destroyByClick);

  readonly closeButton = computed(() => this.toast().config.closeButton);

  readonly icon = computed<string | NbIconConfig>(() => this.toast().config.icon);

  readonly hasIcon = computed(() => {
    const icon = this.icon();
    if (typeof icon === 'string') {
      return true;
    }

    return !!(icon && (icon as NbIconConfig).icon);
  });

  readonly customIcon = computed(() => !!this.icon());

  onClick() {
    this.toastClick.emit();
  }

  onMouseEnter() {
    this.hovered.set(true);
    this.updateHold();
    this.pointerEnter.emit();
  }

  onMouseLeave() {
    this.hovered.set(false);
    this.updateHold();
    this.pointerLeave.emit();
  }

  protected onFocusIn(event: FocusEvent) {
    // Where the focus came from, to go back to when the toast closes with the focus in it.
    const from = event.relatedTarget as HTMLElement | null;
    if (!this.focused() && from && !this.elementRef.nativeElement.contains(from)) {
      this.returnFocus = from;
    }
    this.focused.set(true);
    this.updateHold();
  }

  protected onFocusOut(event: FocusEvent) {
    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.focused.set(false);
      this.updateHold();
    }
  }

  // Tells the container at once, so the timer can't run out in between.
  protected updateHold() {
    const held = this.held();
    if (held !== this.wasHeld) {
      this.wasHeld = held;
      this.holdChange.emit(held);
    }
  }

  protected async runAction(action: NbToastAction, event: MouseEvent) {
    // Keeps a destroy-by-click toast from also handling the click as a toast click.
    event.stopPropagation();
    if (this.pending()) {
      return;
    }
    this.pending.set(action);
    this.updateHold();
    try {
      await action.action?.(this.ref as NbToastRef);
      if (action.close !== false) {
        this.closeClick.emit();
      }
    } catch (error) {
      this.errorHandler.handleError(error);
    } finally {
      this.pending.set(undefined);
      this.updateHold();
    }
  }

  onCloseClick(event: MouseEvent) {
    // Keeps a destroy-by-click toast from also handling the click as a toast click.
    event.stopPropagation();
    this.closeClick.emit();
  }

  ngOnInit() {
    const { toastClass } = this.toast().config;
    if (toastClass) {
      this.renderer.addClass(this.elementRef.nativeElement, toastClass);
    }
  }

  ngOnDestroy() {
    // Closing with the focus in it, e.g. by an action, would leave the focus nowhere.
    if (this.elementRef.nativeElement.contains(this.elementRef.nativeElement.ownerDocument.activeElement)) {
      this.returnFocus?.focus();
    }
    this.destroy.emit();
  }
}
