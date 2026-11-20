import { Component, LOCALE_ID, Provider, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import type { CountryCode } from 'libphonenumber-js';
import { userEvent } from 'vitest/browser';

import {
  NbComponentStatus,
  NbThemeModule,
  NbValidationModule,
  provideNbComponentDefaults,
  provideNbTexts,
} from '@liquid-js/lyr-core';
import {
  NbPhoneInputComponent,
  NbPhoneNumberValidatorDirective,
  nbPhoneNumber,
  provideNbCountryNames,
} from '@liquid-js/lyr-extras/phone-input';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" dir="ltr">
      <nb-phone-input
        [formControl]="phone"
        [(country)]="country"
        [countries]="countries()"
        [ghost]="ghost()"
        [status]="status()"
        [readonly]="readonly()"
        [placeholder]="placeholder()"
        nbValidation
        #validation="nbValidation"
      />
      <nb-validation-errors [for]="validation" />
      <button class="after">After</button>
    </div>
  `,
  styleUrl: '../../styles/spec-theme.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbPhoneInputComponent, ReactiveFormsModule, NbValidationModule],
})
class PhoneHostComponent {
  readonly phone = new FormControl<string | null>(null);
  readonly country = signal<CountryCode | undefined>(undefined);
  readonly countries = signal<CountryCode[] | undefined>(undefined);
  readonly ghost = signal(false);
  readonly status = signal<NbComponentStatus | 'control'>('basic');
  readonly readonly = signal(false);
  readonly placeholder = signal<string | undefined>(undefined);
}

describe('NbPhoneInputComponent', () => {
  let fixture: ComponentFixture<PhoneHostComponent>;
  let host: PhoneHostComponent;
  let element: HTMLElement;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const number = () => element.querySelector('input[type="tel"]') as HTMLInputElement;
  const search = () => element.querySelector('.nb-phone-input-search input') as HTMLInputElement;
  const countryButton = () => element.querySelector('.nb-phone-input-country') as HTMLButtonElement;
  const shown = (field: HTMLElement) => getComputedStyle(field.closest('nb-form-field') as HTMLElement).display !== 'none';
  const options = () =>
    Array.from(document.querySelectorAll('.nb-phone-input-option .nb-phone-input-name')).map((name) =>
      name.textContent?.trim(),
    );
  const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim();

  const create = async (providers: Provider[] = []) => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()], providers });
    fixture = TestBed.createComponent(PhoneHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('nb-phone-input');
    await render();
    // After the country names load.
    await render();
  };

  /** Types at the end of the number. */
  const type = async (text: string) => {
    await userEvent.click(number());
    await userEvent.keyboard('{End}');
    await userEvent.keyboard(text);
    await render();
  };
  /** Opens the search of the countries, whose list shows. */
  const openSearch = async () => {
    await userEvent.click(countryButton());
    await render();
    await vi.waitFor(() => expect(options().length).toBeGreaterThan(0));
  };

  afterEach(() => fixture.destroy());

  it('should take the app\'s defaults for fields, as nbInput does, its country button the field\'s size', async () => {
    await create([provideNbComponentDefaults({ input: { size: 'large', shape: 'round' } })]);
    expect(number().classList).toContain('size-large');
    expect(number().classList).toContain('shape-round');
    expect(countryButton().classList).toContain('size-large');
  });

  it('should be read-only as a field is, and take a placeholder of its own', async () => {
    await create();
    host.readonly.set(true);
    host.placeholder.set('Your phone');
    await render();

    expect(number().readOnly).toBe(true);
    expect(countryButton().disabled).toBe(true);
    expect(number().placeholder).toBe('Your phone');
  });

  describe('with the default country names', () => {
    beforeEach(() => create([{ provide: LOCALE_ID, useValue: 'sl' }]));

    it("should parse numbers in the locale's country, which it tells", async () => {
      expect(host.country()).toBe('SI');
      expect(countryButton().getAttribute('aria-label')).toBe('Country: Slovenia');
      expect(number().placeholder).toMatch(/^0\d/);

      await type('040 123 456');
      expect(host.phone.value).toBe('+38640123456');
      expect(host.country()).toBe('SI');
    });

    it('should show a valid number in the format of its country once the field leaves', async () => {
      await type('040123456');
      await userEvent.click(fixture.nativeElement.querySelector('.after'));
      await render();

      expect(number().value).toBe('040 123 456');
      expect(host.phone.touched).toBe(true);
    });

    it('should pick the country of a number with a calling code', async () => {
      await type('+44 7400 123456');

      expect(host.phone.value).toBe('+447400123456');
      expect(host.country()).toBe('GB');
      expect(countryButton().getAttribute('aria-label')).toBe('Country: United Kingdom');
    });

    // Phone regions, not ISO countries: they're part of Saint Helena, Ascension and Tristan da Cunha.
    it('should show the flag of Saint Helena for Ascension and Tristan da Cunha', async () => {
      for (const region of ['AC', 'TA'] as const) {
        host.country.set(region);
        await render();
        const flag = countryButton().querySelector('nxt-flag') as HTMLElement;
        expect(flag.style.backgroundImage).toContain('sh.svg');
        // The button names the country, so the flag is decoration.
        expect(flag.getAttribute('aria-hidden')).toBe('true');
      }
    });

    it('should show a form value in its country, without reporting a change', async () => {
      host.phone.setValue('+447400123456');
      host.phone.markAsPristine();
      await render();

      expect(number().value).toBe('07400 123456');
      expect(host.country()).toBe('GB');
      expect(host.phone.dirty).toBe(false);
    });

    it('should keep the last valid value while the text is not a valid number, with the parse error', async () => {
      await type('040 12');
      expect(host.phone.value).toBeNull();
      expect(host.phone.errors).toEqual({
        nbPhoneNumber: { kind: 'nbPhoneNumber', problem: 'invalid', message: 'Enter a valid phone number' },
      });

      await userEvent.click(fixture.nativeElement.querySelector('.after'));
      await render();
      expect(errors()).toBe('Enter a valid phone number');
      expect(number().getAttribute('aria-invalid')).toBe('true');
      expect(element.querySelector('nb-form-field input.status-danger')).toBe(number());

      await type('3456');
      expect(host.phone.valid).toBe(true);
      expect(host.phone.value).toBe('+38640123456');
    });

    it('should give no value without a number', async () => {
      await type('1');
      await userEvent.clear(number());
      await render();

      expect(host.phone.value).toBeNull();
      expect(host.phone.valid).toBe(true);
    });

    it('should search the countries and pick one, back in the number field', async () => {
      await type('7400 123456');
      expect(host.phone.errors).not.toBeNull();

      await openSearch();
      expect(shown(search())).toBe(true);
      expect(shown(number())).toBe(false);
      expect(document.activeElement).toBe(search());
      expect(options().length).toBeGreaterThan(200);

      await userEvent.type(search(), 'kingdom');
      await render();
      // The Netherlands by its official name, "Kingdom of the Netherlands".
      expect(options()).toEqual(['Netherlands', 'United Kingdom']);

      await userEvent.type(search(), ' united');
      await render();
      expect(options()).toEqual(['United Kingdom']);

      await userEvent.keyboard('{ArrowDown}{Enter}');
      await render();
      expect(host.country()).toBe('GB');
      expect(host.phone.value).toBe('+447400123456');
      expect(host.phone.valid).toBe(true);
      expect(shown(number())).toBe(true);
      await vi.waitFor(() => expect(document.activeElement).toBe(number()));
    });

    it('should search by calling code and without accents, and pick with the pointer', async () => {
      await openSearch();
      await userEvent.type(search(), '+385');
      await render();
      expect(options()).toEqual(['Croatia']);

      await userEvent.clear(search());
      await userEvent.type(search(), 'réunion');
      await render();
      expect(options()).toEqual(['Reunion']);

      await userEvent.click(document.querySelector('.nb-phone-input-option') as HTMLElement);
      await render();
      expect(host.country()).toBe('RE');
      await vi.waitFor(() => expect(document.activeElement).toBe(number()));
    });

    it('should go back to the number with Escape, keeping the country, and only that', async () => {
      await openSearch();
      await userEvent.type(search(), 'croatia');
      // Handled, so e.g. a dialog around the field stays open.
      let handled: boolean | undefined;
      search().addEventListener('keydown', (event) => (handled = event.defaultPrevented));
      await userEvent.keyboard('{Escape}');
      await render();

      expect(handled).toBe(true);
      expect(host.country()).toBe('SI');
      expect(shown(number())).toBe(true);
      await vi.waitFor(() => expect(document.activeElement).toBe(number()));
    });

    it('should be touched once the focus leaves from the search, as from an autocomplete', async () => {
      await openSearch();
      expect(host.phone.touched).toBe(false);
      fixture.nativeElement.querySelector('.after').focus();
      await render();

      expect(host.phone.touched).toBe(true);
    });

    it('should list only the given countries', async () => {
      host.countries.set(['SI', 'HR', 'AT']);
      await render();
      await openSearch();

      expect(options()).toEqual(['Austria', 'Croatia', 'Slovenia']);
    });

    it('should accept only numbers of the given countries, which it lists', async () => {
      await type('+44 7400 123456');
      expect(host.phone.valid).toBe(true);

      host.countries.set(['SI', 'HR']);
      await render();
      expect(host.phone.value).toBe('+447400123456');

      expect(host.phone.errors).toEqual({
        nbPhoneNumber: {
          kind: 'nbPhoneNumber',
          problem: 'country',
          message: 'Enter a phone number from one of the allowed countries',
        },
      });
    });

    it('should be disabled with its control', async () => {
      host.phone.disable();
      await render();

      expect(number().disabled).toBe(true);
      expect(countryButton().disabled).toBe(true);
    });
  });

  it('should have the ghost look, and a white country button on colour', async () => {
    await create();
    expect(number().classList).not.toContain('input-ghost');
    expect(countryButton().classList).toContain('status-basic');

    host.ghost.set(true);
    host.status.set('control');
    await render();
    expect(number().classList).toContain('input-ghost');
    expect(search().classList).toContain('input-ghost');
    expect(countryButton().classList).toContain('status-control');
  });

  it("should pad the number on the country button's side, in a right-to-left page too", async () => {
    await create();
    // The field is padded by the button's width, which a ResizeObserver reports before the next paint.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const wrapper = fixture.nativeElement.querySelector('[dir]') as HTMLElement;
    for (const dir of ['ltr', 'rtl']) {
      wrapper.setAttribute('dir', dir);
      const style = getComputedStyle(number());
      const button = countryButton().getBoundingClientRect();
      const field = number().getBoundingClientRect();
      const [buttonPadding, otherPadding] = [style.paddingLeft, style.paddingRight].map(parseFloat);
      const ltr = dir === 'ltr';
      expect(Math.abs(ltr ? button.left - field.left : button.right - field.right), dir).toBeLessThan(1);
      expect(ltr ? buttonPadding : otherPadding).toBeGreaterThanOrEqual(button.width);
      expect(ltr ? otherPadding : buttonPadding).toBeLessThan(button.width);
      // The number reads left to right from the left in both, while the button follows the page.
      expect(style.textAlign).toBe('left');
      expect(style.unicodeBidi).toBe('plaintext');
    }
  });

  it('should keep the country the app gives', async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(PhoneHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('nb-phone-input');
    host.country.set('GB');
    await render();
    await render();

    expect(host.country()).toBe('GB');
    expect(countryButton().getAttribute('aria-label')).toBe('Country: United Kingdom');
  });

  it('should take the country names and texts the app provides', async () => {
    await create([
      provideNbCountryNames({
        locale: 'sl',
        countries: { SI: 'Slovenija', HR: 'Hrvaška', AT: ['Republika Avstrija', 'Avstrija'] },
      }),
      provideNbTexts({ phoneInput: { country: (name) => `Država: ${name}`, search: 'Iskanje' } }),
    ]);
    host.country.set('AT');
    await render();

    expect(countryButton().getAttribute('aria-label')).toBe('Država: Republika Avstrija');

    await openSearch();
    expect(search().placeholder).toBe('Iskanje');
    expect(options()).toEqual(['Hrvaška', 'Republika Avstrija', 'Slovenija']);

    // By any of its names.
    await userEvent.type(search(), 'avstrija');
    await render();
    expect(options()).toEqual(['Republika Avstrija']);
  });
});

@Component({
  template: `
    <div class="nb-theme-default">
      <form>
        <nb-phone-input
          name="phone"
          [(ngModel)]="phone"
          nbPhoneNumber
          [nbPhoneNumberCountries]="['US', 'CA']"
          nbValidation
          #validation="nbValidation"
        />
        <nb-validation-errors [for]="validation" />
      </form>
      <button class="after">After</button>
    </div>
  `,
  styleUrl: '../../styles/spec-theme.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbPhoneInputComponent, NbPhoneNumberValidatorDirective, FormsModule, NbValidationModule],
})
class TemplateDrivenHostComponent {
  phone: string | null = '+12015550123';
}

@Component({
  template: `
    <div class="nb-theme-default">
      <nb-phone-input [formField]="contact.phone" nbValidation #validation="nbValidation" />
      <nb-validation-errors [for]="validation" />
      <button class="after">After</button>
    </div>
  `,
  styleUrl: '../../styles/spec-theme.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbPhoneInputComponent, FormField, NbValidationModule],
})
class SignalFormsHostComponent {
  readonly model = signal<{ phone: string | null }>({ phone: '+12015550123' });
  readonly contact = form(this.model, (path) => {
    nbPhoneNumber(path.phone, { countries: ['US', 'CA'] });
  });
}

@Component({
  template: `
    <div class="nb-theme-default">
      <nb-phone-input [formField]="contact.phone" [countries]="['US', 'CA']" nbValidation #validation="nbValidation" />
      <nb-validation-errors [for]="validation" />
      <button class="after">After</button>
    </div>
  `,
  styleUrl: '../../styles/spec-theme.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbPhoneInputComponent, FormField, NbValidationModule],
})
class SignalFormsCountriesHostComponent {
  readonly model = signal<{ phone: string | null }>({ phone: '+12015550123' });
  readonly contact = form(this.model);
}

describe('NbPhoneInputComponent in other forms', () => {
  let fixture: ComponentFixture<unknown>;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const number = () => fixture.nativeElement.querySelector('input[type="tel"]') as HTMLInputElement;
  const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim();
  const retype = async (text: string) => {
    // Replaces the text at once, without first emptying the field, which would empty the value.
    await userEvent.fill(number(), text);
    await userEvent.click(fixture.nativeElement.querySelector('.after'));
    await render();
  };

  const create = async (host: new () => unknown) => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: LOCALE_ID, useValue: 'en-US' }],
    });
    fixture = TestBed.createComponent(host);
    await render();
    await render();
  };

  afterEach(() => fixture.destroy());

  it('should work with ngModel and the nbPhoneNumber attribute', async () => {
    await create(TemplateDrivenHostComponent);
    const host = fixture.componentInstance as TemplateDrivenHostComponent;
    expect(number().value).toBe('(201) 555-0123');

    await retype('(201) 555-01');
    expect(host.phone).toBe('+12015550123');
    expect(errors()).toBe('Enter a valid phone number');

    await retype('+44 7400 123456');
    expect(host.phone).toBe('+447400123456');
    expect(errors()).toBe('Enter a phone number from one of the allowed countries');

    await retype('+1 416 555 0199');
    expect(host.phone).toBe('+14165550199');
    expect(errors()).toBe('');
  });

  it('should work with signal forms and the nbPhoneNumber rule', async () => {
    await create(SignalFormsHostComponent);
    const host = fixture.componentInstance as SignalFormsHostComponent;
    expect(number().value).toBe('(201) 555-0123');

    await retype('(201) 555-01');
    // Only the control's parse error: the rule sees the last valid number.
    expect(host.model().phone).toBe('+12015550123');
    expect(host.contact.phone().errors().map((error) => error.kind)).toEqual(['nbPhoneNumber']);
    expect(errors()).toBe('Enter a valid phone number');

    await retype('+44 7400 123456');
    expect(host.model().phone).toBe('+447400123456');
    expect(errors()).toBe('Enter a phone number from one of the allowed countries');

    await retype('+1 416 555 0199');
    expect(host.contact.phone().valid()).toBe(true);
    expect(errors()).toBe('');
  });

  it('should check its own countries in signal forms, after every change', async () => {
    await create(SignalFormsCountriesHostComponent);
    const host = fixture.componentInstance as SignalFormsCountriesHostComponent;

    await retype('+44 7400 123456');
    expect(host.model().phone).toBe('+447400123456');
    expect(errors()).toBe('Enter a phone number from one of the allowed countries');

    await retype('+1 416 555 0199');
    expect(errors()).toBe('');
  });
});
