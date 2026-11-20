import { Component, inject } from '@angular/core'
import { NbToastrService, NbButtonComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-toastr-duration',
    templateUrl: './toastr-duration.component.html',
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
export class ToastrDurationComponent {
    private readonly toastrService = inject(NbToastrService)

    private index = 0

    showToast(duration: number) {
        this.toastrService.show('This is super toast message', `This is toast number: ${++this.index}`, { duration })
    }
}
