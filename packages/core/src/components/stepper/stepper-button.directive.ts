import { NbStepperComponent } from './stepper.component';
import { Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

/**
 * Moves its stepper to the next step when clicked. In a form, a submit button (the default `type`) moves on once the
 * form is submitted, so the browser checks the form first.
 */
@Directive({
  selector: 'button[nbStepperNext]',
  host: {
    '[attr.type]': 'type()',
    '(click)': 'onClick()',
  },
})
export class NbStepperNextDirective implements OnDestroy {
  protected readonly stepper = inject(NbStepperComponent);
  protected readonly hostRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  readonly type = input<string>('submit');

  protected removeSubmitListener?: () => void;

  onClick() {
    const form = this.type() === 'submit' ? this.hostRef.nativeElement.form : null;
    if (!form) {
      this.stepper.next();
      return;
    }

    // The next step replaces the form, and the browser cancels the submission of a removed form,
    // so the stepper moves on once the form is submitted.
    this.removeSubmitListener?.();
    const removeSubmitListener = () => {
      form.removeEventListener('submit', onSubmit);
      this.removeSubmitListener = undefined;
    };
    const onSubmit = () => {
      removeSubmitListener();
      this.stepper.next();
    };
    form.addEventListener('submit', onSubmit);
    this.removeSubmitListener = removeSubmitListener;
  }

  ngOnDestroy() {
    this.removeSubmitListener?.();
  }
}

/**
 * Moves its stepper to the previous step when clicked.
 */
@Directive({
  selector: 'button[nbStepperPrevious]',
  host: {
    '[attr.type]': 'type()',
    '(click)': 'onClick()',
  },
})
export class NbStepperPreviousDirective {
  protected readonly stepper = inject(NbStepperComponent);

  readonly type = input<string>('button');

  onClick() {
    this.stepper.previous();
  }
}
