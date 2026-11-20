import { assert } from 'vitest';
import {
  ApplicationRef,
  Component,
  input as signalInput,
  createComponent,
  createEnvironmentInjector,
  EnvironmentInjector,
  importProvidersFrom,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs/operators';
import {
  NbDatepickerDirective,
  NbTimepickerModule,
  NbDateTimePickerComponent,
  NbDatepickerModule,
  NbThemeModule,
  NbLayoutModule,
  NbDatepickerComponent,
  NbRangepickerComponent,
  NbValidationModule,
} from '@liquid-js/lyr-core';
import { RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';

function query(root: ParentNode, selector: string) {
  const el = root.querySelector(selector);
  assert(el, `${selector} not rendered`);
  return el;
}

@Component({
  selector: 'nb-datepicker-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <input [nbDatepicker]="datepicker" />
        <nb-datepicker #datepicker [dayCellComponent]="dayCellComponent()" />
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, RouterModule, NbDatepickerModule, NbTimepickerModule],
})
export class NbDatepickerTestComponent {
  readonly dayCellComponent = signal<any>(undefined);
  readonly datepicker = viewChild.required(NbDatepickerComponent);
  readonly datepickerDirective = viewChild.required(NbDatepickerDirective);
}

@Component({
  selector: 'nb-rangepicker-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <input [nbDatepicker]="rangepicker" />
        <nb-rangepicker #rangepicker />
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, RouterModule, NbDatepickerModule, NbTimepickerModule],
})
export class NbRangepickerTestComponent {
  readonly rangepicker = viewChild.required(NbRangepickerComponent);
  readonly datepickerDirective = viewChild.required(NbDatepickerDirective);
}

@Component({
  selector: 'nb-date-timepicker-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <input [nbDatepicker]="rangepicker" />
        <nb-date-timepicker #rangepicker />
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, RouterModule, NbDatepickerModule, NbTimepickerModule],
})
export class NbDateTimepickerTestComponent {
  readonly dateTimepicker = viewChild.required(NbDateTimePickerComponent);
  readonly datepickerDirective = viewChild.required(NbDatepickerDirective);
}

@Component({
  selector: 'nb-datepicker-custom-day-cell',
  template: `<div class="custom-day-cell">{{ date()?.getDate() }}</div>`,
})
export class NbDatepickerCustomDayCellComponent {
  date = signalInput<Date>();
  selectedValue = signalInput<Date>();
  visibleDate = signalInput<Date>();
  min = signalInput<Date>();
  max = signalInput<Date>();
  filter = signalInput<(date: Date) => boolean>();
  size = signalInput<string>();
  readonly select = output<Date>();
}

describe('nb-datepicker', () => {
  let fixture: ComponentFixture<NbDatepickerTestComponent>;
  let appRef: ApplicationRef;
  let datepicker: NbDatepickerComponent<Date>;
  let datepickerDirective: NbDatepickerDirective<Date>;
  let overlay: HTMLElement;
  let input: HTMLInputElement;

  const showDatepicker = () => {
    datepicker.show();
    appRef.tick();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbDatepickerModule.forRoot(),
        NbDatepickerTestComponent,
      ],
    });

    fixture = TestBed.createComponent(NbDatepickerTestComponent);
    appRef = TestBed.inject(ApplicationRef);

    fixture.detectChanges();
  });

  beforeEach(() => {
    datepicker = fixture.componentInstance.datepicker();
    datepickerDirective = fixture.componentInstance.datepickerDirective();
    overlay = fixture.nativeElement.querySelector('nb-layout');
    input = fixture.nativeElement.querySelector('input');
  });

  it('should not throw when destroyed right after creation', () => {
    const picker = TestBed.createComponent(NbDatepickerComponent).componentInstance;
    expect(picker.ngOnDestroy.bind(picker)).not.toThrow();
  });

  it('should render calendar', () => {
    showDatepicker();
    const calendar = overlay.querySelector('nb-calendar');
    expect(calendar).toBeTruthy();
  });

  it('should not render overlay on load', () => {
    const datepickerContainer = overlay.querySelector('nb-datepicker-container');
    expect(datepickerContainer).toBeNull();
  });

  it('should render a custom day cell with signal inputs', () => {
    fixture.componentInstance.dayCellComponent.set(NbDatepickerCustomDayCellComponent);
    fixture.detectChanges();
    datepicker.visibleDate.set(new Date(2026, 1, 10));
    showDatepicker();

    const cells = Array.from<HTMLElement>(overlay.querySelectorAll('nb-calendar .custom-day-cell'));
    expect(cells.length).toBeGreaterThan(0);
    expect(cells.map((cell) => cell.textContent)).toContain('28');
    expect(overlay.querySelector('nb-calendar-day-cell')).toBeNull();
  });

  it('should render the visible date as soon as the picker opens', () => {
    datepicker.visibleDate.set(new Date(2026, 1, 10));
    datepicker.show();

    const title = query(overlay, 'nb-calendar-view-mode button').textContent;
    expect(title).toContain('2026');
    expect(title).toContain('Feb');
  });

  it('should render overlay lazily', () => {
    const datepickerContainer = overlay.querySelector('nb-datepicker-container');
    expect(datepickerContainer).toBeNull();
    showDatepicker();
    const calendar = overlay.querySelector('nb-calendar');
    expect(calendar).toBeTruthy();
  });

  it('should write selected date in the input', () => new Promise<void>((done) => {
    const date = new Date(2018, 8, 17);
    datepicker.visibleDate.set(date);
    showDatepicker();

    datepicker.date.subscribe((e) => {
      expect(e).toEqual(date);
      expect(input.value).toEqual('Sep 17, 2018');
      done();
    });

    const cell = overlay.querySelectorAll('.day-cell')[22]; // it's visible date cell
    cell.dispatchEvent(new Event('click'));
  }));

  it('should start from date typed into the input', () => {
    input.value = 'Sep 17, 2018';
    input.dispatchEvent(new Event('input'));
    showDatepicker();
    appRef.tick();

    const cell = query(overlay, '.day-cell.selected'); // it's input value date cell

    expect(cell.textContent).toContain('17');
  });

  it('should start from current date if input is empty', () => {
    showDatepicker();
    appRef.tick();
    expect(overlay.querySelector('.day-cell.today')).toBeDefined();
  });

  it('should start from current date if input value is invalid', () => {
    input.value = 'definitely not a date';
    input.dispatchEvent(new Event('input'));
    showDatepicker();
    appRef.tick();
    expect(overlay.querySelector('.day-cell.today')).toBeDefined();
  });

  it('should update visible date if input value changed', () => {
    const initialDate = new Date(2000, 0, 1);
    datepicker.visibleDate.set(initialDate);

    const date = 17;
    const month = 8;
    const year = 2018;
    input.value = 'Sep 17, 2018';
    input.dispatchEvent(new Event('input'));
    showDatepicker();
    appRef.tick();

    const visibleDate = datepicker.visibleDate();
    assert(visibleDate);
    expect(visibleDate.getDate()).toEqual(date);
    expect(visibleDate.getMonth()).toEqual(month);
    expect(visibleDate.getFullYear()).toEqual(year);
  });

  it('should be valid if empty', () => {
    expect(datepickerDirective.validate()).toBe(null);
  });

  it('should not be valid if empty contain incorrectly formatted date', () => {
    input.value = 'somecurruptedinput';
    input.dispatchEvent(new Event('input'));
    showDatepicker();

    expect(datepickerDirective.validate()).not.toBe(null);
  });

  describe('writeValue', () => {
    const invalidDate = new Date('');

    it('should leave the input empty and the calendar on the current month for an Invalid Date', () => {
      expect(() => datepickerDirective.writeValue(invalidDate)).not.toThrow();
      expect(input.value).toEqual('');

      showDatepicker();
      expect(datepicker.visibleDate()).toBeUndefined();
      expect(overlay.querySelector('.day-cell.today')).not.toBeNull();
    });

    it('should not throw when an Invalid Date is written while the picker is open', () => {
      showDatepicker();

      expect(() => {
        datepickerDirective.writeValue(invalidDate);
        appRef.tick();
      }).not.toThrow();

      expect(input.value).toEqual('');
      expect(overlay.querySelector('.day-cell.today')).not.toBeNull();
    });

    it('should not queue an Invalid Date written before the picker is ready', () => {
      const directive = datepickerDirective as any;
      directive.isDatepickerReady = false;

      datepickerDirective.writeValue(invalidDate);

      expect(directive.queue).toBeUndefined();
    });

    it('should queue a valid date written before the picker is ready', () => {
      const directive = datepickerDirective as any;
      const date = new Date(2018, 8, 17);
      directive.isDatepickerReady = false;

      datepickerDirective.writeValue(date);

      expect(directive.queue).toBe(date);
    });

    it('should write a valid date to the input and the picker', () => {
      const date = new Date(2018, 8, 17);
      showDatepicker();

      datepickerDirective.writeValue(date);

      expect(input.value).not.toEqual('');
      expect(datepicker.visibleDate()).toBe(date);
    });

    it('should clear the input for null', () => {
      datepickerDirective.writeValue(new Date(2018, 8, 17));

      datepickerDirective.writeValue(null);

      expect(input.value).toEqual('');
    });
  });
});

describe('nb-rangepicker', () => {
  let fixture: ComponentFixture<NbRangepickerTestComponent>;
  let appRef: ApplicationRef;
  let rangepicker: NbRangepickerComponent<Date>;
  let datepickerDirective: NbDatepickerDirective<Date>;
  let overlay: HTMLElement;
  let input: HTMLInputElement;

  const showRangepicker = () => {
    rangepicker.show();
    appRef.tick();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbDatepickerModule.forRoot(),
        NbRangepickerTestComponent,
      ],
    });

    fixture = TestBed.createComponent(NbRangepickerTestComponent);
    appRef = TestBed.inject(ApplicationRef);

    fixture.detectChanges();
  });

  beforeEach(() => {
    rangepicker = fixture.componentInstance.rangepicker();
    datepickerDirective = fixture.componentInstance.datepickerDirective();
    overlay = fixture.nativeElement.querySelector('nb-layout');
    input = fixture.nativeElement.querySelector('input');
  });

  it('should render calendar', () => {
    showRangepicker();
    const calendar = overlay.querySelector('nb-calendar-range');
    expect(calendar).toBeTruthy();
  });

  it('should not render overlay on load', () => {
    const datepickerContainer = overlay.querySelector('nb-datepicker-container');
    expect(datepickerContainer).toBeNull();
  });

  it('should render overlay lazily', () => {
    const datepickerContainer = overlay.querySelector('nb-datepicker-container');
    expect(datepickerContainer).toBeNull();
    showRangepicker();
    const calendar = overlay.querySelector('nb-calendar-range');
    expect(calendar).toBeTruthy();
  });

  it('should emit rangeChange when selected start date', () => new Promise<void>((done) => {
    rangepicker.visibleDate.set(new Date(2018, 8, 17));
    showRangepicker();

    rangepicker.range.subscribe((range) => {
      assert(range);
      expect(range.start.getFullYear()).toEqual(2018);
      expect(range.start.getMonth()).toEqual(8);
      expect(range.start.getDate()).toEqual(1);
      expect(range.end).not.toBeDefined();
      done();
    });

    // click on Sep 1
    const startCell = overlay.querySelectorAll('.day-cell')[6];
    (startCell as HTMLElement).click();

    fixture.detectChanges();
  }), 5000);

  it('should emit rangeChange when selected start and end dates', () => new Promise<void>((done) => {
    rangepicker.visibleDate.set(new Date(2018, 8, 17));
    showRangepicker();

    outputToObservable(rangepicker.range).pipe(skip(1)).subscribe((range) => {
      assert(range?.end);
      expect(range.start.getFullYear()).toEqual(2018);
      expect(range.end.getFullYear()).toEqual(2018);
      expect(range.start.getMonth()).toEqual(8);
      expect(range.end.getMonth()).toEqual(8);
      expect(range.start.getDate()).toEqual(1);
      expect(range.end.getDate()).toEqual(3);
      done();
    });

    // click on Sep 1
    const startCell = overlay.querySelectorAll('.day-cell')[6];
    (startCell as HTMLElement).click();
    // click on Sep 3
    const endCell = overlay.querySelectorAll('.day-cell')[8];
    (endCell as HTMLElement).click();

    fixture.detectChanges();
  }), 5000);

  it('should start from date typed into the input', () => {
    input.value = 'Sep 17, 2018 - Sep 19, 2018';
    input.dispatchEvent(new Event('input'));
    showRangepicker();
    appRef.tick();

    const startCell = query(overlay, '.day-cell.in-range.start');
    const endCell = query(overlay, '.day-cell.in-range.end');

    expect(startCell.textContent).toContain('17');
    expect(endCell.textContent).toContain('19');
  });

  it('should start from current date if input is empty', () => {
    showRangepicker();
    appRef.tick();
    expect(overlay.querySelector('.day-cell.today')).toBeDefined();
  });

  it('should start from current date if input value is invalid', () => {
    input.value = 'definitely not a date';
    input.dispatchEvent(new Event('input'));
    showRangepicker();
    appRef.tick();
    expect(overlay.querySelector('.day-cell.today')).toBeDefined();
  });

  it('should set visible date to start date if input value changed', () => {
    const initialDate = new Date(2000, 0, 1);
    rangepicker.visibleDate.set(initialDate);

    const date = 17;
    const month = 8;
    const year = 2018;
    input.value = 'Sep 17, 2018 - Sep 19, 2018';
    input.dispatchEvent(new Event('input'));
    appRef.tick();
    showRangepicker();

    const visibleDate = rangepicker.visibleDate();
    assert(visibleDate);
    expect(visibleDate.getDate()).toEqual(date);
    expect(visibleDate.getMonth()).toEqual(month);
    expect(visibleDate.getFullYear()).toEqual(year);
  });

  it('should be valid if empty', () => {
    expect(datepickerDirective.validate()).toBe(null);
  });

  it('should not be valid if empty contain incorrectly formatted date', () => {
    input.value = 'somecurruptedinput';
    input.dispatchEvent(new Event('input'));
    showRangepicker();

    expect(datepickerDirective.validate()).not.toBe(null);
  });
});

describe('nb-date-timepicker', () => {
  let fixture: ComponentFixture<NbDateTimepickerTestComponent>;
  let appRef: ApplicationRef;
  let dateTimepicker: NbDateTimePickerComponent<Date>;
  let overlay: HTMLElement;

  const showDatTimepicker = () => {
    dateTimepicker.show();
    appRef.tick();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbTimepickerModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDateTimepickerTestComponent,
      ],
    });

    fixture = TestBed.createComponent(NbDateTimepickerTestComponent);
    appRef = TestBed.inject(ApplicationRef);

    fixture.detectChanges();
  });

  beforeEach(() => {
    dateTimepicker = fixture.componentInstance.dateTimepicker();
    overlay = fixture.nativeElement.querySelector('nb-layout');
  });

  it('should render calendar', () => {
    showDatTimepicker();
    const calendar = overlay.querySelector('nb-calendar-with-time');
    expect(calendar).toBeTruthy();
  });

  it('should not render overlay on load', () => {
    const datepickerContainer = overlay.querySelector('nb-datepicker-container');
    expect(datepickerContainer).toBeNull();
  });

  it('should render overlay lazily', () => {
    const datepickerContainer = overlay.querySelector('nb-datepicker-container');
    expect(datepickerContainer).toBeNull();
    showDatTimepicker();
    const calendar = overlay.querySelector('nb-calendar-with-time');
    expect(calendar).toBeTruthy();
  });
});

@Component({
  selector: 'nb-rangepicker-validation-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <input [formControl]="control" [nbDatepicker]="rangepicker" />
        <nb-rangepicker #rangepicker [min]="min()" [max]="max()" />
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, ReactiveFormsModule, RouterModule, NbDatepickerModule, NbTimepickerModule],
})
export class NbRangepickerValidationTestComponent {
  control = new FormControl();
  readonly min = signal(new Date(2026, 0, 3));
  readonly max = signal(new Date(2026, 0, 20));
}

describe('nb-rangepicker validation', () => {
  let fixture: ComponentFixture<NbRangepickerValidationTestComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbDatepickerModule.forRoot(),
        ReactiveFormsModule,
        NbRangepickerValidationTestComponent,
      ],
    });
    fixture = TestBed.createComponent(NbRangepickerValidationTestComponent);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  const type = (value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  it('should report a range starting before min', () => {
    expect(() => type('Jan 1, 2026 - Jan 5, 2026')).not.toThrow();
    expect(fixture.componentInstance.control.errors).toEqual(
      expect.objectContaining({ nbDatepickerMin: expect.anything() }),
    );
  });

  it('should report a range ending after max', () => {
    type('Jan 5, 2026 - Jan 25, 2026');
    expect(fixture.componentInstance.control.errors).toEqual(
      expect.objectContaining({ nbDatepickerMax: expect.anything() }),
    );
  });

  it('should accept a date-only value on the min day when min has a time of day', () => {
    fixture.componentInstance.min.set(new Date(2026, 0, 5, 10, 0));
    fixture.detectChanges();
    type('Jan 5, 2026 - Jan 10, 2026');
    expect(fixture.componentInstance.control.errors).toBeNull();
  });

  it('should accept a range within min and max', () => {
    type('Jan 5, 2026 - Jan 10, 2026');
    expect(fixture.componentInstance.control.errors).toBeNull();
  });
});

// Standalone, so its date services live in the component's own environment injector, as with a lazy route.
@Component({
  selector: 'nb-datepicker-lazy-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <input [nbDatepicker]="datepicker" />
        <nb-datepicker #datepicker />
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbDatepickerModule],
})
export class NbDatepickerLazyTestComponent {
  readonly datepicker = viewChild.required(NbDatepickerComponent);
}

describe('nb-datepicker in a lazily provided module', () => {
  it('should render the calendar with date services provided only by that module', () => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), NbThemeModule.forRoot()],
    });
    const appRef = TestBed.inject(ApplicationRef);
    const lazyInjector = createEnvironmentInjector(
      [importProvidersFrom(NbDatepickerModule.forRoot())],
      TestBed.inject(EnvironmentInjector),
    );
    const hostElement = document.createElement('div');
    document.body.appendChild(hostElement);
    const ref = createComponent(NbDatepickerLazyTestComponent, { environmentInjector: lazyInjector, hostElement });
    appRef.attachView(ref.hostView);
    ref.changeDetectorRef.detectChanges();

    expect(() => {
      ref.instance.datepicker().show();
      appRef.tick();
    }).not.toThrow();
    expect(document.querySelector('nb-calendar')).toBeTruthy();

    ref.destroy();
    lazyInjector.destroy();
    hostElement.remove();
  });
});

const validationImports = [NbLayoutModule, RouterModule, NbDatepickerModule, NbValidationModule];
const first = new Date(2026, 0, 10);

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <form>
          <input [formControl]="control" [nbDatepicker]="picker" nbValidation #validation="nbValidation" />
          <nb-datepicker #picker [min]="min" />
          <nb-validation-errors [for]="validation" />
        </form>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [...validationImports, ReactiveFormsModule],
})
class NbDatepickerReactiveTestComponent {
  readonly min = new Date(2026, 0, 3);
  readonly control = new FormControl<Date | null>(first);
  value = () => this.control.value;
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <form>
          <input name="date" [(ngModel)]="date" [nbDatepicker]="picker" nbValidation #validation="nbValidation" />
          <nb-datepicker #picker [min]="min" />
          <nb-validation-errors [for]="validation" />
        </form>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [...validationImports, FormsModule],
})
class NbDatepickerTemplateDrivenTestComponent {
  readonly min = new Date(2026, 0, 3);
  date: Date | null = first;
  value = () => this.date;
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <form>
          <input [formField]="dates.date" [nbDatepicker]="picker" nbValidation #validation="nbValidation" />
          <nb-datepicker #picker [min]="min" />
          <nb-validation-errors [for]="validation" />
        </form>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [...validationImports, FormField],
})
class NbDatepickerSignalFormsTestComponent {
  readonly min = new Date(2026, 0, 3);
  readonly model = signal<{ date: Date | null }>({ date: first });
  readonly dates = form(this.model);
  value = () => this.model().date;
}

describe('nb-datepicker in forms', () => {
  const hosts = [
    ['reactive', NbDatepickerReactiveTestComponent],
    ['template-driven', NbDatepickerTemplateDrivenTestComponent],
    ['signal', NbDatepickerSignalFormsTestComponent],
  ] as const;

  for (const [name, host] of hosts) {
    it(`should keep the last date for text that isn't one, and check min, in ${name} forms`, async () => {
      TestBed.configureTestingModule({
        imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbDatepickerModule.forRoot(), host],
      });
      const fixture = TestBed.createComponent<{ value: () => Date | null }>(host);
      const render = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
      };
      await render();
      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      const errors = () => (fixture.nativeElement.querySelector('nb-validation-errors') as HTMLElement).textContent?.trim();
      const type = async (text: string) => {
        input.value = text;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        await render();
      };

      await type('next week');
      expect(fixture.componentInstance.value()).toEqual(first);
      expect(errors()).toBe('Enter a valid date');

      await type('Jan 2, 2026');
      expect(fixture.componentInstance.value()).toEqual(new Date(2026, 0, 2));
      expect(errors()).toBe('Pick a date on or after Jan 3, 2026');

      await type('Jan 5, 2026');
      expect(fixture.componentInstance.value()).toEqual(new Date(2026, 0, 5));
      expect(errors()).toBe('');
    });
  }
});

@Component({
  selector: 'nb-datepicker-form-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <input [nbDatepicker]="datepicker" [formControl]="control" />
        <nb-datepicker #datepicker [pickerMode]="mode()" />
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, RouterModule, NbDatepickerModule, ReactiveFormsModule],
})
class NbDatepickerFormTestComponent {
  readonly mode = signal<'date' | 'month' | 'year'>('date');
  readonly control = new FormControl<Date | null>(new Date(2027, 4, 15));
  readonly datepicker = viewChild.required(NbDatepickerComponent);
}

describe('nb-datepicker with a form value, and picker modes', () => {
  let fixture: ComponentFixture<NbDatepickerFormTestComponent>;
  let host: NbDatepickerFormTestComponent;
  let appRef: ApplicationRef;

  const input = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
  const header = () => document.querySelector('nb-calendar-view-mode')?.textContent?.trim();
  const create = (mode: 'date' | 'month' | 'year') => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDatepickerFormTestComponent,
      ],
    });
    fixture = TestBed.createComponent(NbDatepickerFormTestComponent);
    host = fixture.componentInstance;
    host.mode.set(mode);
    appRef = TestBed.inject(ApplicationRef);
    fixture.detectChanges();
  };
  const show = () => {
    host.datepicker().show();
    appRef.tick();
  };

  afterEach(() => {
    fixture.destroy();
    // The pickers of earlier tests stay in the overlay container otherwise.
    document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove());
  });

  it('should open on the form\'s value, not today', () => {
    create('date');
    show();
    expect(header()).toBe('May 2027');
    expect(document.querySelector('nb-calendar-day-cell.selected')?.textContent?.trim()).toBe('15');
  });

  it('should pick a month as its first day, in the month format', async () => {
    create('month');
    expect(input().value).toBe('2027-05');
    show();
    expect(header()).toBe('2027');
    expect(document.querySelector('nb-calendar-month-cell.selected')?.textContent?.trim()).toBe('May');

    (document.querySelectorAll('nb-calendar-month-cell')[7] as HTMLElement).click();
    appRef.tick();
    await fixture.whenStable();
    expect(host.control.value).toEqual(new Date(2027, 7, 1));
    expect(input().value).toBe('2027-08');
    expect(host.datepicker().isShown).toBe(false);
  });

  it('should take a typed month', () => {
    create('month');
    input().value = '2028-11';
    input().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.control.value).toEqual(new Date(2028, 10, 1));
  });

  it('should pick a year as its first day, with no other view to change to', async () => {
    create('year');
    expect(input().value).toBe('2027');
    show();
    expect(document.querySelector('nb-calendar-view-mode button')).toBeNull();
    expect(document.querySelector('nb-calendar-year-cell.selected')?.textContent?.trim()).toBe('2027');

    const cells = [...document.querySelectorAll('nb-calendar-year-cell')] as HTMLElement[];
    cells.find((cell) => cell.textContent?.trim() === '2025')?.click();
    appRef.tick();
    await fixture.whenStable();
    expect(host.control.value).toEqual(new Date(2025, 0, 1));
    expect(input().value).toBe('2025');
  });

  it('should change a month picker\'s view to the years and back to the months', async () => {
    create('month');
    show();
    const settle = async () => {
      await new Promise((resolve) => setTimeout(resolve));
      appRef.tick();
      await fixture.whenStable();
    };
    (document.querySelector('nb-calendar-view-mode button') as HTMLElement).click();
    await settle();
    expect(document.querySelector('nb-calendar-year-picker')).not.toBeNull();
    const cells = [...document.querySelectorAll('nb-calendar-year-cell')] as HTMLElement[];
    cells.find((cell) => cell.textContent?.trim() === '2025')?.click();
    await settle();
    expect(document.querySelector('nb-calendar-month-picker')).not.toBeNull();
    expect(header()).toBe('2025');
    // Picking a year in a month picker doesn't pick a date.
    expect(host.control.value).toEqual(new Date(2027, 4, 15));
  });
});
