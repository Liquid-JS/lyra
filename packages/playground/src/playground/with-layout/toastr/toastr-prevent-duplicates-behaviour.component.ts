import { Component, inject } from '@angular/core'
import {
    NbComponentStatus,
    NbDuplicateToastBehaviour,
    NbToastrService,
    NbButtonComponent,
    NbRadioGroupComponent,
    NbRadioComponent
} from '@liquid-js/lyr-core'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'nb-toastr-prevent-duplicates-behaviour',
    templateUrl: './toastr-prevent-duplicates-behaviour.component.html',
    styles: [
        `
      ::ng-deep nb-layout-column {
        height: 80vw;
      }
    `
    ],
    host: { class: 'example-items-rows' },
    imports: [NbButtonComponent, NbRadioGroupComponent, FormsModule, NbRadioComponent]
})
export class ToastrPreventDuplicatesBehaviourComponent {
    private readonly toastrService = inject(NbToastrService)

    options = [
        { value: 'previous', label: 'Duplicate previous', checked: true },
        { value: 'all', label: 'Duplicate all' }
    ]

    option: NbDuplicateToastBehaviour = 'previous'

    showToast(message: string, status: NbComponentStatus) {
        this.toastrService.show(message, 'This is toast title', {
            preventDuplicates: true,
            duplicatesBehaviour: this.option,
            status
        })
    }
}
