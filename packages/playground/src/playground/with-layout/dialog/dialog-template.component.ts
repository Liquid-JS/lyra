import { Component, TemplateRef, inject } from '@angular/core';
import {
  NbDialogService,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbCardFooterComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-dialog-template',
  templateUrl: './dialog-template.component.html',
  styleUrls: ['./dialog-common.scss'],
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbButtonComponent,
  ],
})
export class DialogTemplateComponent {
  private readonly dialogService = inject(NbDialogService);

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }
}
