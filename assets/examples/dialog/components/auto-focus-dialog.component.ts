import { Component, inject, input } from '@angular/core'
import {
    NbDialogRef,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbButtonComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-auto-focus-dialog',
    templateUrl: './auto-focus-dialog.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardFooterComponent,
        NbButtonComponent
    ]
})
export class AutoFocusDialogComponent {
    protected readonly ref = inject<NbDialogRef<AutoFocusDialogComponent>>(NbDialogRef)

    readonly title = input<string>()

    dismiss() {
        this.ref.close()
    }
}
