import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';

import {
  NbCheckboxModule,
  NbFileDropModule,
  NbInputModule,
  NbSelectModule,
  NbTagModule,
  NbThemeModule,
  NbToggleModule,
  NbValidationModule,
} from '@liquid-js/lyr-core';

@Component({
  template: `
    <form [formGroup]="form">
      <label nbLabel class="email-label" [for]="email">Email</label>
      <input nbInput formControlName="email" nbValidation #email="nbValidation" />

      <label nbLabel class="note-label" [for]="note">Note</label>
      <input nbInput id="own-id" formControlName="note" nbValidation #note="nbValidation" />

      <label nbLabel class="plan-label" [for]="plan">Plan</label>
      <nb-select formControlName="plan" nbValidation #plan="nbValidation">
        <nb-option value="free">Free</nb-option>
      </nb-select>
    </form>
  `,
  imports: [ReactiveFormsModule, NbInputModule, NbSelectModule, NbValidationModule],
})
class ReactiveHostComponent {
  readonly form = new FormGroup({
    email: new FormControl('', Validators.required),
    note: new FormControl(''),
    plan: new FormControl<string | null>(null, Validators.required),
  });
}

// Controls whose focusable element is inside them.
@Component({
  template: `
    <form [formGroup]="form">
      <label nbLabel class="terms-label" [for]="terms">Terms</label>
      <nb-checkbox formControlName="terms" nbValidation #terms="nbValidation">I agree</nb-checkbox>

      <label nbLabel class="alerts-label" [for]="alerts">Alerts</label>
      <nb-toggle formControlName="alerts" nbValidation #alerts="nbValidation">Email me</nb-toggle>

      <label nbLabel class="files-label" [for]="files">Files</label>
      <nb-file-drop formControlName="files" nbValidation #files="nbValidation" />

      <label nbLabel class="tags-label" [for]="tags">Tags</label>
      <nb-tag-list formControlName="tags" nbValidation #tags="nbValidation">
        <input nbTagInput />
      </nb-tag-list>
    </form>
  `,
  imports: [ReactiveFormsModule, NbCheckboxModule, NbToggleModule, NbFileDropModule, NbTagModule, NbValidationModule],
})
class InnerFieldHostComponent {
  readonly form = new FormGroup({
    terms: new FormControl(false, Validators.requiredTrue),
    alerts: new FormControl(false, Validators.required),
    files: new FormControl<File[]>([], Validators.required),
    tags: new FormControl<string[]>([], Validators.required),
  });
}

@Component({
  template: `
    <form>
      <label nbLabel [for]="name">Name</label>
      <input nbInput name="name" [(ngModel)]="name" required nbValidation #name="nbValidation" />
    </form>
  `,
  imports: [FormsModule, NbInputModule, NbValidationModule],
})
class TemplateDrivenHostComponent {
  name = '';
}

@Component({
  template: `
    <label nbLabel [for]="city">City</label>
    <input nbInput [formField]="address.city" nbValidation #city="nbValidation" />
  `,
  imports: [FormField, NbInputModule, NbValidationModule],
})
class SignalFormsHostComponent {
  readonly model = signal({ city: '' });
  readonly address = form(this.model, (path) => required(path.city));
}

describe('nbLabel', () => {
  const create = async <T>(host: new () => T): Promise<ComponentFixture<T>> => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), host] });
    const fixture = TestBed.createComponent(host);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };
  const marker = (label: Element) => label.querySelector('.label-required');

  afterEach(() => document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove()));

  it('should label a native field with for, giving it an id, and mark it when required', async () => {
    const fixture = await create(ReactiveHostComponent);
    const label = fixture.nativeElement.querySelector('.email-label') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('input[formcontrolname="email"]') as HTMLInputElement;

    expect(label.classList).toContain('label');
    expect(input.id).toBeTruthy();
    expect(label.htmlFor).toBe(input.id);
    expect(marker(label)?.getAttribute('aria-hidden')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');

    // It follows the validators.
    fixture.componentInstance.form.controls.email.removeValidators(Validators.required);
    fixture.componentInstance.form.controls.email.updateValueAndValidity();
    fixture.detectChanges();
    expect(marker(label)).toBeNull();
    expect(input.hasAttribute('aria-required')).toBe(false);
  });

  it('should keep a field\'s own id, and not mark an optional one', async () => {
    const fixture = await create(ReactiveHostComponent);
    const label = fixture.nativeElement.querySelector('.note-label') as HTMLLabelElement;
    expect(label.htmlFor).toBe('own-id');
    expect(marker(label)).toBeNull();
  });

  it('should label a control with its field inside by aria-labelledby, and focus it on a click', async () => {
    const fixture = await create(ReactiveHostComponent);
    const label = fixture.nativeElement.querySelector('.plan-label') as HTMLLabelElement;
    const button = fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement;

    expect(label.hasAttribute('for')).toBe(false);
    expect(button.getAttribute('aria-labelledby')?.split(' ')).toContain(label.id);
    expect(button.getAttribute('aria-required')).toBe('true');
    expect(marker(label)).not.toBeNull();

    label.click();
    expect(document.activeElement).toBe(button);
    fixture.destroy();
  });

  it('should name the inner field of a checkbox, toggle, file drop and tag list, and mark it required', async () => {
    const fixture = await create(InnerFieldHostComponent);
    const query = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;
    const fields = {
      terms: query('nb-checkbox input'),
      alerts: query('nb-toggle input'),
      files: query('nb-file-drop input'),
      tags: query('nb-tag-list input'),
    };

    for (const [name, field] of Object.entries(fields)) {
      const label = query(`.${name}-label`);
      expect(field.getAttribute('aria-labelledby')?.split(' '), name).toContain(label.id);
      expect(field.getAttribute('aria-required'), name).toBe('true');
      expect(query(`[formcontrolname="${name}"]`).hasAttribute('aria-labelledby'), name).toBe(false);
    }
    // The choice's own text follows, as a select's value does.
    expect(document.getElementById(fields.terms.getAttribute('aria-labelledby')?.split(' ')[1] ?? '')?.textContent)
      .toContain('I agree');
    fixture.destroy();
  });

  it('should mark a required field in template-driven forms', async () => {
    const fixture = await create(TemplateDrivenHostComponent);
    expect(marker(fixture.nativeElement.querySelector('label'))).not.toBeNull();
    fixture.destroy();
  });

  it('should mark a required field in signal forms', async () => {
    const fixture = await create(SignalFormsHostComponent);
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(marker(fixture.nativeElement.querySelector('label'))).not.toBeNull();
    expect(input.getAttribute('aria-required')).toBe('true');
    fixture.destroy();
  });
});
