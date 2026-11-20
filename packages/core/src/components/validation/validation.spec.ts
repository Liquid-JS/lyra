import { Component, Directive, forwardRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { form, FormField, minLength, required, validate } from '@angular/forms/signals';
import {
  NbCheckboxComponent,
  NbInputDirective,
  NbOptionComponent,
  NbSelectComponent,
  NbValidationDirective,
  NbValidationError,
  NbValidationModule,
  NbValidationTrigger,
  provideNbTheme,
  provideNbTexts,
  provideNbValidation,
  nbValidationParam,
} from '@liquid-js/lyr-core';

const matching = (group: AbstractControl): ValidationErrors | null =>
  group.value.password === group.value.confirm ? null : { mismatch: true };

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="(0)">
      <input
        nbInput
        data-control="password"
        formControlName="password"
        aria-describedby="hint"
        nbValidation
        [nbValidationTrigger]="trigger()"
        [nbValidationSuccess]="success()"
        #password="nbValidation"
      />
      <nb-validation-errors data-errors="password" [for]="password">
        At least 3 characters.
        @if (customMinlength()) {
          <ng-template nbValidationError="minlength" let-error>
            At least {{ requiredLength(error) }}, please
          </ng-template>
        }
      </nb-validation-errors>

      <input
        nbInput
        data-control="confirm"
        formControlName="confirm"
        nbValidation
        [nbValidationGroupErrors]="['mismatch']"
        #confirm="nbValidation"
      />
      <nb-validation-errors data-errors="confirm" [for]="confirm">
        <ng-template nbValidationError="mismatch">Passwords don't match</ng-template>
      </nb-validation-errors>

      <nb-select data-control="choice" formControlName="choice" nbValidation #choice="nbValidation">
        <nb-option value="a">A</nb-option>
      </nb-select>
      <nb-validation-errors data-errors="choice" [for]="choice" />

      <nb-checkbox data-control="agree" formControlName="agree" nbValidation #agree="nbValidation">Agree</nb-checkbox>
      <nb-validation-errors data-errors="agree" [for]="agree" />

      <button type="submit">Submit</button>
    </form>
  `,
  imports: [
    ReactiveFormsModule,
    NbInputDirective,
    NbSelectComponent,
    NbOptionComponent,
    NbCheckboxComponent,
    NbValidationModule,
  ],
})
class ReactiveHostComponent {
  protected readonly requiredLength = (error: NbValidationError) => nbValidationParam(error, 'requiredLength');
  readonly trigger = signal<NbValidationTrigger | undefined>(undefined);
  readonly success = signal<boolean | undefined>(undefined);
  readonly customMinlength = signal(false);
  readonly form = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      confirm: new FormControl(''),
      choice: new FormControl('', Validators.required),
      agree: new FormControl(false, Validators.requiredTrue),
    },
    { validators: matching },
  );
}

@Component({
  template: `
    <form>
      <input nbInput data-control="name" name="name" [(ngModel)]="name" required nbValidation #model="nbValidation" />
      <nb-validation-errors data-errors="name" [for]="model" />
    </form>
  `,
  imports: [FormsModule, NbInputDirective, NbValidationModule],
})
class TemplateDrivenHostComponent {
  name = '';
}

@Component({
  template: `
    <input nbInput data-control="name" [formField]="form.name" nbValidation #name="nbValidation" />
    <nb-validation-errors data-errors="name" [for]="name" />
  `,
  imports: [FormField, NbInputDirective, NbValidationModule],
})
class SignalFormsHostComponent {
  readonly model = signal({ name: '' });
  readonly form = form(this.model, (path) => {
    required(path.name, { message: 'Tell us your name' });
    minLength(path.name, 3);
  });
}

/** A control with its own check, whose error carries its message, as a control's check of text it can't parse. */
@Directive({
  selector: 'input[nbTestCode]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TestCodeDirective), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => TestCodeDirective), multi: true },
  ],
  host: { '(input)': 'onChange($any($event.target).value)', '(blur)': 'onTouched()' },
})
class TestCodeDirective implements ControlValueAccessor, Validator {
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  writeValue() {}
  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return !control.value || /^\d{4}$/.test(control.value)
      ? null
      : { testCode: { kind: 'testCode', message: 'Enter four digits', length: 4 } };
  }
}

@Component({
  template: `
    <input data-control="code" nbTestCode [formField]="form.code" nbValidation #code="nbValidation" />
    <nb-validation-errors data-errors="code" [for]="code" />
  `,
  imports: [FormField, TestCodeDirective, NbValidationModule],
})
class SignalFormsControlHostComponent {
  readonly model = signal({ code: '' });
  readonly form = form(this.model);
}

@Component({
  template: `
    <input data-control="code" nbTestCode [formField]="form.code" nbValidation #code="nbValidation" />
    <nb-validation-errors data-errors="code" [for]="code" />
  `,
  imports: [FormField, TestCodeDirective, NbValidationModule],
})
class SignalFormsRuleHostComponent {
  readonly model = signal({ code: '' });
  // A rule of the same kind as the control's check, which finds the same problem.
  readonly form = form(this.model, (path) => {
    validate(path.code, ({ value }) =>
      !value() || /^\d{4}$/.test(value()) ? null : { kind: 'testCode', message: 'Use four digits' },
    );
  });
}

@Component({
  template: `
    <input data-control="code" [formControl]="code" />
    <ul data-errors="code">
      @for (error of code.errors | nbValidationErrors; track error.kind) {
        <li>{{ error | nbValidationMessage }}</li>
      }
    </ul>
  `,
  imports: [ReactiveFormsModule, NbValidationModule],
})
class OwnDisplayReactiveHostComponent {
  readonly code = new FormControl('', [Validators.required, Validators.minLength(3)]);
}

@Component({
  template: `
    <input data-control="code" nbTestCode [formField]="form.code" />
    <ul data-errors="code">
      @for (error of form.code().errors() | nbValidationErrors; track error.kind) {
        <li>{{ error | nbValidationMessage }}</li>
      }
    </ul>
  `,
  imports: [FormField, TestCodeDirective, NbValidationModule],
})
class OwnDisplaySignalHostComponent {
  readonly model = signal({ code: '' });
  readonly form = form(this.model, (path) => {
    required(path.code);
  });
}

// A required control whose text isn't a value yet, as a control that parses its text reports it: no value, so
// `required` fails too, beside the error about the text.
@Component({
  template: `
    <input nbInput data-control="date" [formControl]="date" nbValidation #dateValidation="nbValidation" />
    <nb-validation-errors data-errors="date" [for]="dateValidation">
      <ng-template nbValidationError="nbTestParse">Enter a date</ng-template>
    </nb-validation-errors>
    <input nbInput data-control="empty" [formControl]="empty" nbValidation #emptyValidation="nbValidation" />
    <nb-validation-errors data-errors="empty" [for]="emptyValidation" />
  `,
  imports: [ReactiveFormsModule, NbInputDirective, NbValidationModule],
})
class ParsedTextHostComponent {
  readonly date = new FormControl<string | null>(null, [Validators.required, () => ({ nbTestParse: true })]);
  readonly empty = new FormControl<string | null>(null, Validators.required);
}

describe('validation', () => {
  let fixture: ComponentFixture<unknown>;

  const control = (name: string) => fixture.nativeElement.querySelector(`[data-control="${name}"]`) as HTMLElement;
  const errors = (name: string) =>
    (fixture.nativeElement.querySelector(`[data-errors="${name}"] .validation-errors`) as HTMLElement).textContent?.trim();
  /** The helper text, while it shows. */
  const helper = (name: string) => {
    const element = fixture.nativeElement.querySelector(`[data-errors="${name}"] .validation-helper`) as HTMLElement;
    return element.classList.contains('validation-collapsed') ? undefined : element.textContent?.trim();
  };

  // ngModel and signal forms write to their controls after change detection, so let microtasks run first.
  const render = async () => {
    fixture.detectChanges();
    await Promise.resolve();
    await fixture.whenStable();
  };

  const type = async (name: string, value: string) => {
    const input = control(name) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await render();
  };

  const blur = async (name: string) => {
    control(name).dispatchEvent(new Event('blur'));
    await render();
  };

  const create = async <T>(host: new () => T, providers = new Array<unknown>()) => {
    TestBed.configureTestingModule({ providers: [provideNbTheme(), ...(providers as [])] });
    fixture = TestBed.createComponent(host);
    await render();
    return fixture.componentInstance as T;
  };

  it("should show only the error about a field's text, not that it's required, while its text isn't a value", async () => {
    await create(ParsedTextHostComponent);
    await blur('date');
    await blur('empty');
    expect(errors('date')).toBe('Enter a date');
    expect(errors('empty')).toBe('This field is required');
  });

  describe('with reactive forms', () => {
    let host: ReactiveHostComponent;

    beforeEach(async () => {
      host = await create(ReactiveHostComponent);
    });

    it('should keep errors hidden and the own status until the control is touched', async () => {
      expect(errors('password')).toBe('');
      expect(control('password').classList).toContain('status-basic');
      expect(control('password').hasAttribute('aria-invalid')).toBe(false);

      await blur('password');

      expect(errors('password')).toBe('This field is required');
      expect(control('password').classList).toContain('status-danger');
      expect(control('password').getAttribute('aria-invalid')).toBe('true');
    });

    it('should describe the control with its own description and its errors', () => {
      const errorsId = fixture.nativeElement.querySelector('[data-errors="password"]').id;

      expect(errorsId).toMatch(/^nb-validation-errors-\d+$/);
      expect(control('password').getAttribute('aria-describedby')).toBe(`hint ${errorsId}`);
    });

    it('should announce errors politely, but not the helper text', () => {
      const element = fixture.nativeElement.querySelector('[data-errors="password"]') as HTMLElement;
      expect(element.querySelector('.validation-errors')?.getAttribute('aria-live')).toBe('polite');
      expect(element.getAttribute('aria-live')).toBeNull();
      expect(element.querySelector('.validation-helper')?.closest('[aria-live]')).toBeNull();
    });

    it('should show the helper text until errors replace it, and again once they are gone', async () => {
      expect(helper('password')).toBe('At least 3 characters.');

      await type('password', 'ab');
      await blur('password');
      expect(errors('password')).toBe('Enter at least 3 characters');
      expect(helper('password')).toBeUndefined();

      await type('password', 'abc');
      expect(errors('password')).toBe('');
      expect(helper('password')).toBe('At least 3 characters.');
    });

    it('should take no room without helper text', () => {
      const element = fixture.nativeElement.querySelector('[data-errors="choice"] .validation-helper .validation-text');
      expect(element.childNodes.length).toBe(0);
    });

    it('should build messages from the error', async () => {
      await type('password', 'ab');
      await blur('password');

      expect(errors('password')).toBe('Enter at least 3 characters');
    });

    it('should prefer a message template for the error kind', async () => {
      host.customMinlength.set(true);
      await type('password', 'ab');
      await blur('password');

      expect(errors('password')).toBe('At least 3, please');
    });

    it('should show errors while typing with the dirty trigger', async () => {
      host.trigger.set('dirty');
      await type('password', 'ab');

      expect(errors('password')).toBe('Enter at least 3 characters');
    });

    it('should wait for submission with the submitted trigger', async () => {
      host.trigger.set('submitted');
      await type('password', 'ab');
      await blur('password');

      expect(errors('password')).toBe('');

      (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
      await render();

      expect(errors('password')).toBe('Enter at least 3 characters');
    });

    it('should show errors of all controls when the form is submitted', async () => {
      (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
      await render();

      expect(errors('password')).toBe('This field is required');
      expect(errors('choice')).toBe('This field is required');
    });

    it('should hide errors again when the form is reset', async () => {
      await blur('password');
      host.form.reset();
      await render();

      expect(errors('password')).toBe('');
      expect(control('password').classList).toContain('status-basic');
    });

    it('should mark valid changed controls with success when enabled', async () => {
      host.success.set(true);
      await type('password', 'abc');

      expect(control('password').classList).toContain('status-success');
    });

    it('should not mark untouched controls with success', async () => {
      host.success.set(true);
      await render();

      expect(control('password').classList).toContain('status-basic');
    });

    it('should show the listed errors of the parent group', async () => {
      await type('password', 'abc');
      await type('confirm', 'abd');
      await blur('confirm');

      expect(control('confirm').classList).toContain('status-danger');
      expect(errors('confirm')).toBe("Passwords don't match");

      await type('confirm', 'abc');

      expect(control('confirm').classList).not.toContain('status-danger');
    });

    it('should put aria attributes on the select button instead of its host', async () => {
      host.form.markAllAsTouched();
      await render();

      const button = control('choice').querySelector('button') as HTMLButtonElement;
      expect(button.getAttribute('aria-invalid')).toBe('true');
      expect(button.getAttribute('aria-describedby')).toBe(fixture.nativeElement.querySelector('[data-errors="choice"]').id);
      expect(control('choice').hasAttribute('aria-invalid')).toBe(false);
      expect(control('choice').hasAttribute('aria-describedby')).toBe(false);
      expect(control('choice').classList).toContain('status-danger');
    });

    it('should put aria attributes on the checkbox input instead of its host', async () => {
      host.form.markAllAsTouched();
      await render();

      const input = control('agree').querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(control('agree').hasAttribute('aria-invalid')).toBe(false);
      expect(control('agree').classList).toContain('status-danger');
      expect(errors('agree')).toBe('This field is required');
    });
  });

  describe('with provided options', () => {
    it('should use provided messages and keep the defaults for others', async () => {
      const host = await create(ReactiveHostComponent, [
        provideNbValidation({ messages: { minlength: (error) => `Min ${String(nbValidationParam(error, 'requiredLength'))}` } }),
      ]);
      host.form.controls.password.setValue('ab');
      host.form.controls.choice.markAsTouched();
      host.form.controls.password.markAsTouched();
      await render();

      expect(errors('password')).toBe('Min 3');
      expect(errors('choice')).toBe('This field is required');
    });

    it('should take messages from the texts, under the provided ones', async () => {
      const host = await create(ReactiveHostComponent, [
        provideNbTexts({ validation: { required: 'Obvezno', minlength: 'Prekratko' } }),
        provideNbValidation({ messages: { minlength: (error) => `Min ${String(nbValidationParam(error, 'requiredLength'))}` } }),
      ]);
      host.form.controls.password.setValue('ab');
      host.form.controls.choice.markAsTouched();
      host.form.controls.password.markAsTouched();
      await render();

      expect(errors('password')).toBe('Min 3');
      expect(errors('choice')).toBe('Obvezno');
    });

    it("should fall back to the message in the error's value, under the provided ones", async () => {
      const host = await create(ReactiveHostComponent, [provideNbValidation({ messages: { iban: 'Not an IBAN' } })]);
      host.form.controls.password.setErrors({ phone: { message: 'Enter a phone number' } });
      host.form.controls.password.markAsTouched();
      await render();

      expect(errors('password')).toBe('Enter a phone number');

      host.form.controls.password.setErrors({ iban: { message: 'Enter an IBAN' } });
      await render();

      expect(errors('password')).toBe('Not an IBAN');
    });

    it('should use the provided trigger', async () => {
      await create(ReactiveHostComponent, [provideNbValidation({ trigger: 'submitted' })]);
      await blur('password');

      expect(errors('password')).toBe('');
    });

    it('should warn about errors without a message', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const host = await create(ReactiveHostComponent);
      host.form.controls.password.setErrors({ iban: true });
      host.form.controls.password.markAsTouched();
      await render();

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('"iban"'));
    });

    it('should not warn about errors with a message template', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const host = await create(ReactiveHostComponent);
      host.form.controls.password.setValue('abc');
      host.form.controls.confirm.setValue('abd');
      host.form.controls.confirm.markAsTouched();
      await render();

      expect(errors('confirm')).toBe("Passwords don't match");
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe('with template-driven forms', () => {
    it('should show errors once touched', async () => {
      await create(TemplateDrivenHostComponent);

      expect(errors('name')).toBe('');

      await blur('name');

      expect(errors('name')).toBe('This field is required');
      expect(control('name').classList).toContain('status-danger');
    });
  });

  describe('with signal forms', () => {
    it("should show the validator's message once touched", async () => {
      await create(SignalFormsHostComponent);

      expect(errors('name')).toBe('');

      await blur('name');

      expect(errors('name')).toBe('Tell us your name');
      expect(control('name').getAttribute('aria-invalid')).toBe('true');
    });

    it('should use the registered message when the validator has none', async () => {
      await create(SignalFormsHostComponent);
      await type('name', 'ab');
      await blur('name');

      expect(errors('name')).toBe('Enter at least 3 characters');
    });
    it("should show the message of a control's own check, with its value as the params", async () => {
      await create(SignalFormsControlHostComponent);
      await type('code', '12a');
      await blur('code');
      const directive = fixture.debugElement
        .query((node) => node.attributes['data-control'] === 'code')
        .injector.get(NbValidationDirective);

      expect(directive.errors()).toEqual([
        { kind: 'testCode', message: undefined, params: { kind: 'testCode', message: 'Enter four digits', length: 4 } },
      ]);
      expect(errors('code')).toBe('Enter four digits');
    });

    it('should show one error of each kind', async () => {
      await create(SignalFormsRuleHostComponent);
      await type('code', '12a');
      await blur('code');

      expect(errors('code')).toBe('Enter four digits');
    });
  });
  describe('with an own display', () => {
    const shown = () =>
      Array.from(fixture.nativeElement.querySelectorAll('[data-errors="code"] li') as NodeListOf<HTMLElement>).map(
        (item) => item.textContent?.trim(),
      );

    it("should list a reactive control's errors with Lyra's messages", async () => {
      await create(OwnDisplayReactiveHostComponent);
      expect(shown()).toEqual(['This field is required']);

      await type('code', 'ab');
      expect(shown()).toEqual(['Enter at least 3 characters']);
    });

    it("should list signal forms errors, also a control's own, with their messages", async () => {
      await create(OwnDisplaySignalHostComponent);
      expect(shown()).toEqual(['This field is required']);

      await type('code', '12a');
      expect(shown()).toEqual(['Enter four digits']);
    });

    it('should take the messages the app sets', async () => {
      await create(OwnDisplayReactiveHostComponent, [provideNbValidation({ messages: { required: 'Fill this in' } })]);

      expect(shown()).toEqual(['Fill this in']);
    });
  });
});
