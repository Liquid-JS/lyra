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
  selector: 'nb-showcase-dialog',
  templateUrl: './showcase-dialog.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbButtonComponent,
  ],
})
export class ShowcaseDialogComponent {
  protected readonly ref = inject<NbDialogRef<ShowcaseDialogComponent>>(NbDialogRef);

  readonly title = input<string>();

  dismiss() {
    this.ref.close();
  }
}
