import { Component, inject } from '@angular/core';
import {
  NbDialogRef,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbCardFooterComponent,
  NbInputDirective,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-name-prompt',
  templateUrl: './name-prompt-dialog.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbCardFooterComponent,
    NbButtonComponent,
  ],
})
export class DialogNamePromptComponent {
  protected readonly dialogRef = inject<NbDialogRef<DialogNamePromptComponent>>(NbDialogRef);

  cancel() {
    this.dialogRef.close();
  }

  submit(name: string) {
    this.dialogRef.close(name);
  }
}
