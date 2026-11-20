import { Component, inject } from '@angular/core';
import { NbDialogService, NbButtonComponent } from '@liquid-js/lyr-core';
import { EscDialogComponent } from './components/esc-dialog.component';

@Component({
  selector: 'nb-dialog-esc',
  templateUrl: './dialog-esc.component.html',
  styleUrls: ['./dialog-common.scss'],
  imports: [NbButtonComponent],
})
export class DialogEscComponent {
  private readonly dialogService = inject(NbDialogService);

  openWithEscClose() {
    this.open(true);
  }

  openWithoutEscClose() {
    this.open(false);
  }

  protected open(closeOnEsc: boolean) {
    this.dialogService.open(EscDialogComponent, { closeOnEsc });
  }
}
