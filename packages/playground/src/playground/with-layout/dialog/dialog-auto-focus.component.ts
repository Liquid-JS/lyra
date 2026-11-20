import { Component, inject } from '@angular/core';
import { NbDialogService, NbButtonComponent } from '@liquid-js/lyr-core';
import { AutoFocusDialogComponent } from './components/auto-focus-dialog.component';

@Component({
  selector: 'nb-dialog-auto-focus',
  templateUrl: './dialog-auto-focus.component.html',
  styleUrls: ['./dialog-common.scss'],
  imports: [NbButtonComponent],
})
export class DialogAutoFocusComponent {
  private readonly dialogService = inject(NbDialogService);

  openWithAutoFocus() {
    this.open(true);
  }

  openWithoutAutoFocus() {
    this.open(false);
  }

  protected open(autoFocus: boolean) {
    this.dialogService.open(AutoFocusDialogComponent, { autoFocus });
  }
}
