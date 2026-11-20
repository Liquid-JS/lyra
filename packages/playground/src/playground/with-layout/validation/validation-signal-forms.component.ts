import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { NbButtonComponent, NbCardBodyComponent, NbCardComponent, NbInputDirective, NbValidationModule } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './validation-signal-forms.component.html',
  styleUrls: ['./validation-example.scss'],
  imports: [
    FormField,
    FormRoot,
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbButtonComponent,
    NbValidationModule,
  ],
})
export class ValidationSignalFormsComponent {
  readonly model = signal({ name: '', email: '' });
  readonly form = form(this.model, (path) => {
    required(path.name, { message: 'Tell us what to call you' });
    required(path.email);
    email(path.email);
  }, {
    // Submitting marks every field touched, so their errors show.
    submission: { action: async () => undefined },
  });
}
