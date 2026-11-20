import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbDatepickerDirective,
  NbDatepickerComponent,
  NbDialogRef,
  NbFormFieldComponent,
  NbInputDirective,
  NbRadioComponent,
  NbRadioGroupComponent,
} from '@liquid-js/lyr-core';

import { Environment } from '../relay-data';

/** What a new key is made with. */
export interface NewKey {
  name: string;
  environment: Environment;
  expires?: Date;
}

/** Whether a dialog's result is a new key, rather than nothing from a dialog dismissed. */
/** Asks for a new key's name, its environment and when it should stop working, and gives them back. */
@Component({
  selector: 'npg-relay-create-key-dialog',
  template: `
    <nb-card class="dialog">
      <nb-card-header>Create an API key</nb-card-header>
      <nb-card-body>
        <label class="label" for="key-name">Name</label>
        <input
          nbInput
          fullWidth
          id="key-name"
          placeholder="e.g. Checkout service"
          autocomplete="off"
          [(ngModel)]="name" />
        <p class="hint">Where the key is used, so you know what to rotate.</p>

        <p class="label">Environment</p>
        <nb-radio-group name="environment" [(value)]="environment">
          <nb-radio value="live">Live <span class="hint">· real deliveries</span></nb-radio>
          <nb-radio value="test">Test <span class="hint">· nothing leaves the sandbox</span></nb-radio>
        </nb-radio-group>

        <label class="label" for="key-expiry">Expires</label>
        <nb-form-field>
          <input
            nbInput
            fullWidth
            id="key-expiry"
            placeholder="Never"
            [nbDatepicker]="expiry"
            [(ngModel)]="expires" />
        </nb-form-field>
        <nb-datepicker #expiry />
      </nb-card-body>
      <nb-card-footer>
        <button nbButton ghost type="button" (click)="ref.close()">Cancel</button>
        <button nbButton status="primary" type="button" [disabled]="!name().trim()" (click)="create()">
          Create key
        </button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: `
    .dialog {
      width: min(28rem, calc(100vw - 2rem));
      margin: 0;
    }

    nb-card-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .label {
      margin: 0.75rem 0 0;
      font-size: 0.8125rem;
      font-weight: 600;

      &:first-child {
        margin-top: 0;
      }
    }

    .hint {
      margin: 0;
      color: var(--text-hint-color);
      font-size: 0.8125rem;
      font-weight: 400;
    }

    nb-radio-group {
      display: flex;
      flex-direction: column;
    }

    nb-card-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `,
  imports: [
    FormsModule,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbDatepickerComponent,
    NbDatepickerDirective,
    NbFormFieldComponent,
    NbInputDirective,
    NbRadioComponent,
    NbRadioGroupComponent,
  ],
})
export class RelayCreateKeyDialogComponent {
  protected readonly ref = inject<NbDialogRef<RelayCreateKeyDialogComponent, NewKey>>(NbDialogRef);

  readonly name = signal('');
  readonly environment = signal<Environment>('live');
  readonly expires = signal<Date | undefined>(undefined);

  create() {
    this.ref.close({ name: this.name().trim(), environment: this.environment(), expires: this.expires() });
  }
}
