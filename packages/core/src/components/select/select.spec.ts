import { assert } from 'vitest';
import {
  Component,
  ElementRef,
  input,
  viewChildren,
  viewChild,
  output,
  signal,
  Service,
  computed,
} from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { from, zip, Subject } from 'rxjs';

import {
  NbComponentSize,
  NbSelectModule,
  NbThemeModule,
  NbOverlayContainerAdapter,
  NB_DOCUMENT,
  NbSelectComponent,
  NbLayoutModule,
  NbOptionComponent,
  NbOptionGroupComponent,
  NbTriggerStrategyBuilderService,
  NbFocusKeyManagerFactoryService,
  NbViewportRulerAdapter,
  nbSelectSearchFn,
  provideNbTexts,
} from '@liquid-js/lyr-core';
import { DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';
import { RouterModule } from '@angular/router';

function query(root: ParentNode, selector: string) {
  const el = root.querySelector(selector);
  assert(el, `${selector} not rendered`);
  return el;
}

const eventMock = { preventDefault() {} } as Event;

const TEST_GROUPS = [
  {
    title: 'Group 1',
    options: [
      { title: 'Option 1', value: 'Option 1' },
      { title: 'Option 2', value: 'Option 2' },
      { title: 'Option 3', value: 'Option 3' },
    ],
  },
  {
    title: 'Group 2',
    options: [
      { title: 'Option 21', value: 'Option 21' },
      { title: 'Option 22', value: 'Option 22' },
      { title: 'Option 23', value: 'Option 23' },
    ],
  },
  {
    title: 'Group 3',
    options: [
      { title: 'Option 31', value: 'Option 31' },
      { title: 'Option 32', value: 'Option 32' },
      { title: 'Option 33', value: 'Option 33' },
    ],
  },
  {
    title: 'Group 4',
    options: [
      { title: 'Option 41', value: '' },
      { title: 'Option 42', value: '0' },
      { title: 'Option 43', value: 0 },
      { title: 'Option 44' },
    ],
  },
];

@Component({
  selector: 'nb-select-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select
          placeholder="This is test select component"
          [multiple]="multiple()"
          [selected]="selected()"
          (selectedChange)="selectedChange.emit($event)"
        >
          @if (!multiple() && customLabel()) {
            <nb-select-label>
              {{ selected().split('').reverse().join('') }}
            </nb-select-label>
          }
          <nb-option>None</nb-option>
          @for (group of groups; track group) {
            <nb-option-group [title]="group.title">
              @for (option of group.options; track option) {
                <nb-option [value]="option.value">{{ option.title }}</nb-option>
              }
            </nb-option-group>
          }
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [FormsModule, ReactiveFormsModule, NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbSelectTestComponent {
  readonly selected = signal<any>(null);
  readonly multiple = signal(false);
  readonly customLabel = signal(false);
  readonly selectedChange = output<any>();
  readonly options = viewChildren(NbOptionComponent);
  groups = TEST_GROUPS;
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select>
          <nb-option value="a">a</nb-option>
          <nb-option value="b">b</nb-option>
          <nb-option value="c">c</nb-option>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, RouterModule],
})
export class BasicSelectTestComponent {}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select [selected]="selected()" [compareWith]="compareFn()">
          @for (option of options(); track option) {
            <nb-option [value]="option">{{ option }}</nb-option>
          }
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [FormsModule, ReactiveFormsModule, NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbSelectWithOptionsObjectsComponent {
  readonly compareFn = input((o1: any, o2: any) => JSON.stringify(o1) === JSON.stringify(o2));
  readonly selected = signal({ id: 2 });
  readonly options = input([{ id: 1 }, { id: 2 }, { id: 3 }]);

  readonly optionComponents = viewChildren(NbOptionComponent);
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select [selected]="selected()">
          @for (option of options(); track option) {
            <nb-option [value]="option">{{ option }}</nb-option>
          }
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [FormsModule, ReactiveFormsModule, NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbSelectWithInitiallySelectedOptionComponent {
  readonly selected = signal(1);
  readonly options = input([1, 2, 3]);
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        @if (showSelect()) {
          <nb-select [formControl]="formControl">
            @for (option of options(); track option) {
              <nb-option [value]="option">{{ option }}</nb-option>
            }
          </nb-select>
        }
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [FormsModule, ReactiveFormsModule, NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbReactiveFormSelectComponent {
  readonly options = signal<number[]>([1]);
  readonly showSelect = signal<boolean>(true);
  formControl: FormControl = new FormControl();

  readonly selectComponent = viewChild(NbSelectComponent);
  readonly optionComponents = viewChildren(NbOptionComponent);
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select [(ngModel)]="selectedValue">
          @for (option of options(); track option) {
            <nb-option [value]="option">{{ option }}</nb-option>
          }
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [FormsModule, ReactiveFormsModule, NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbNgModelSelectComponent {
  readonly options = signal<number[]>([1]);
  readonly selectedValue = signal<number | null>(null);

  readonly optionComponent = viewChild.required(NbOptionComponent);
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select>
          <nb-option>No value option</nb-option>
          <nb-option [value]="null">undefined value</nb-option>
          <nb-option [value]="undefined">undefined value</nb-option>
          <nb-option [value]="false">false value</nb-option>
          <nb-option [value]="0">0 value</nb-option>
          <nb-option [value]="''">empty string value</nb-option>
          <nb-option [value]="nanValue">NaN value</nb-option>
          <nb-option value="1">truthy value</nb-option>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbSelectWithFalsyOptionValuesComponent {
  nanValue = NaN;

  readonly options = viewChildren(NbOptionComponent);
  readonly optionElements = viewChildren(NbOptionComponent, { read: ElementRef });

  get noValueOption(): NbOptionComponent<any> {
    return this.options()[0];
  }
  get noValueOptionElement(): ElementRef<HTMLElement> {
    return this.optionElements()[0];
  }
  get nullOption(): NbOptionComponent<any> {
    return this.options()[1];
  }
  get nullOptionElement(): ElementRef<HTMLElement> {
    return this.optionElements()[1];
  }
  get undefinedOption(): NbOptionComponent<any> {
    return this.options()[2];
  }
  get undefinedOptionElement(): ElementRef<HTMLElement> {
    return this.optionElements()[2];
  }
  get falseOption(): NbOptionComponent<any> {
    return this.options()[3];
  }
  get falseOptionElement(): ElementRef<HTMLElement> {
    return this.optionElements()[3];
  }
  get zeroOption(): NbOptionComponent<any> {
    return this.options()[4];
  }
  get zeroOptionElement(): ElementRef<HTMLElement> {
    return this.optionElements()[4];
  }
  get emptyStringOption(): NbOptionComponent<any> {
    return this.options()[5];
  }
  get emptyStringOptionElement(): ElementRef<HTMLElement> {
    return this.optionElements()[5];
  }
  get nanOption(): NbOptionComponent<any> {
    return this.options()[6];
  }
  get nanOptionElement(): ElementRef<HTMLElement> {
    return this.optionElements()[6];
  }
  get truthyOption(): NbOptionComponent<any> {
    return this.options()[7];
  }
  get truthyOptionElement(): ElementRef<HTMLElement> {
    return this.optionElements()[7];
  }
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select multiple>
          <nb-option>No value option</nb-option>
          <nb-option [value]="null">undefined value</nb-option>
          <nb-option [value]="undefined">undefined value</nb-option>
          <nb-option [value]="false">false value</nb-option>
          <nb-option [value]="0">0 value</nb-option>
          <nb-option [value]="''">empty string value</nb-option>
          <nb-option [value]="nanValue">NaN value</nb-option>
          <nb-option value="1">truthy value</nb-option>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbMultipleSelectWithFalsyOptionValuesComponent extends NbSelectWithFalsyOptionValuesComponent {}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select multiple [size]="size()">
          <nb-option value="a">A</nb-option>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbSizedMultipleSelectComponent {
  readonly size = signal<NbComponentSize>('small');
}

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select>
          <nb-option-group [disabled]="optionGroupDisabled()">
            <nb-option [value]="1" [disabled]="optionDisabled()">1</nb-option>
          </nb-option-group>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, RouterModule],
})
export class NbOptionDisabledTestComponent {
  readonly optionGroupDisabled = signal(false);
  readonly optionDisabled = signal(false);

  readonly selectComponent = viewChild.required(NbSelectComponent);
  readonly optionGroupComponent = viewChild.required(NbOptionGroupComponent);
  readonly optionComponent = viewChild.required(NbOptionComponent);
}

describe('Component: NbSelectComponent', () => {
  let fixture: ComponentFixture<NbSelectTestComponent>;
  let overlayContainerService: NbOverlayContainerAdapter;
  let overlayContainer: HTMLElement;
  let document: Document;
  let select: NbSelectComponent;

  const setSelectedAndOpen = (selected: unknown) => {
    fixture.componentInstance.selected.set(selected);
    fixture.detectChanges();
    select.show();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        NbSelectTestComponent,
        NbSelectWithOptionsObjectsComponent,
        NbSelectWithInitiallySelectedOptionComponent,
        NbReactiveFormSelectComponent,
        NbNgModelSelectComponent,
      ],
    });

    fixture = TestBed.createComponent(NbSelectTestComponent);
    overlayContainerService = TestBed.inject(NbOverlayContainerAdapter);
    document = TestBed.inject(NB_DOCUMENT);
    select = fixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;

    overlayContainer = document.createElement('div');
    overlayContainerService.setContainer(overlayContainer);

    fixture.detectChanges();
  });

  afterEach(() => {
    select.hide();
    overlayContainerService.clearContainer();
  });

  it('should render passed item as selected', () => {
    setSelectedAndOpen('Option 23');
    const selected = query(overlayContainer, 'nb-option.selected');

    expect(selected).toBeTruthy();
    expect(selected.textContent).toContain('Option 23');
  });

  it('should render passed items as selected', () => {
    fixture.componentInstance.multiple.set(true);
    setSelectedAndOpen(['Option 1', 'Option 21', 'Option 31']);
    const selected = overlayContainer.querySelectorAll('nb-option.selected');

    expect(selected.length).toBe(3);
    expect(selected[0].textContent).toContain('Option 1');
    expect(selected[1].textContent).toContain('Option 21');
    expect(selected[2].textContent).toContain('Option 31');
  });

  it('should fire selectedChange item when selection changes', () => new Promise<void>((done) => {
    setSelectedAndOpen('Option 1');

    fixture.componentInstance.selectedChange.subscribe((selection) => {
      expect(selection).toBe('Option 21');
      done();
    });

    const option = overlayContainer.querySelectorAll('nb-option')[4];
    option.dispatchEvent(new Event('click'));
  }));

  it('should fire selectedChange items when selecting multiple one by one', () => new Promise<void>((done) => {
    fixture.componentInstance.multiple.set(true);
    setSelectedAndOpen([]);

    zip(
      from([['Option 2'], ['Option 2', 'Option 21'], ['Option 2', 'Option 21', 'Option 23']]),
      outputToObservable(fixture.componentInstance.selectedChange),
    ).subscribe({ next: ([expected, real]) => expect(real).toEqual(expected), complete: done });

    const option1 = overlayContainer.querySelectorAll('nb-option')[2];
    const option2 = overlayContainer.querySelectorAll('nb-option')[4];
    const option3 = overlayContainer.querySelectorAll('nb-option')[6];
    option1.dispatchEvent(new Event('click'));
    option2.dispatchEvent(new Event('click'));
    option3.dispatchEvent(new Event('click'));
  }));

  it('should deselect item when clicking on reselect item', () => {
    setSelectedAndOpen('Option 1');

    const option = query(overlayContainer, 'nb-option');
    option.dispatchEvent(new Event('click'));

    expect(overlayContainer.querySelectorAll('nb-option.selected').length).toBe(0);
  });

  it('should deselect all items when clicking on reset item in multiple select', () => {
    fixture.componentInstance.multiple.set(true);
    setSelectedAndOpen(['Option 1', 'Option 2']);

    const option = query(overlayContainer, 'nb-option');
    option.dispatchEvent(new Event('click'));

    expect(overlayContainer.querySelectorAll('nb-option.selected').length).toBe(0);
  });

  it('should emit selectionChange with empty array when reset option selected in multiple select', () => {
    fixture.componentInstance.multiple.set(true);
    setSelectedAndOpen(['Option 1', 'Option 2']);

    const selectionChangeSpy = vi.fn();
    select.selectedChange.subscribe(selectionChangeSpy);

    const option = query(overlayContainer, 'nb-option');
    option.dispatchEvent(new Event('click'));

    expect(selectionChangeSpy).toHaveBeenCalledWith([]);
  });

  it('should emit selectionChange with null when reset option selected in single select', () => {
    setSelectedAndOpen('Option 1');

    const selectionChangeSpy = vi.fn();
    select.selectedChange.subscribe(selectionChangeSpy);

    const option = query(overlayContainer, 'nb-option');
    option.dispatchEvent(new Event('click'));

    expect(selectionChangeSpy).toHaveBeenCalledWith(null);
  });

  it('should deselect only clicked item in multiple select', () => {
    fixture.componentInstance.multiple.set(true);
    setSelectedAndOpen(['Option 1', 'Option 2']);

    const option = overlayContainer.querySelectorAll('nb-option')[1];
    option.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const selected = overlayContainer.querySelectorAll('nb-option.selected');
    expect(selected.length).toBe(1);
    expect(selected[0].textContent).toContain('Option 2');
  });

  it('should render placeholder when nothing selected', () => {
    fixture.componentInstance.multiple.set(true);
    setSelectedAndOpen([]);

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('This is test select component');
    // The label takes its own direction, without changing how it's aligned in the button.
    expect(button.querySelector('[dir="auto"]')?.textContent).toEqual('This is test select component');
  });

  it('should render default label when something selected', () => {
    setSelectedAndOpen('Option 1');

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Option 1');
    expect(button.querySelector('[dir="auto"]')?.textContent).toEqual('Option 1');
  });

  it('should render custom label when something selected and custom label provided', async () => {
    fixture.componentInstance.customLabel.set(true);
    fixture.componentInstance.selected.set('Option 1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('1 noitpO');
  });

  it('should select initially specified value without errors', async () => {
    vi.useFakeTimers();
    const selectFixture = TestBed.createComponent(NbSelectWithInitiallySelectedOptionComponent);
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();
    selectFixture.detectChanges();

    const selectedOption = selectFixture.debugElement
      .query(By.directive(NbSelectComponent))
      .componentInstance.options().find((o: NbOptionComponent) => o.selected());

    expect(selectedOption.value()).toEqual(selectFixture.componentInstance.selected());
    const selectButton = selectFixture.nativeElement.querySelector('nb-select button') as HTMLElement;
    expect(selectButton.textContent).toEqual(selectedOption.value().toString());
  });

  it('should use compareWith function to compare values', async () => {
    vi.useFakeTimers();
    const selectFixture = TestBed.createComponent(NbSelectWithOptionsObjectsComponent);
    const testComponent = selectFixture.componentInstance;
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();
    selectFixture.detectChanges();

    const selectedOption = testComponent.optionComponents().find((o) => o.selected());
    assert(selectedOption, 'no option is selected');
    expect(selectedOption.value()).toEqual({ id: 2 });
  });

  it('should ignore selection change if destroyed', async () => {
    vi.useFakeTimers();
    const selectFixture = TestBed.createComponent(NbReactiveFormSelectComponent);
    const testSelectComponent = selectFixture.componentInstance;
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();

    const setSelectionSpy = vi.spyOn(testSelectComponent.selectComponent() as any, 'setSelection');
    testSelectComponent.showSelect.set(false);
    selectFixture.detectChanges();

    expect(() => testSelectComponent.formControl.setValue(1)).not.toThrow();
    expect(setSelectionSpy).not.toHaveBeenCalled();
  });

  it('should select option set through formControl binding', async () => {
    vi.useFakeTimers();
    const selectFixture = TestBed.createComponent(NbReactiveFormSelectComponent);
    const testComponent = selectFixture.componentInstance;
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();

    const option = testComponent.optionComponents().at(0);
    assert(option);
    const optionSelectSpy = vi.spyOn(option, 'select');

    expect(option.selected()).toEqual(false);

    testComponent.formControl.setValue(1);
    selectFixture.detectChanges();

    expect(option.selected()).toEqual(true);
    expect(optionSelectSpy).toHaveBeenCalledTimes(1);
  });

  it('should select option set through select "selected" binding', async () => {
    vi.useFakeTimers();
    const selectFixture = TestBed.createComponent(NbSelectTestComponent);
    const testComponent = selectFixture.componentInstance;
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();

    const optionToSelect = testComponent.options().find((o) => o.value() != null);
    assert(optionToSelect);
    const optionSelectSpy = vi.spyOn(optionToSelect, 'select');

    expect(optionToSelect.selected()).toEqual(false);

    testComponent.selected.set(optionToSelect.value());
    selectFixture.detectChanges();

    expect(optionToSelect.selected()).toEqual(true);
    expect(optionSelectSpy).toHaveBeenCalledTimes(1);
  });

  it('should select option set through ngModel binding', async () => {
    vi.useFakeTimers();
    const selectFixture = TestBed.createComponent(NbNgModelSelectComponent);
    const testComponent = selectFixture.componentInstance;
    selectFixture.detectChanges();

    const optionToSelect = testComponent.optionComponent();
    const optionSelectSpy = vi.spyOn(optionToSelect, 'select');

    expect(optionToSelect.selected()).toEqual(false);

    testComponent.selectedValue.set(optionToSelect.value());
    selectFixture.detectChanges();
    // need to call flush because NgModelDirective updates value on
    // resolvedPromise.then
    await vi.runAllTimersAsync();
    selectFixture.detectChanges();

    expect(optionToSelect.selected()).toEqual(true);
    expect(optionSelectSpy).toHaveBeenCalledTimes(1);
  });

  it('should unselect previously selected option', async () => {
    vi.useFakeTimers();
    const selectFixture = TestBed.createComponent(NbSelectTestComponent);
    const testSelectComponent = selectFixture.componentInstance;
    testSelectComponent.selected.set(TEST_GROUPS[0].options[0].value);
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();
    selectFixture.detectChanges();

    const selectedOption = testSelectComponent.options().find((o) => o.selected());
    assert(selectedOption, 'no option is selected');
    const selectionChangeSpy = vi.fn();
    selectedOption.selectionChange.subscribe(selectionChangeSpy);

    testSelectComponent.selected.set(TEST_GROUPS[0].options[1].value);
    selectFixture.detectChanges();

    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
    expect(selectedOption.selected()).toEqual(false);
  });

  it('should not deselect option if option stays selected', async () => {
    vi.useFakeTimers();
    const selectFixture = TestBed.createComponent(NbSelectTestComponent);
    const testSelectComponent = selectFixture.componentInstance;
    testSelectComponent.selected.set(TEST_GROUPS[0].options[0].value);
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();
    selectFixture.detectChanges();

    const selectedOption = testSelectComponent.options().find((o) => o.selected());
    assert(selectedOption, 'no option is selected');
    const selectionChangeSpy = vi.spyOn(selectedOption, 'deselect').mockImplementation(() => undefined);

    testSelectComponent.selected.set(selectedOption.value());
    selectFixture.detectChanges();

    expect(selectionChangeSpy).not.toHaveBeenCalled();
  });

  it(`should not call dispose on uninitialized resources`, () => {
    // Destroyed before the first change detection, so nothing it creates after view init exists yet.
    const selectComponent = TestBed.createComponent(NbSelectComponent).componentInstance;
    expect(() => selectComponent.ngOnDestroy()).not.toThrow();
  });

  it(`should has 'empty' class when has no placeholder and text`, () => {
    const selectFixture = TestBed.createComponent(NbSelectComponent);
    selectFixture.detectChanges();
    const button = selectFixture.debugElement.query(By.css('button'));

    expect(button.classes['empty']).toEqual(true);
  });

  it(`should set overlay width same as button inside select`, () => {
    const selectFixture = TestBed.createComponent(NbSelectComponent);
    const selectComponent = selectFixture.componentInstance;
    selectFixture.detectChanges();

    const selectElement: HTMLElement = selectFixture.nativeElement;
    const buttonElement = selectElement.querySelector('button');
    assert(buttonElement);

    selectElement.style.padding = '1px';

    expect(selectComponent.hostWidth).not.toEqual(selectElement.offsetWidth);
    expect(selectComponent.hostWidth).toEqual(buttonElement.offsetWidth);
  });

  it('should not open when disabled and button clicked', async () => {
    const selectFixture = TestBed.createComponent(NbSelectComponent);
    selectFixture.componentRef.setInput('disabled', true);
    selectFixture.detectChanges();
    const selectButton: HTMLElement = selectFixture.debugElement.query(By.css('button')).nativeElement;

    selectButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(selectFixture.componentInstance.isOpen()).toBeFalsy();
  });

  it('should not open when disabled and toggle icon clicked', async () => {
    const selectFixture = TestBed.createComponent(NbSelectComponent);
    selectFixture.componentRef.setInput('disabled', true);
    selectFixture.detectChanges();
    const selectToggleIcon: HTMLElement = selectFixture.debugElement.query(By.css('nb-icon')).nativeElement;

    selectToggleIcon.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(selectFixture.componentInstance.isOpen()).toBeFalsy();
  });

  it('should mark touched when select button loose focus and select closed', async () => {
    vi.useFakeTimers();
    const touchedSpy = vi.fn();

    const selectFixture = TestBed.createComponent(NbSelectComponent);
    const selectComponent: NbSelectComponent = selectFixture.componentInstance;
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();

    selectComponent.registerOnTouched(touchedSpy);
    selectFixture.debugElement.query(By.css('.select-button')).triggerEventHandler('blur', {});
    expect(touchedSpy).toHaveBeenCalledTimes(1);
  });

  it('should not mark touched when select button loose focus and select open', async () => {
    vi.useFakeTimers();
    const touchedSpy = vi.fn();

    const selectFixture = TestBed.createComponent(NbSelectTestComponent);
    select = selectFixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;
    selectFixture.detectChanges();
    await vi.runAllTimersAsync();

    select.registerOnTouched(touchedSpy);
    select.show();
    selectFixture.debugElement.query(By.css('.select-button')).triggerEventHandler('blur', {});
    expect(touchedSpy).not.toHaveBeenCalled();
  });
});

describe('NbSelectComponent - falsy values', () => {
  let fixture: ComponentFixture<NbSelectWithFalsyOptionValuesComponent>;
  let testComponent: NbSelectWithFalsyOptionValuesComponent;
  let select: NbSelectComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        NbSelectWithFalsyOptionValuesComponent,
        NbMultipleSelectWithFalsyOptionValuesComponent,
      ],
    });

    fixture = TestBed.createComponent(NbSelectWithFalsyOptionValuesComponent);
    testComponent = fixture.componentInstance;
    select = fixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should clean selection when selected option does not have a value', () => {
    select.writeValue(testComponent.truthyOption.value());
    fixture.detectChanges();

    testComponent.noValueOption.onClick(eventMock);
    fixture.detectChanges();

    expect(select.selectionModel().length).toEqual(0);
  });

  it('should clean selection when selected option has null value', () => {
    select.writeValue(testComponent.truthyOption.value());
    fixture.detectChanges();

    testComponent.nullOption.onClick(eventMock);
    fixture.detectChanges();

    expect(select.selectionModel().length).toEqual(0);
  });

  it('should clean selection when selected option has undefined value', () => {
    select.writeValue(testComponent.truthyOption.value());
    fixture.detectChanges();

    testComponent.undefinedOption.onClick(eventMock);
    fixture.detectChanges();

    expect(select.selectionModel().length).toEqual(0);
  });

  it('should not reset selection when selected option has false value', () => {
    select.writeValue(testComponent.truthyOption.value());
    fixture.detectChanges();

    testComponent.falseOption.onClick(eventMock);
    fixture.detectChanges();

    expect(select.selectionModel().length).toEqual(1);
  });

  it('should not reset selection when selected option has zero value', () => {
    select.writeValue(testComponent.truthyOption.value());
    fixture.detectChanges();

    testComponent.zeroOption.onClick(eventMock);
    fixture.detectChanges();

    expect(select.selectionModel().length).toEqual(1);
  });

  it('should not reset selection when selected option has empty string value', () => {
    select.writeValue(testComponent.truthyOption.value());
    fixture.detectChanges();

    testComponent.emptyStringOption.onClick(eventMock);
    fixture.detectChanges();

    expect(select.selectionModel().length).toEqual(1);
  });

  it('should not reset selection when selected option has NaN value', () => {
    select.writeValue(testComponent.truthyOption.value());
    fixture.detectChanges();

    testComponent.nanOption.onClick(eventMock);
    fixture.detectChanges();

    expect(select.selectionModel().length).toEqual(1);
  });

  it('should set class if fullWidth input set to true', () => {
    const selectFixture = TestBed.createComponent(NbSelectComponent);
    selectFixture.componentRef.setInput('fullWidth', true);
    selectFixture.detectChanges();

    expect(selectFixture.nativeElement.classList).toContain('full-width');
  });

  describe('multiple', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(NbMultipleSelectWithFalsyOptionValuesComponent);
      testComponent = fixture.componentInstance;
      select = fixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;

      fixture.detectChanges();
      await fixture.whenStable();
      select.show();
      fixture.detectChanges();
    });

    it('should not render checkbox on options with reset values', () => {
      expect(testComponent.noValueOptionElement.nativeElement.querySelector('nb-checkbox')).toEqual(null);
      expect(testComponent.nullOptionElement.nativeElement.querySelector('nb-checkbox')).toEqual(null);
      expect(testComponent.undefinedOptionElement.nativeElement.querySelector('nb-checkbox')).toEqual(null);
    });

    it('should render checkbox on options with falsy non-reset values', () => {
      expect(testComponent.falseOptionElement.nativeElement.querySelector('nb-checkbox')).not.toEqual(null);
      expect(testComponent.zeroOptionElement.nativeElement.querySelector('nb-checkbox')).not.toEqual(null);
      expect(testComponent.emptyStringOptionElement.nativeElement.querySelector('nb-checkbox')).not.toEqual(null);
      expect(testComponent.nanOptionElement.nativeElement.querySelector('nb-checkbox')).not.toEqual(null);
      expect(testComponent.truthyOptionElement.nativeElement.querySelector('nb-checkbox')).not.toEqual(null);
    });
  });

  it("should size the options' checkboxes as the select", async () => {
    const sizedFixture = TestBed.createComponent(NbSizedMultipleSelectComponent);
    sizedFixture.detectChanges();
    await sizedFixture.whenStable();
    sizedFixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance.show();
    sizedFixture.detectChanges();
    const checkbox = () => document.querySelector('nb-option nb-checkbox') as HTMLElement;

    expect(checkbox().classList).toContain('size-small');

    sizedFixture.componentInstance.size.set('giant');
    sizedFixture.detectChanges();
    expect(checkbox().classList).toContain('size-giant');
  });

  it('should select initial falsy value', async () => {
    fixture = TestBed.createComponent(NbSelectWithFalsyOptionValuesComponent);
    testComponent = fixture.componentInstance;
    select = fixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;

    select.writeValue('');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(select.selectionModel()[0]).toEqual(testComponent.emptyStringOption);
    expect(testComponent.emptyStringOption.selected()).toEqual(true);
  });
});

describe('NbSelectComponent - Triggers', () => {
  let fixture: ComponentFixture<BasicSelectTestComponent>;
  let selectComponent: NbSelectComponent;
  let triggerBuilderStub;
  let showTriggerStub: Subject<Event>;
  let hideTriggerStub: Subject<Event>;

  beforeEach(async () => {
    showTriggerStub = new Subject<Event>();
    hideTriggerStub = new Subject<Event>();
    triggerBuilderStub = {
      trigger() {
        return this;
      },
      host() {
        return this;
      },
      container() {
        return this;
      },
      build() {
        return { show$: showTriggerStub, hide$: hideTriggerStub, destroy() {} };
      },
    };

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        BasicSelectTestComponent,
      ],
    });
    TestBed.overrideProvider(NbTriggerStrategyBuilderService, { useValue: triggerBuilderStub });

    fixture = TestBed.createComponent(BasicSelectTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    selectComponent = fixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;
  });

  it('should mark touched if clicked outside of overlay and select', () => {
    const touchedSpy = vi.fn();
    selectComponent.registerOnTouched(touchedSpy);

    const elementOutsideSelect = fixture.debugElement.query(By.css('nb-layout')).nativeElement;
    selectComponent.show();
    fixture.detectChanges();

    hideTriggerStub.next({ target: elementOutsideSelect } as unknown as Event);

    expect(touchedSpy).toHaveBeenCalledTimes(1);
  });

  it('should not mark touched if clicked on the select button', () => {
    const touchedSpy = vi.fn();
    selectComponent.registerOnTouched(touchedSpy);

    const selectButton = fixture.debugElement.query(By.css('.select-button')).nativeElement;
    selectComponent.show();
    fixture.detectChanges();

    hideTriggerStub.next({ target: selectButton } as unknown as Event);

    expect(touchedSpy).not.toHaveBeenCalled();
  });
});

describe('NbSelectComponent - Key manager', () => {
  let fixture: ComponentFixture<BasicSelectTestComponent>;
  let selectComponent: NbSelectComponent;
  let tabOutStub: Subject<void>;
  let keyManagerFactoryStub;
  let keyManagerStub: object;

  beforeEach(async () => {
    tabOutStub = new Subject<void>();
    keyManagerStub = {
      withTypeAhead() {
        return this;
      },
      withHomeAndEnd() {
        return this;
      },
      withPageUpDown() {
        return this;
      },
      skipPredicate() {
        return this;
      },
      setActiveItem() {},
      setFirstItemActive() {},
      onKeydown() {},
      tabOut: tabOutStub,
    };
    keyManagerFactoryStub = {
      create() {
        return keyManagerStub;
      },
    };

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        BasicSelectTestComponent,
      ],
    });
    TestBed.overrideProvider(NbFocusKeyManagerFactoryService, { useValue: keyManagerFactoryStub });

    fixture = TestBed.createComponent(BasicSelectTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    selectComponent = fixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;
  });

  it('should mark touched when tabbing out from options list', async () => {
    selectComponent.show();
    fixture.detectChanges();

    const touchedSpy = vi.fn();
    selectComponent.registerOnTouched(touchedSpy);
    tabOutStub.next();
    await fixture.whenStable();
    expect(touchedSpy).toHaveBeenCalledTimes(1);
  });
});

describe('NbOptionComponent', () => {
  let fixture: ComponentFixture<NbReactiveFormSelectComponent>;
  let testSelectComponent: NbReactiveFormSelectComponent;
  let option: NbOptionComponent<number>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        NbNgModelSelectComponent, NbSelectTestComponent, NbReactiveFormSelectComponent,
      ],
    });

    fixture = TestBed.createComponent(NbReactiveFormSelectComponent);
    testSelectComponent = fixture.componentInstance;
    fixture.detectChanges();
    const firstOption = testSelectComponent.optionComponents().at(0);
    assert(firstOption);
    option = firstOption;
  });

  it('should ignore selection change if destroyed', () => {
    const selectionChangeSpy = vi.fn();
    option.selectionChange.subscribe(selectionChangeSpy);

    expect(option.selected()).toEqual(false);
    testSelectComponent.showSelect.set(false);
    fixture.detectChanges();

    expect((option as any).alive).toEqual(false);

    option.select();

    expect(option.selected()).toEqual(false);
    expect(selectionChangeSpy).not.toHaveBeenCalled();
  });

  it('should not emit selection change when already selected', () => {
    option.select();
    fixture.detectChanges();
    expect(option.selected()).toEqual(true);

    const selectionChangeSpy = vi.fn();
    option.selectionChange.subscribe(selectionChangeSpy);
    option.select();

    expect(option.selected()).toEqual(true);
    expect(selectionChangeSpy).not.toHaveBeenCalled();
  });

  it('should emit selection change when deselected', () => {
    option.select();
    fixture.detectChanges();
    expect(option.selected()).toEqual(true);

    const selectionChangeSpy = vi.fn();
    option.selectionChange.subscribe(selectionChangeSpy);
    option.deselect();

    expect(option.selected()).toEqual(false);
    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
  });
});

describe('NbOptionComponent disabled', () => {
  let fixture: ComponentFixture<NbOptionDisabledTestComponent>;
  let testComponent: NbOptionDisabledTestComponent;
  let selectComponent: NbSelectComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        NbOptionDisabledTestComponent,
      ],
    });

    fixture = TestBed.createComponent(NbOptionDisabledTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    selectComponent = testComponent.selectComponent();
  });

  it('should has disabled attribute if disabled set to true', () => {
    selectComponent.show();
    testComponent.optionDisabled.set(true);
    fixture.detectChanges();

    const option = fixture.debugElement.query(By.directive(NbOptionComponent));
    expect(option.attributes['disabled']).toEqual('');
  });

  it('should has disabled attribute if group disabled set to true', async () => {
    selectComponent.show();
    testComponent.optionGroupDisabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const option = fixture.debugElement.query(By.directive(NbOptionComponent));
    expect(option.attributes['disabled']).toEqual('');
  });
});

describe('NbSelect - dynamic options', () => {
  let fixture: ComponentFixture<NbReactiveFormSelectComponent>;
  let testComponent: NbReactiveFormSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        NbReactiveFormSelectComponent,
      ],
    });

    fixture = TestBed.createComponent(NbReactiveFormSelectComponent);
    testComponent = fixture.componentInstance;
  });

  describe('Set value from queue', () => {
    let selectComponent: NbSelectComponent;

    beforeEach(() => {
      // Force select to cache the value as there is no options to select.
      testComponent.options.set([]);
      testComponent.formControl = new FormControl(1);
      fixture.detectChanges();

      selectComponent = fixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;
    });

    it('should set value from queue when options added dynamically (after change detection run)', async () => {
      expect(selectComponent.selectionModel().length).toEqual(0);

      testComponent.options.set([1]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const option = testComponent.optionComponents().at(0);
      assert(option);
      expect(selectComponent.selectionModel()[0]).toEqual(option);
    });

    it('should select a value written before its option exists', async () => {
      testComponent.options.set([1]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      testComponent.formControl.setValue(2);
      fixture.detectChanges();
      expect(selectComponent.selectionModel().length).toEqual(0);
      expect(selectComponent.selectedValue()).toBeUndefined();

      testComponent.options.set([1, 2]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(selectComponent.selectedValue()).toEqual(2);
    });

    it('should set value from queue when options change', async () => {
      testComponent.options.set([0]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(selectComponent.selectionModel().length).toEqual(0);

      testComponent.options.update((options) => [...options, 1]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const option = testComponent.optionComponents().at(-1);
      assert(option);
      expect(selectComponent.selectionModel()[0]).toEqual(option);
    });
  });

  describe('Clear queue after value set', () => {
    /*
      We can ensure queue is clean by spying on `writeValue` calls on select. It will be called only if options
      change and queue has a value.
    */

    it('should clear queue after option selected by click', async () => {
      vi.useFakeTimers();
      testComponent.options.set([]);
      testComponent.formControl = new FormControl(1);
      fixture.detectChanges();

      const selectComponent: NbSelectComponent = fixture.debugElement.query(
        By.directive(NbSelectComponent),
      ).componentInstance;
      testComponent.options.set([0]);
      fixture.detectChanges();
      await vi.runAllTimersAsync();
      fixture.detectChanges();

      const option = testComponent.optionComponents().at(0);
      assert(option);
      option.onClick({ preventDefault() {} } as Event);
      fixture.detectChanges();

      const writeValueSpy = vi.spyOn(selectComponent, 'writeValue');
      testComponent.options.update((options) => [...options, 1]);
      fixture.detectChanges();
      await vi.runAllTimersAsync();
      expect(writeValueSpy).not.toHaveBeenCalled();
    });

    it(`should clear queue after option selected via 'selected' input`, async () => {
      vi.useFakeTimers();
      testComponent.options.set([]);
      testComponent.formControl = new FormControl(1);
      fixture.detectChanges();

      const selectComponent: NbSelectComponent = fixture.debugElement.query(
        By.directive(NbSelectComponent),
      ).componentInstance;
      testComponent.options.set([0]);
      fixture.detectChanges();
      await vi.runAllTimersAsync();
      fixture.detectChanges();

      selectComponent.writeValue(0);
      fixture.detectChanges();

      const writeValueSpy = vi.spyOn(selectComponent, 'writeValue');
      testComponent.options.update((options) => [...options, 1]);
      fixture.detectChanges();
      await vi.runAllTimersAsync();
      expect(writeValueSpy).not.toHaveBeenCalled();
    });

    it('should clear queue after options change and selection model change', async () => {
      testComponent.options.set([]);
      testComponent.formControl = new FormControl(1);
      fixture.detectChanges();

      const selectComponent: NbSelectComponent = fixture.debugElement.query(
        By.directive(NbSelectComponent),
      ).componentInstance;
      const writeValueSpy = vi.spyOn(selectComponent, 'writeValue');

      testComponent.options.set([1]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(writeValueSpy).toHaveBeenCalledTimes(1);

      testComponent.options.update((options) => [...options, 2]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(writeValueSpy).toHaveBeenCalledTimes(1);
    });

    it('should not clear queue after options change and selection model is empty', async () => {
      testComponent.options.set([]);
      testComponent.formControl = new FormControl(2);
      fixture.detectChanges();

      const selectComponent: NbSelectComponent = fixture.debugElement.query(
        By.directive(NbSelectComponent),
      ).componentInstance;
      const writeValueSpy = vi.spyOn(selectComponent, 'writeValue');

      testComponent.options.set([0]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(writeValueSpy).toHaveBeenCalledTimes(1);

      testComponent.options.update((options) => [...options, 1]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(writeValueSpy).toHaveBeenCalledTimes(2);
    });
  });
});

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select multiple ngModel name="tags">
          <nb-option value="a">A</nb-option>
          <nb-option value="b">B</nb-option>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, FormsModule, RouterModule],
})
class NbMultipleSelectBareNgModelComponent {}

describe('NbSelectComponent - multiple with a bare ngModel', () => {
  it('should treat the initial empty string as no selection', async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        FormsModule,
        NbMultipleSelectBareNgModelComponent,
      ],
    });
    const fixture = TestBed.createComponent(NbMultipleSelectBareNgModelComponent);
    await expect((async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    })()).resolves.toBeUndefined();

    const select: NbSelectComponent = fixture.debugElement.query(By.directive(NbSelectComponent)).componentInstance;
    expect(select.selectionModel().length).toBe(0);
  });
});

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select [disabled]="disabled">
          <nb-option value="a">A</nb-option>
        </nb-select>
        <fieldset disabled>
          <nb-select>
            <nb-option value="b">B</nb-option>
          </nb-select>
        </fieldset>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, RouterModule],
})
class NbDisabledSelectTestComponent {
  disabled = true;
}

describe('NbSelectComponent - disabled', () => {
  it('should not open when disabled or inside a disabled fieldset', async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        NbDisabledSelectTestComponent,
      ],
    });
    const fixture = TestBed.createComponent(NbDisabledSelectTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const selects = fixture.debugElement.queryAll(By.directive(NbSelectComponent)).map((d) => d.componentInstance);
    selects.forEach((select: NbSelectComponent) => select.show());
    fixture.detectChanges();

    selects.forEach((select: NbSelectComponent) => expect(select.isOpen()).toBeFalsy());
  });
});

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select tabIndex="-1">
          <nb-option value="a">A</nb-option>
        </nb-select>
        <nb-select>
          <nb-option value="b">B</nb-option>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, RouterModule],
})
class NbTabIndexSelectTestComponent {}

describe('NbSelectComponent - tabIndex', () => {
  it('should pass the tab index to the select button', () => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        NbTabIndexSelectTestComponent,
      ],
    });
    const fixture = TestBed.createComponent(NbTabIndexSelectTestComponent);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('nb-select button')).map((d) => d.nativeElement.tabIndex);
    expect(buttons).toEqual([-1, 0]);
  });
});

@Component({
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select [selected]="selected()" [multiple]="multiple()">
          @for (option of options(); track option) {
            <nb-option [value]="option.value">{{ option.title }}</nb-option>
          }
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutModule, NbSelectModule, RouterModule],
})
class NbSelectDynamicOptionsTestComponent {
  readonly select = viewChild.required(NbSelectComponent);
  readonly options = signal([
    { value: 'a', title: 'A' },
    { value: 'b', title: 'B' },
  ]);
  readonly selected = signal<any>('b');
  readonly multiple = signal(false);
}

type DynamicOptionsChange = {
  [K in 'options' | 'selected' | 'multiple']?: ReturnType<NbSelectDynamicOptionsTestComponent[K]>;
};

describe('NbSelectComponent - stale selection', () => {
  let fixture: ComponentFixture<NbSelectDynamicOptionsTestComponent>;
  const label = () => fixture.nativeElement.querySelector('nb-select button').textContent.trim();
  const assign = (change: DynamicOptionsChange) => {
    const host = fixture.componentInstance;
    for (const key of Object.keys(change) as (keyof DynamicOptionsChange)[]) {
      host[key].set(change[key]);
    }
  };
  const update = async (change: DynamicOptionsChange) => {
    assign(change);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  function create(change: DynamicOptionsChange = {}) {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSelectModule,
        NbSelectDynamicOptionsTestComponent,
      ],
    });
    fixture = TestBed.createComponent(NbSelectDynamicOptionsTestComponent);
    assign(change);
    fixture.detectChanges();
  }

  it('should select the new option when the options are loaded again', async () => {
    create();
    await update({});
    expect(label()).toBe('B');

    await update({ options: [{ value: 'a', title: 'A' }, { value: 'b', title: 'B again' }] });

    const selectedOptions = fixture.componentInstance.select().options().filter((option) => option.selected());
    expect(selectedOptions.map((option) => option.value())).toEqual(['b']);
    expect(label()).toBe('B again');
  });

  it('should update the label when the text of the selected option changes', async () => {
    create();
    await update({});

    // Keep the same option object so the existing nb-option only changes its text.
    fixture.componentInstance.options.update((options) => {
      options[1].title = 'Translated';
      return [...options];
    });
    await update({});

    expect(label()).toBe('Translated');
  });

  it('should select the values of a multiple select whose options are loaded later', async () => {
    create({ multiple: true, selected: ['a', 'c'] });
    await update({});

    await update({ options: [...fixture.componentInstance.options(), { value: 'c', title: 'C' }] });

    expect(fixture.componentInstance.select().selectedValue()).toEqual(['a', 'c']);
  });
});

@Component({
  template: `
    <span id="select-label">Country</span>
    <nb-select aria-labelledby="select-label" placeholder="Choose">
      <nb-option value="si">Slovenia</nb-option>
    </nb-select>
    <nb-select class="unlabelled" ghost>
      <nb-option value="si">Slovenia</nb-option>
    </nb-select>
  `,
  imports: [NbSelectModule],
})
class NbLabelledSelectComponent {}

describe('NbSelectComponent - label', () => {
  it('should label its button with the given label and its own text', async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    const fixture = TestBed.createComponent(NbLabelledSelectComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const [labelled, unlabelled] = fixture.nativeElement.querySelectorAll('nb-select') as HTMLElement[];
    const button = labelled.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-labelledby')).toBe(`select-label ${button.id}`);
    expect(labelled.hasAttribute('aria-labelledby')).toBe(false);
    expect(unlabelled.querySelector('button')?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('should say that its button opens a list, and whether the list is open', async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }],
    });
    const fixture = TestBed.createComponent(NbLabelledSelectComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement;
    expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.hasAttribute('aria-controls')).toBe(false);

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    const list = document.querySelector('[role="listbox"]');
    expect(list?.id).toBeTruthy();
    expect(button.getAttribute('aria-controls')).toBe(list?.id);
    fixture.destroy();
  });

  it('should take the ghost appearance', async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    const fixture = TestBed.createComponent(NbLabelledSelectComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const [outline, ghost] = fixture.nativeElement.querySelectorAll('nb-select') as HTMLElement[];
    expect(outline.classList).toContain('appearance-outline');
    expect(ghost.classList).toContain('appearance-ghost');
  });
});

// Opening the select measures the viewport to block its scroll.
@Service({ autoProvided: false })
class NbViewportRulerMockAdapter extends NbViewportRulerAdapter {
  override getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1600, height: 900 };
  }
  override getViewportScrollPosition(): { left: number; top: number } {
    return { left: 0, top: 0 };
  }
}

@Component({
  template: `
    <nb-select nullable placeholder="Encoding" [formControl]="control" [multiple]="multiple()">
      @for (option of options(); track option.label) {
        <nb-option [value]="option.value">{{ option.label }}</nb-option>
      }
    </nb-select>
  `,
  imports: [NbSelectModule, ReactiveFormsModule],
})
class NbNullableSelectComponent {
  readonly control = new FormControl<unknown>(null);
  readonly multiple = signal(false);
  readonly showOptions = signal(true);
  readonly options = computed(() =>
    this.showOptions()
      ? [
        { label: 'Auto', value: null },
        { label: 'Byte', value: 'byte' },
        // Without a value: clears the selection.
        { label: 'Clear', value: undefined },
      ]
      : [],
  );
}

describe('NbSelectComponent - nullable', () => {
  let fixture: ComponentFixture<NbNullableSelectComponent>;
  let host: NbNullableSelectComponent;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const label = () => (fixture.nativeElement.querySelector('nb-select button') as HTMLElement).textContent?.trim();
  const choose = async (text: string) => {
    (fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement).click();
    await render();
    const option = [...document.querySelectorAll('nb-option')].find((o) => o.textContent?.trim() === text);
    (option as HTMLElement).click();
    await render();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }],
    });
    fixture = TestBed.createComponent(NbNullableSelectComponent);
    host = fixture.componentInstance;
    await render();
  });

  it('should show the option of a null value', () => {
    expect(label()).toBe('Auto');
  });

  it('should set null when its option is chosen', async () => {
    host.control.setValue('byte');
    await render();
    expect(label()).toBe('Byte');

    await choose('Auto');

    expect(host.control.value).toBeNull();
    expect(label()).toBe('Auto');
  });

  it('should still clear the selection with an option without a value', async () => {
    await choose('Clear');

    expect(host.control.value).toBeNull();
    expect(label()).toBe('Encoding');
  });

  it('should select a null value once its options render', async () => {
    host.showOptions.set(false);
    await render();
    host.control.setValue(null);
    await render();
    host.showOptions.set(true);
    await render();

    expect(label()).toBe('Auto');
  });

  it('should go to the first and the last option with Home and End', async () => {
    host.control.setValue('byte');
    await render();
    const button = fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement;
    // The key manager reads keyCode, which synthetic keyboard events leave at 0.
    const keyCodes: Record<string, number> = { Home: 36, End: 35 };
    const key = async (code: string) => {
      const event = new KeyboardEvent('keydown', { key: code, bubbles: true });
      Object.defineProperty(event, 'keyCode', { value: keyCodes[code] });
      document.activeElement?.dispatchEvent(event);
      await render();
    };
    button.click();
    await render();

    await key('End');
    expect(document.activeElement?.textContent?.trim()).toBe('Clear');

    await key('Home');
    expect(document.activeElement?.textContent?.trim()).toBe('Auto');
  });

  it('should allow null among the values of a multiple select', async () => {
    host.multiple.set(true);
    await render();
    host.control.setValue([]);
    await render();
    await choose('Auto');

    expect(host.control.value).toEqual([null]);
    expect(document.querySelector('nb-option nb-checkbox')).not.toBeNull();
  });
});

@Component({
  template: `
    <nb-select multiple chips [selected]="selected()" data-c="multiple">
      <nb-option value="milk">Milk</nb-option>
      <nb-option value="nuts">Nuts</nb-option>
    </nb-select>
    <nb-select chips selected="milk" data-c="single">
      <nb-option value="milk">Milk</nb-option>
    </nb-select>
  `,
  imports: [NbSelectModule],
})
class NbChipsSelectComponent {
  readonly selected = signal(['milk', 'nuts']);
}

describe('NbSelectComponent - chips', () => {
  it('should show the selected options of a multiple select as tags', async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    const fixture = TestBed.createComponent(NbChipsSelectComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const tags = (c: string) =>
      [...fixture.nativeElement.querySelectorAll(`[data-c="${c}"] button nb-tag`)].map((tag) => tag.textContent?.trim());

    expect(tags('multiple')).toEqual(['Milk', 'Nuts']);
    // Chips are for multiple selects; a single one shows its label as usual.
    expect(tags('single')).toEqual([]);
    expect(fixture.nativeElement.querySelector('[data-c="single"] button').textContent.trim()).toBe('Milk');

    fixture.componentInstance.selected.set(['nuts']);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(tags('multiple')).toEqual(['Nuts']);
  });
});

@Component({
  template: `
    <nb-select multiple [selected]="['milk']">
      <nb-option-group title="Dairy">
        <nb-option value="milk">Milk</nb-option>
        <nb-option value="cheese" disabled>Cheese</nb-option>
      </nb-option-group>
    </nb-select>
  `,
  imports: [NbSelectModule],
})
class NbSelectRolesComponent {}

describe('NbSelectComponent - roles', () => {
  it('should expose the list, groups and options to assistive technology', async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }],
    });
    const fixture = TestBed.createComponent(NbSelectRolesComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    const list = document.querySelector('[role="listbox"]') as HTMLElement;
    expect(list.getAttribute('aria-multiselectable')).toBe('true');
    const group = list.querySelector('[role="group"]') as HTMLElement;
    expect(document.getElementById(group.getAttribute('aria-labelledby') ?? '')?.textContent).toBe('Dairy');
    const [milk, cheese] = [...list.querySelectorAll('[role="option"]')];
    expect(milk.getAttribute('aria-selected')).toBe('true');
    expect(cheese.getAttribute('aria-selected')).toBe('false');
    expect(cheese.getAttribute('aria-disabled')).toBe('true');
  });
});

@Component({
  template: `
    <nb-select searchable [formControl]="control" [searchFn]="searchFn()">
      <nb-option-group title="Europe">
        <nb-option value="si">Slovenia</nb-option>
        <nb-option value="hr">Croatia</nb-option>
      </nb-option-group>
      <nb-option-group title="Americas">
        <nb-option value="mx">México</nb-option>
      </nb-option-group>
    </nb-select>
  `,
  imports: [NbSelectModule, ReactiveFormsModule],
})
class NbSearchableSelectComponent {
  readonly control = new FormControl<string | null>(null);
  readonly searchFn = signal(nbSelectSearchFn);
}

describe('NbSelectComponent - search', () => {
  let fixture: ComponentFixture<NbSearchableSelectComponent>;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const searchInput = () => document.querySelector('.select-search input') as HTMLInputElement;
  const visible = () =>
    [...document.querySelectorAll('nb-option-list nb-option')]
      .filter((option) => getComputedStyle(option).display !== 'none')
      .map((option) => option.textContent?.trim());
  const open = async () => {
    (fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement).click();
    await render();
    await new Promise((resolve) => setTimeout(resolve, 50));
    await render();
  };
  const search = async (text: string) => {
    searchInput().value = text;
    searchInput().dispatchEvent(new Event('input'));
    await render();
  };
  // The key manager reads keyCode, which synthetic keyboard events leave at 0.
  const keyCodes: Record<string, number> = { ArrowDown: DOWN_ARROW, Enter: ENTER };
  const key = async (name: string) => {
    const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true });
    Object.defineProperty(event, 'keyCode', { value: keyCodes[name] });
    searchInput().dispatchEvent(event);
    await render();
  };

  const setup = async (providers = new Array<unknown>()) => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }, ...(providers as [])],
    });
    fixture = TestBed.createComponent(NbSearchableSelectComponent);
    await render();
  };

  describe('with defaults', () => {
    beforeEach(() => setup());

    it('should focus the search input when opened', async () => {
      await open();

      expect(document.activeElement).toBe(searchInput());
      expect(searchInput().getAttribute('role')).toBe('combobox');
      expect(searchInput().getAttribute('aria-controls')).toBe(document.querySelector('[role="listbox"]')?.id);
    });

    it('should filter options by their text, ignoring case and accents, and hide empty groups', async () => {
      await open();
      await search('MEXICO');

      expect(visible()).toEqual(['México']);
      const groups = [...document.querySelectorAll('nb-option-list nb-option-group')];
      expect(groups.map((group) => getComputedStyle(group).display !== 'none')).toEqual([false, true]);
    });

    it('should say when nothing matches', async () => {
      await open();
      await search('zzz');

      expect(visible()).toEqual([]);
      expect(document.querySelector('.select-no-matches')?.textContent?.trim()).toBe('No matches');
      expect(document.querySelector('.select-no-matches')?.getAttribute('role')).toBe('status');
    });

    it('should move through the matching options with the arrows and select with Enter', async () => {
      await open();
      await search('a');
      const activeText = () => document.getElementById(searchInput().getAttribute('aria-activedescendant') ?? '')?.textContent?.trim();

      expect(activeText()).toBe('Slovenia');
      await key('ArrowDown');
      expect(activeText()).toBe('Croatia');

      await key('Enter');

      expect(fixture.componentInstance.control.value).toBe('hr');
      expect(document.querySelector('nb-option-list')).toBeNull();
    });

    it('should show all options again when reopened', async () => {
      await open();
      await search('slo');
      (fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement).click();
      await render();
      await open();

      expect(searchInput().value).toBe('');
      expect(visible()).toEqual(['Slovenia', 'Croatia', 'México']);
    });

    it('should use a custom search function', async () => {
      fixture.componentInstance.searchFn.set((option, text) => option.value() === text);
      await render();
      await open();
      await search('si');

      expect(visible()).toEqual(['Slovenia']);
    });
  });

  describe('with provided texts', () => {
    it('should use them', async () => {
      await setup([provideNbTexts({ select: { search: 'Iskanje', noMatches: 'Ni zadetkov' } })]);
      await open();
      await search('zzz');

      expect(searchInput().placeholder).toBe('Iskanje');
      expect(document.querySelector('.select-no-matches')?.textContent?.trim()).toBe('Ni zadetkov');
    });
  });
});

@Component({
  template: `
    <nb-select multiple searchable [formControl]="control" [maxSelections]="max()">
      <nb-option selectAll>Select all</nb-option>
      <nb-option value="a">Apple</nb-option>
      <nb-option value="b">Banana</nb-option>
      <nb-option value="c">Cherry</nb-option>
      <nb-option value="d" disabled>Date</nb-option>
    </nb-select>
  `,
  imports: [NbSelectModule, ReactiveFormsModule],
})
class NbSelectAllComponent {
  readonly control = new FormControl(new Array<string>());
  readonly max = signal<number | undefined>(undefined);
}

describe('NbSelectComponent - select all and maxSelections', () => {
  let fixture: ComponentFixture<NbSelectAllComponent>;
  let host: NbSelectAllComponent;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const option = (text: string) =>
    [...document.querySelectorAll('nb-option-list nb-option')].find((o) => o.textContent?.trim() === text) as HTMLElement;
  const selectAllCheckbox = () => option('Select all').querySelector('nb-checkbox input') as HTMLInputElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }],
    });
    fixture = TestBed.createComponent(NbSelectAllComponent);
    host = fixture.componentInstance;
    await render();
    (fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement).click();
    await render();
  });

  it('should select all enabled options, then clear them', async () => {
    option('Select all').click();
    await render();

    expect(host.control.value).toEqual(['a', 'b', 'c']);
    expect(selectAllCheckbox().checked).toBe(true);
    expect(option('Select all').getAttribute('aria-selected')).toBe('true');

    option('Select all').click();
    await render();

    expect(host.control.value).toEqual([]);
    expect(selectAllCheckbox().checked).toBe(false);
  });

  it('should show some selected as indeterminate', async () => {
    option('Banana').click();
    await render();

    expect(selectAllCheckbox().indeterminate).toBe(true);
  });

  it('should act on the options the search shows', async () => {
    const search = document.querySelector('.select-search input') as HTMLInputElement;
    search.value = 'an';
    search.dispatchEvent(new Event('input'));
    await render();
    expect(getComputedStyle(option('Select all')).display).not.toBe('none');
    option('Select all').click();
    await render();

    expect(host.control.value).toEqual(['b']);
  });

  it('should disable the other options once maxSelections is reached', async () => {
    host.max.set(2);
    await render();
    option('Apple').click();
    option('Banana').click();
    await render();

    expect(option('Cherry').getAttribute('aria-disabled')).toBe('true');
    option('Cherry').click();
    await render();
    expect(host.control.value).toEqual(['a', 'b']);

    option('Apple').click();
    await render();
    expect(option('Cherry').hasAttribute('aria-disabled')).toBe(false);
  });

  it('should hide the select-all option and say so when nothing matches', async () => {
    const search = document.querySelector('.select-search input') as HTMLInputElement;
    search.value = 'zzz';
    search.dispatchEvent(new Event('input'));
    await render();

    expect(getComputedStyle(option('Select all')).display).toBe('none');
    expect(document.querySelector('.select-no-matches')?.textContent?.trim()).toBe('No matches');
  });

  it('should select all only up to maxSelections, and clear when the limit is reached', async () => {
    host.max.set(2);
    await render();
    option('Select all').click();
    await render();

    expect(host.control.value).toEqual(['a', 'b']);
    expect(option('Select all').hasAttribute('aria-disabled')).toBe(false);

    option('Select all').click();
    await render();

    expect(host.control.value).toEqual([]);
  });
});

@Component({
  template: `
    <nb-select [formControl]="control">
      @for (item of items(); track item) {
        <nb-option [value]="item" [class.tall]="tall()(item)">Item {{ item }}</nb-option>
      }
    </nb-select>
  `,
  imports: [NbSelectModule, ReactiveFormsModule],
})
class NbLongSelectComponent {
  readonly control = new FormControl<number | null>(null);
  readonly items = signal(Array.from({ length: 1000 }, (_, i) => i));
  readonly tall = signal<(item: number) => boolean>(() => false);
}

describe('NbSelectComponent - long lists', () => {
  let fixture: ComponentFixture<NbLongSelectComponent>;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  };
  const list = () => document.querySelector('nb-option-list .option-list') as HTMLElement;
  const laidOut = () => [...document.querySelectorAll('nb-option-list nb-option.nb-option-in-view')];
  const open = async () => {
    (fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement).click();
    await render();
  };

  // The specs run without the theme; these are the parts of it the windowing relies on.
  let themeStyles: HTMLStyleElement;

  beforeEach(async () => {
    themeStyles = document.createElement('style');
    themeStyles.textContent = `
      nb-option-list .option-list { max-height: 320px; overflow: auto; }
      .option-list.nb-option-list-windowed { overflow-anchor: none; }
      .option-list.nb-option-list-pending nb-option,
      .option-list.nb-option-list-windowed nb-option:not(.nb-option-in-view) { display: none; }
      .option-list.nb-option-list-windowed::after { content: ''; display: block; height: var(--nb-option-list-end-space, 0); }
      nb-option { height: 40px; }
      nb-option.tall { height: 100px; }
    `;
    document.head.appendChild(themeStyles);
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot()],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }],
    });
    fixture = TestBed.createComponent(NbLongSelectComponent);
    await render();
  });

  afterEach(() => themeStyles.remove());

  it('should lay out only the options near the view', async () => {
    await open();

    expect(list().classList).toContain('nb-option-list-windowed');
    expect(laidOut().length).toBeGreaterThan(0);
    expect(laidOut().length).toBeLessThan(100);
    expect(laidOut()[0].getAttribute('aria-posinset')).toBe('1');
    expect(laidOut()[0].getAttribute('aria-setsize')).toBe('1000');
  });

  it('should show and scroll to an option that takes focus', async () => {
    await open();
    const last = [...document.querySelectorAll('nb-option-list nb-option')].at(-1) as HTMLElement;
    expect(last.classList).not.toContain('nb-option-in-view');

    // What an option does before it takes focus or becomes active.
    last.dispatchEvent(new CustomEvent('nboptionreveal', { bubbles: true }));
    last.focus();

    expect(last.classList).toContain('nb-option-in-view');
    expect(last.getAttribute('aria-posinset')).toBe('1000');
    expect(list().scrollTop).toBeGreaterThan(0);
  });

  it('should leave the options as they were when the list closes', async () => {
    await open();
    (fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement).click();
    await render();

    const options = [...fixture.nativeElement.querySelectorAll('nb-option'), ...document.querySelectorAll('nb-option')];
    expect(options.some((option) => option.classList.contains('nb-option-in-view'))).toBe(false);
    expect(options.some((option) => (option as HTMLElement).style.marginTop)).toBe(false);
  });

  it('should not window a short list', async () => {
    fixture.componentInstance.items.set([1, 2, 3]);
    await render();
    await open();

    expect(list().classList).not.toContain('nb-option-list-windowed');
    expect(list().classList).not.toContain('nb-option-list-pending');
  });

  describe('with options of different heights', () => {
    const height = (item: number) => (item % 3 === 1 ? 100 : 40);
    const optionAt = (item: number) =>
      [...document.querySelectorAll('nb-option-list nb-option')].find(
        (option) => option.textContent?.trim() === `Item ${item}`,
      ) as HTMLElement;
    const viewTop = () => list().getBoundingClientRect().top;
    // The options painted in the view, and where, as a list would show them all laid out.
    const painted = () =>
      laidOut()
        .map((option) => ({ text: option.textContent?.trim(), top: option.getBoundingClientRect().top - viewTop() }))
        .filter(({ top }) => top > -100 && top < list().clientHeight);

    beforeEach(async () => {
      fixture.componentInstance.tall.set((item) => height(item) === 100);
      await render();
      await open();
    });

    it('should move the options exactly as far as the list scrolls, both ways', async () => {
      for (const step of [130, 130, 130, 2000, 130, -130, -130, -2000, -130, 5000, -130, -130, -130]) {
        const before = painted();
        const scrollTop = list().scrollTop;
        list().scrollTop = scrollTop + step;
        await render();
        const moved = list().scrollTop - scrollTop;
        const after = new Map(painted().map(({ text, top }) => [text, top]));
        // Options painted both before and after the scroll moved by what the list scrolled.
        for (const { text, top } of before) {
          if (after.has(text)) {
            expect(after.get(text)).toBeCloseTo(top - moved, 0);
          }
        }
        // And nothing in the view is left empty.
        const shown = painted();
        expect(shown[0].top).toBeLessThanOrEqual(0);
        expect(shown.at(-1)?.top ?? 0).toBeGreaterThan(list().clientHeight - 100);
      }
    });

    it('should lay out the options next to each other, at their own heights', async () => {
      list().scrollTop = 6000;
      await render();
      const shown = laidOut().map((option) => option.getBoundingClientRect());
      shown.slice(1).forEach((rect, i) => expect(rect.top).toBeCloseTo(shown[i].bottom, 0));
    });

    it('should scroll all the way to the last option, and back to the first', async () => {
      const last = optionAt(999);
      last.dispatchEvent(new CustomEvent('nboptionreveal', { bubbles: true }));
      await render();
      expect(last.getBoundingClientRect().bottom - viewTop()).toBeCloseTo(list().clientHeight, 0);

      list().scrollTop = list().scrollHeight;
      await render();
      expect(last.getBoundingClientRect().bottom - viewTop()).toBeCloseTo(list().clientHeight, 0);

      const first = optionAt(0);
      first.dispatchEvent(new CustomEvent('nboptionreveal', { bubbles: true }));
      await render();
      expect(list().scrollTop).toBe(0);
      expect(first.getBoundingClientRect().top).toBeCloseTo(viewTop(), 0);
    });

    it('should show a revealed option whole, wherever it is', async () => {
      for (const item of [500, 501, 250, 997, 3]) {
        const option = optionAt(item);
        option.dispatchEvent(new CustomEvent('nboptionreveal', { bubbles: true }));
        await render();
        const top = option.getBoundingClientRect().top - viewTop();
        expect(top).toBeGreaterThanOrEqual(-0.5);
        expect(top + height(item)).toBeLessThanOrEqual(list().clientHeight + 0.5);
      }
    });
  });
});
