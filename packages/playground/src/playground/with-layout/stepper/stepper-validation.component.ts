import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbStepperComponent,
  NbStepComponent,
  NbInputDirective,
  NbButtonComponent,
  NbStepperNextDirective,
  NbStepperPreviousDirective,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-stepper-validation',
  styleUrls: ['stepper-playground.component.scss'],
  templateUrl: './stepper-validation.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbStepperComponent,
    NbStepComponent,
    FormsModule,
    ReactiveFormsModule,
    NbInputDirective,
    NbButtonComponent,
    NbStepperNextDirective,
    NbStepperPreviousDirective,
  ],
})
export class StepperValidationComponent {
  private readonly fb = inject(FormBuilder);

  readonly firstForm = this.fb.group({
    firstCtrl: ['', Validators.required],
  });

  readonly secondForm = this.fb.group({
    secondCtrl: ['', Validators.required],
  });

  readonly thirdForm = this.fb.group({
    thirdCtrl: ['', Validators.required],
  });

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }
}
