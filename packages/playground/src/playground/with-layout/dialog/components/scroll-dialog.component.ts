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
  selector: 'nb-scroll-dialog',
  templateUrl: './scroll-dialog.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbButtonComponent,
  ],
})
export class ScrollDialogComponent {
  protected readonly ref = inject<NbDialogRef<ScrollDialogComponent>>(NbDialogRef);

  readonly title = input<string>();

  dismiss() {
    this.ref.close();
  }
}
