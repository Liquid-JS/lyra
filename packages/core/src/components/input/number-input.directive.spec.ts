import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';

import { NbInputModule, NbThemeModule, NbValidationModule, provideNbValidation, nbValidationParam } from '@liquid-js/lyr-core';

@Component({
  template: `
    <input nbInput
      nbNumberInput
      [scale]="scale()"
      [min]="min()"
      max="100"
      step="any"
      [formControl]="control" />
  `,
  imports: [NbInputModule, ReactiveFormsModule],
})
class NumberInputHostComponent {
  readonly scale = signal(100);
  readonly min = signal(0);
  readonly control = new FormControl<number | null>(0.5);
}

describe('NbNumberInputDirective', () => {
  let fixture: ComponentFixture<NumberInputHostComponent>;
  let host: NumberInputHostComponent;
  let input: HTMLInputElement;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const type = (text: string) => {
    input.value = text;
    input.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(NumberInputHostComponent);
    host = fixture.componentInstance;
    await render();
    input = fixture.nativeElement.querySelector('input');
  });

  it('should be a number input with its limits', () => {
    expect(input.type).toBe('number');
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
    expect(input.step).toBe('any');
  });

  it('should show the value at its scale', () => {
    expect(input.value).toBe('50');
  });

  it('should write what is entered at its scale, without floating point noise', () => {
    type('7');
    expect(host.control.value).toBe(0.07);

    type('33.3');
    expect(host.control.value).toBe(0.333);

    host.control.setValue(0.07);
    expect(input.value).toBe('7');
  });

  it('should write null for an empty input, and empty the input for null', () => {
    type('');
    expect(host.control.value).toBeNull();

    host.control.setValue(0.2);
    host.control.setValue(null);
    expect(input.value).toBe('');
  });

  it('should leave text that shows the value as it is', () => {
    type('50.0');
    host.control.setValue(0.5);

    expect(input.value).toBe('50.0');
  });

  it('should show the value again when its scale changes', async () => {
    host.scale.set(180 / Math.PI);
    host.control.setValue(Math.PI / 2);
    await render();
    expect(input.value).toBe('90');

    host.scale.set(1);
    await render();
    // To 12 significant digits.
    expect(input.value).toBe('1.57079632679');
  });

  it('should validate the limits in the units it shows', async () => {
    expect(host.control.errors).toBeNull();

    type('120');
    expect(host.control.errors).toEqual({
      max: { kind: 'max', max: 100, actual: 120, message: 'Enter a value of at most 100' },
    });

    type('-5');
    expect(host.control.errors).toEqual({
      min: { kind: 'min', min: 0, actual: -5, message: 'Enter a value of at least 0' },
    });

    host.min.set(-10);
    await render();
    expect(host.control.errors).toBeNull();
  });

  it('should keep the value while the text is not a number, with the parse error, and clear it on reset', async () => {
    input.focus();
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- only typing makes a number input's text bad input; setting its value drops text that isn't a number.
    document.execCommand('insertText', false, 'e');
    expect(input.validity.badInput).toBe(true);
    expect(host.control.value).toBe(0.5);
    expect(host.control.errors).toEqual({ nbNumberInputParse: { kind: 'nbNumberInputParse', message: 'Enter a number' } });

    host.control.reset();
    expect(input.validity.badInput).toBe(false);
    expect(input.value).toBe('');
    expect(host.control.errors).toBeNull();
  });

  it('should follow the disabled state of the form', () => {
    host.control.disable();
    expect(input.disabled).toBe(true);

    host.control.enable();
    expect(input.disabled).toBe(false);
  });
});

@Component({
  template: `
    <form>
      <input nbInput nbNumberInput [scale]="100" min="0" max="100" [formControl]="control" nbValidation #validation="nbValidation" />
      <nb-validation-errors [for]="validation" />
    </form>
  `,
  imports: [NbInputModule, NbValidationModule, ReactiveFormsModule],
})
class NumberReactiveHostComponent {
  readonly control = new FormControl<number | null>(0.5);
  value = () => this.control.value;
}

@Component({
  template: `
    <form>
      <input nbInput nbNumberInput [scale]="100" min="0" max="100" name="share" [(ngModel)]="share" nbValidation #validation="nbValidation" />
      <nb-validation-errors [for]="validation" />
    </form>
  `,
  imports: [NbInputModule, NbValidationModule, FormsModule],
})
class NumberTemplateDrivenHostComponent {
  share: number | null = 0.5;
  value = () => this.share;
}

@Component({
  template: `
    <form>
      <input nbInput nbNumberInput [scale]="100" min="0" max="100" [formField]="shares.share" nbValidation #validation="nbValidation" />
      <nb-validation-errors [for]="validation" />
    </form>
  `,
  imports: [NbInputModule, NbValidationModule, FormField],
})
class NumberSignalFormsHostComponent {
  readonly model = signal<{ share: number | null }>({ share: 0.5 });
  readonly shares = form(this.model);
  value = () => this.model().share;
}

describe('NbNumberInputDirective in forms', () => {
  const hosts = [
    ['reactive', NumberReactiveHostComponent],
    ['template-driven', NumberTemplateDrivenHostComponent],
    ['signal', NumberSignalFormsHostComponent],
  ] as const;

  for (const [name, host] of hosts) {
    it(`should keep the value for text that isn't a number, and check its limits, in ${name} forms`, async () => {
      TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), host] });
      const fixture = TestBed.createComponent<{ value: () => number | null }>(host);
      const render = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
      };
      await render();
      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim();
      const blur = async () => {
        input.dispatchEvent(new Event('blur'));
        await render();
      };

      input.focus();
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- only typing makes a number input's text bad input; setting its value drops text that isn't a number.
      document.execCommand('insertText', false, 'e');
      await blur();
      expect(input.validity.badInput).toBe(true);
      expect(fixture.componentInstance.value()).toBe(0.5);
      expect(errors()).toBe('Enter a number');

      input.value = '120';
      input.dispatchEvent(new Event('input'));
      await blur();
      expect(fixture.componentInstance.value()).toBe(1.2);
      expect(errors()).toBe('Enter a value of at most 100');

      input.value = '40';
      input.dispatchEvent(new Event('input'));
      await blur();
      expect(fixture.componentInstance.value()).toBe(0.4);
      expect(errors()).toBe('');
    });
  }
});

describe('NbNumberInputDirective messages', () => {
  it('should carry the messages the app sets in its errors', async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NumberReactiveHostComponent],
      providers: [provideNbValidation({ messages: { max: (error) => `No more than ${String(nbValidationParam(error, 'max'))}%` } })],
    });
    const fixture = TestBed.createComponent(NumberReactiveHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '120';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.errors).toEqual({
      max: { kind: 'max', max: 100, actual: 120, message: 'No more than 100%' },
    });
  });
});
