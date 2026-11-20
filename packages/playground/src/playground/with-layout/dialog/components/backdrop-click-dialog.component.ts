import { Component, inject, input } from '@angular/core';
import {
  NbDialogRef,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbCardFooterComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-backdrop-click-dialog',
  templateUrl: './backdrop-click-dialog.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbButtonComponent,
  ],
})
export class BackdropClickDialogComponent {
  protected readonly ref = inject<NbDialogRef<BackdropClickDialogComponent>>(NbDialogRef);

  readonly title = input<string>();

  dismiss() {
    this.ref.close();
  }
}
