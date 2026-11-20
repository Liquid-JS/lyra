import { Component, inject } from '@angular/core'
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbButtonComponent } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './toastr-showcase.component.html',
    styles: [
        `
      ::ng-deep nb-layout-column {
        height: 80vw;
      }
    `
    ],
    host: { class: 'example-items-rows' },
    imports: [NbButtonComponent]
})
export class ToastrShowcaseComponent {
    private readonly toastrService = inject(NbToastrService)

    private index = 0

    positions = NbGlobalPhysicalPosition

    showToast(position: NbGlobalPhysicalPosition, status: NbComponentStatus) {
        this.index += 1
        this.toastrService.show(status || 'Success', `Toast ${this.index}`, { position, status })
    }
}
