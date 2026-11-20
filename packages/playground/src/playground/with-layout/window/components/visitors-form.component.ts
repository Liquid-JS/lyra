import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbWindowRef, NbInputDirective, NbButtonComponent } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './visitors-form.component.html',
  imports: [FormsModule, ReactiveFormsModule, NbInputDirective, NbButtonComponent],
})
export class VisitorsFormComponent {
  private readonly fb = inject(FormBuilder);
  readonly windowRef = inject(NbWindowRef);

  form: FormGroup;

  constructor() {
    const fb = this.fb;

    this.form = fb.group({
      name: null,
    });
  }

  onSubmit() {
    this.windowRef.close(this.form.value.name);
  }

  close() {
    this.windowRef.close();
  }
}
