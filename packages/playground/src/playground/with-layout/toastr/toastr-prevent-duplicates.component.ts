import { Component, inject } from '@angular/core';
import { NbToastrService, NbButtonComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toastr-prevent-duplicates',
  templateUrl: './toastr-prevent-duplicates.component.html',
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
export class ToastrPreventDuplicatesComponent {
  private readonly toastrService = inject(NbToastrService);

  showToast(preventDuplicates: boolean) {
    this.toastrService.show('This is super toast message', `This is toast title`, { preventDuplicates });
  }
}
