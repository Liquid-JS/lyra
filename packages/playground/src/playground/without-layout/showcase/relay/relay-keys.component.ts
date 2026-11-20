import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  NB_WINDOW,
  NbAlertComponent,
  NbButtonComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbContextMenuDirective,
  NbDataTableModule,
  NbDialogService,
  NbIconComponent,
  NbMenuItem,
  nbTableDataSource,
  NbTagComponent,
  NbToastrService,
} from '@liquid-js/lyr-core';

import { NewKey, RelayCreateKeyDialogComponent } from './parts/relay-create-key-dialog.component';
import { ApiKey, KEYS, newKeySecret } from './relay-data';

/** The customer's API keys: each key's name, prefix, environment and use, and a dialog to create one, shown once. */
@Component({
  selector: 'npg-relay-keys',
  templateUrl: './relay-keys.component.html',
  styleUrls: ['./relay-keys.component.scss'],
  imports: [
    DatePipe,
    NbAlertComponent,
    NbButtonComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbContextMenuDirective,
    NbDataTableModule,
    NbIconComponent,
    NbTagComponent,
  ],
})
export class RelayKeysComponent {
  private readonly dialogs = inject(NbDialogService);
  private readonly toastr = inject(NbToastrService);
  private readonly window = inject(NB_WINDOW);

  readonly columns = ['name', 'key', 'environment', 'created', 'lastUsed', 'actions'];
  readonly keys = signal<ApiKey[]>(KEYS);
  readonly source = nbTableDataSource({ data: this.keys, rowId: (key) => key.id });
  readonly live = computed(() => this.keys().filter((key) => key.environment === 'live').length);
  /** The key just created, whose secret shows once. */
  readonly created = signal<{ key: ApiKey; secret: string } | undefined>(undefined);
  readonly actions: NbMenuItem[] = [{ title: 'Rename' }, { title: 'Roll the secret' }, { title: 'Revoke' }];

  create() {
    this.dialogs
      .open<RelayCreateKeyDialogComponent, NewKey>(RelayCreateKeyDialogComponent)
      .onClose.subscribe((result) => {
        if (!result) {
          return;
        }
        const secret = newKeySecret(result.environment);
        const key: ApiKey = {
          id: `key_${Date.now()}`,
          name: result.name,
          prefix: secret.slice(0, 12),
          environment: result.environment,
          created: new Date(),
        };
        this.keys.update((keys) => [key, ...keys]);
        this.created.set({ key, secret });
      });
  }

  async copy(text: string, what: string) {
    try {
      await this.window?.navigator.clipboard.writeText(text);
      this.toastr.success(`The ${what} is on your clipboard.`, 'Copied', { duration: 2500 });
    } catch {
      this.toastr.warning(`Select the ${what} and copy it.`, 'Nothing copied', { duration: 3000 });
    }
  }
}
