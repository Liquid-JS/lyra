import { Component, inject } from '@angular/core';
import {
  NbToastrService,
  NbComponentStatus,
  NbCardComponent,
  NbCardBodyComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toastr-statuses',
  templateUrl: './toastr-statuses.component.html',
  styles: [
    `
      ::ng-deep nb-layout-column {
        height: 80vw;
      }
    `,
  ],
  host: { class: 'example-items-rows' },
  imports: [NbCardComponent, NbCardBodyComponent, NbButtonComponent],
})
export class ToastrStatusesComponent {
  private readonly toastrService = inject(NbToastrService);

  private index = 0;

  showToast(status: NbComponentStatus) {
    this.toastrService.show(status, `Toast: ${++this.index}`, { status });
  }
}
