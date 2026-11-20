import { Component, inject } from '@angular/core';
import {
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

@Component({
  templateUrl: './toastr-positions.component.html',
  styles: [
    `
      ::ng-deep nb-layout-column {
        height: 80vw;
      }
    `,
  ],
  host: { class: 'example-items-rows' },
  imports: [NbButtonComponent],
})
export class ToastrPositionsComponent {
  private readonly toastrService = inject(NbToastrService);

  private index = 0;

  physicalPositions = NbGlobalPhysicalPosition;
  logicalPositions = NbGlobalLogicalPosition;

  showToast(position: NbGlobalPosition) {
    this.toastrService.show('This is super toast message', `This is toast number: ${++this.index}`, { position });
  }
}
