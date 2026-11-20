import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NbCardBodyComponent, NbCardComponent, NbInputDirective, NbValidationModule } from '@liquid-js/lyr-core';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { password, confirm } = group.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
}

@Component({
  templateUrl: './validation-group.component.html',
  styleUrls: ['./validation-example.scss'],
  imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbInputDirective, NbValidationModule],
})
export class ValidationGroupComponent {
  readonly form = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm: new FormControl('', Validators.required),
    },
    { validators: passwordsMatch },
  );
}
