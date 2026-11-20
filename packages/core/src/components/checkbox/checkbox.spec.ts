import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { NbIconModule, NbCheckboxModule, NbCheckboxComponent, NbThemeModule } from '@liquid-js/lyr-core';

describe('Component: NbCheckbox', () => {
  let checkbox: NbCheckboxComponent;
  let label: DebugElement;
  let fixture: ComponentFixture<NbCheckboxComponent>;
  let checkboxInput: DebugElement;
  let testContainerEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbIconModule, NbCheckboxModule],
    });

    fixture = TestBed.createComponent(NbCheckboxComponent);
    checkbox = fixture.componentInstance;
    testContainerEl = fixture.elementRef.nativeElement;

    checkboxInput = fixture.debugElement.query(By.css('input'));
    label = fixture.debugElement.query(By.css('label'));
  });

  it('Setting disabled to true disables checkbox input', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.disabled).toBeTruthy();
  });

  it('Setting disabled to false enables checkbox input', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.disabled).toBeFalsy();
  });

  it('Setting checked to true makes checkbox input checked', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.checked).toBeTruthy();
  });

  it('Setting checked to false makes checkbox input unchecked', () => {
    fixture.componentRef.setInput('checked', false);
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.checked).toBeFalsy();
  });

  it('Setting status to success apply corresponding class to host element', () => {
    fixture.componentRef.setInput('status', 'success');
    fixture.detectChanges();
    expect(testContainerEl.classList.contains('status-success')).toBeTruthy();
  });

  it('Setting status to warning apply corresponding class to host element', () => {
    fixture.componentRef.setInput('status', 'warning');
    fixture.detectChanges();
    expect(testContainerEl.classList.contains('status-warning')).toBeTruthy();
  });

  it('Setting status to danger apply corresponding class to host element', () => {
    fixture.componentRef.setInput('status', 'danger');
    fixture.detectChanges();
    expect(testContainerEl.classList.contains('status-danger')).toBeTruthy();
  });

  it('Setting status to primary apply corresponding class to host element', () => {
    fixture.componentRef.setInput('status', 'primary');
    fixture.detectChanges();
    expect(testContainerEl.classList.contains('status-primary')).toBeTruthy();
  });

  it('Setting status to info apply corresponding class to host element', () => {
    fixture.componentRef.setInput('status', 'info');
    fixture.detectChanges();
    expect(testContainerEl.classList.contains('status-info')).toBeTruthy();
  });

  it('should not emit change event when input changed', () => {
    const spy = vi.fn();

    checkbox.checkedChange.subscribe(spy);

    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should emit change event when clicked', () => {
    const spy = vi.fn();

    checkbox.checkedChange.subscribe(spy);

    label.nativeElement.click();

    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should change value to opposite when clicked', () => {
    label.nativeElement.click();
    fixture.detectChanges();

    expect(checkbox.isChecked()).toEqual(true);

    label.nativeElement.click();
    fixture.detectChanges();

    expect(checkbox.isChecked()).toEqual(false);
  });

  it('should reset indeterminate state when clicked on unchecked checkbox', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    expect(checkbox.isIndeterminate()).toEqual(true);

    label.nativeElement.click();
    fixture.detectChanges();
    expect(checkbox.isIndeterminate()).toEqual(false);
  });

  it('should reset indeterminate state when clicked on explicitly unchecked checkbox', () => {
    fixture.componentRef.setInput('checked', false);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    expect(checkbox.isIndeterminate()).toEqual(true);

    label.nativeElement.click();
    fixture.detectChanges();
    expect(checkbox.isIndeterminate()).toEqual(false);
  });

  it('should emit click event once', () => {
    const clickSpy = vi.fn();
    (fixture.nativeElement as HTMLElement).addEventListener('click', clickSpy);

    label.nativeElement.click();

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});

/** Test component with reactive forms */
@Component({
  template: `<nb-checkbox [formControl]="formControl" />`,
  imports: [NbCheckboxComponent, ReactiveFormsModule, NbIconModule, NbCheckboxModule],
})
class CheckboxWithFormControlComponent {
  formControl = new FormControl();
}

describe('Component: NbCheckbox with form control', () => {
  let fixture: ComponentFixture<CheckboxWithFormControlComponent>;
  let checkboxComponent: DebugElement;
  let checkboxInstance: NbCheckboxComponent;
  let testComponent: CheckboxWithFormControlComponent;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NbCheckboxComponent,
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        NbIconModule,
        NbCheckboxModule,
        CheckboxWithFormControlComponent,
      ],
    });

    fixture = TestBed.createComponent(CheckboxWithFormControlComponent);
    fixture.detectChanges();

    checkboxComponent = fixture.debugElement.query(By.directive(NbCheckboxComponent));
    checkboxInstance = checkboxComponent.componentInstance;
    testComponent = fixture.debugElement.componentInstance;
    inputElement = <HTMLInputElement>checkboxComponent.nativeElement.querySelector('input');
  });

  it('Toggling form control disabled state properly toggles checkbox input', () => {
    expect(checkboxInstance.isDisabled()).toBeFalsy();

    testComponent.formControl.disable();
    fixture.detectChanges();

    expect(checkboxInstance.isDisabled()).toBeTruthy();
    expect(inputElement.disabled).toBeTruthy();

    testComponent.formControl.enable();
    fixture.detectChanges();

    expect(checkboxInstance.isDisabled()).toBeFalsy();
    expect(inputElement.disabled).toBeFalsy();
  });

  it('should mark touched on blur', () => {
    expect(testComponent.formControl.touched).toEqual(false);

    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(testComponent.formControl.touched).toEqual(true);
  });
});
