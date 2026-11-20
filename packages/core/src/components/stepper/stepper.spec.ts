import type { Mock } from 'vitest';
import { Component, viewChild, viewChildren, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  NbStepChangeEvent,
  NbStepComponent,
  NbStepperComponent,
  NbStepperModule,
  NbThemeModule,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-step-changed-test',
  template: `
    <nb-stepper [selectedIndex]="1" [disableStepNavigation]="disableNavigation()">
      <nb-step [label]="labelOne">
        <ng-template #labelOne>First step</ng-template>
      </nb-step>

      <nb-step [label]="labelTwo">
        <ng-template #labelTwo>Seconds step</ng-template>
      </nb-step>

      <nb-step [label]="labelThree">
        <ng-template #labelThree>First step</ng-template>
      </nb-step>
    </nb-stepper>
  `,
  imports: [NbStepperModule],
})
export class NbStepChangeTestComponent {
  readonly disableNavigation = signal(false);
  readonly stepper = viewChild.required(NbStepperComponent);
  readonly steps = viewChildren(NbStepComponent);
}

describe('Stepper: Step Change', () => {
  let testComponent: NbStepChangeTestComponent;
  let stepper: NbStepperComponent;
  let fixture: ComponentFixture<NbStepChangeTestComponent>;
  let stepChangeSpy: Mock<(event: NbStepChangeEvent) => void>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbStepperModule, NbStepChangeTestComponent],
    });

    fixture = TestBed.createComponent(NbStepChangeTestComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    stepper = testComponent.stepper();
    stepChangeSpy = vi.fn();
  });

  it('should emit step change on next method', () => {
    stepper.stepChange.subscribe(stepChangeSpy);
    stepper.next();
    fixture.detectChanges();

    expect(stepChangeSpy).toHaveBeenCalled();
  });

  it('should emit step change by clicking on step', () => {
    stepper.stepChange.subscribe(stepChangeSpy);
    const step = fixture.debugElement.query(By.css('.step'));
    step.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(stepChangeSpy).toHaveBeenCalled();
  });

  it('should reach the steps by keyboard, as buttons, and pick one with Enter or Space', () => {
    const steps = () => Array.from(fixture.nativeElement.querySelectorAll('.step')) as HTMLElement[];
    const press = (step: HTMLElement, key: string) =>
      step.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

    expect(steps().map((step) => [step.getAttribute('role'), step.tabIndex])).toEqual([
      ['button', 0],
      ['button', 0],
      ['button', 0],
    ]);
    expect(steps().map((step) => step.getAttribute('aria-current'))).toEqual([null, 'step', null]);

    // Space doesn't scroll the page.
    expect(press(steps()[2], ' ')).toBe(false);
    fixture.detectChanges();
    expect(stepper.selectedIndex()).toBe(2);
    press(steps()[0], 'Enter');
    fixture.detectChanges();
    expect(stepper.selectedIndex()).toBe(0);
    expect(steps()[0].getAttribute('aria-current')).toBe('step');

    testComponent.disableNavigation.set(true);
    fixture.detectChanges();
    expect(steps().every((step) => !step.hasAttribute('role') && !step.hasAttribute('tabindex'))).toBe(true);
  });

  it('should not emit step change if navigation is disabled', () => {
    stepper.stepChange.subscribe(stepChangeSpy);
    testComponent.disableNavigation.set(true);
    fixture.detectChanges();
    const step = fixture.debugElement.query(By.css('.step'));
    step.triggerEventHandler('click', null);

    fixture.detectChanges();
    expect(stepChangeSpy).not.toHaveBeenCalled();
  });

  it('should not emit step change when calling next on the last step', () => {
    stepper.selectedIndex.set(2);
    fixture.detectChanges();
    stepper.stepChange.subscribe(stepChangeSpy);
    stepper.next();

    expect(stepChangeSpy).not.toHaveBeenCalled();
  });

  it('should not emit step change when calling prev on the first step', () => {
    stepper.selectedIndex.set(0);
    fixture.detectChanges();
    stepper.stepChange.subscribe(stepChangeSpy);
    stepper.previous();

    expect(stepChangeSpy).not.toHaveBeenCalled();
  });

  it('should emit step change when selecting a step', () => {
    stepper.stepChange.subscribe(stepChangeSpy);
    const thirdStep = testComponent.steps()[2];
    thirdStep.select();
    fixture.detectChanges();

    expect(stepChangeSpy).toHaveBeenCalled();
    const [changeEvent] = stepChangeSpy.mock.calls[0];
    expect(changeEvent.index).toEqual(2);
    expect(changeEvent.step).toEqual(thirdStep);
    expect(changeEvent.previouslySelectedIndex).toEqual(1);
    expect(changeEvent.previouslySelectedStep).toEqual(testComponent.steps().at(1));
  });

  it('should emit step change when changing step via selectedIndex', () => {
    stepper.stepChange.subscribe(stepChangeSpy);
    stepper.selectedIndex.set(2);
    fixture.detectChanges();

    expect(stepChangeSpy).toHaveBeenCalled();
    expect(stepper.selected()).toBe(testComponent.steps().at(2));
  });

  it('should revert a selectedIndex a linear stepper does not allow', () => {
    stepper.selectedIndex.set(0);
    fixture.detectChanges();
    stepper.stepChange.subscribe(stepChangeSpy);
    testComponent.steps()[0].reset();
    testComponent.steps()[1].reset();

    stepper.selectedIndex.set(2);
    fixture.detectChanges();

    expect(stepper.selectedIndex()).toBe(0);
    expect(stepChangeSpy).not.toHaveBeenCalled();
  });
});

describe('Component: NbStepper', () => {
  let fixture: ComponentFixture<NbStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbStepperModule],
    });

    fixture = TestBed.createComponent(NbStepperComponent);
  });

  it('should set class horizontal', () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList.contains('horizontal')).toBeTruthy();

    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList.contains('vertical')).toBeTruthy();
  });
});

@Component({
  template: `
    <nb-stepper [linear]="linear()">
      <nb-step label="First" [completed]="firstCompleted()"><button id="first-next" nbStepperNext>Next</button></nb-step>
      <nb-step label="Hidden" [hidden]="true">Hidden</nb-step>
      <nb-step label="Third"><button id="third-previous" nbStepperPrevious>Previous</button></nb-step>
    </nb-stepper>
  `,
  imports: [NbStepperModule],
})
class NbStepperHiddenStepTestComponent {
  readonly linear = signal(false);
  readonly firstCompleted = signal(false);
  readonly stepper = viewChild.required(NbStepperComponent);
}

describe('Stepper: hidden steps', () => {
  it('should skip hidden steps and number the visible ones', () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbStepperModule, NbStepperHiddenStepTestComponent],
    });
    const fixture = TestBed.createComponent(NbStepperHiddenStepTestComponent);
    fixture.detectChanges();
    const stepper = fixture.componentInstance.stepper();

    const labels: Element[] = Array.from(fixture.nativeElement.querySelectorAll('.step .label-index'));
    const numbers = labels.map((label) => label.textContent.trim());
    expect(numbers).toEqual(['1', '2']);
    expect(fixture.nativeElement.querySelectorAll('.connector').length).toBe(1);
    // A label given as text takes its own direction.
    const texts: Element[] = Array.from(fixture.nativeElement.querySelectorAll('.step .label [dir="auto"]'));
    expect(texts.map((text) => text.textContent)).toEqual(['First', 'Third']);

    stepper.next();
    expect(stepper.selectedIndex()).toBe(2);
    stepper.previous();
    expect(stepper.selectedIndex()).toBe(0);
  });

  it('should not block a linear stepper on a hidden step', () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbStepperModule, NbStepperHiddenStepTestComponent],
    });
    const fixture = TestBed.createComponent(NbStepperHiddenStepTestComponent);
    fixture.detectChanges();
    const stepper = fixture.componentInstance.stepper();
    fixture.componentInstance.linear.set(true);
    fixture.componentInstance.firstCompleted.set(true);
    fixture.detectChanges();

    stepper.next();
    expect(stepper.selectedIndex()).toBe(2);
  });
});

@Component({
  template: `
    <nb-stepper>
      <nb-step label="First">
        <form (ngSubmit)="submitted.set(true)">
          <button id="next" nbStepperNext>Next</button>
        </form>
      </nb-step>
      <nb-step label="Second">Second</nb-step>
    </nb-stepper>
  `,
  imports: [NbStepperModule, FormsModule],
})
class NbStepperFormTestComponent {
  readonly stepper = viewChild.required(NbStepperComponent);
  readonly submitted = signal(false);
}

describe('Stepper: next button in a form', () => {
  it('should submit the form before moving to the next step', () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbStepperModule, FormsModule, NbStepperFormTestComponent],
    });
    const fixture = TestBed.createComponent(NbStepperFormTestComponent);
    fixture.detectChanges();

    // A real click runs change detection before the browser submits the form, which removes a form that's left.
    const next: HTMLButtonElement = fixture.nativeElement.querySelector('#next');
    next.addEventListener('click', () => fixture.detectChanges());
    next.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.submitted()).toBe(true);
    expect(fixture.componentInstance.stepper().selectedIndex()).toBe(1);
  });
});
