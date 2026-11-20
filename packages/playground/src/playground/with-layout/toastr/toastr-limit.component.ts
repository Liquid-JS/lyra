import { NbGlobalLogicalPosition, NbToastrService, NbButtonComponent } from '@liquid-js/lyr-core';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'nb-toastr-limit',
  template: ` <button nbButton (click)="showToast()">Show only 3 toasts</button> `,
  styles: [
    `
      ::ng-deep nb-layout-column {
        height: 80vw;
      }
    `,
  ],
  imports: [NbButtonComponent],
})
export class ToastrLimitComponent {
  private readonly toastrService = inject(NbToastrService);

  i = 1;

  showToast() {
    this.toastrService.show(`Toast number ${this.i}`, `Toast with the limit`, {
      limit: 3,
      position: NbGlobalLogicalPosition.TOP_END,
    });
    this.i++;
  }
}
