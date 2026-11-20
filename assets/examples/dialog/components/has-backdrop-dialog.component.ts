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
    selector: 'nb-has-backdrop-dialog',
    templateUrl: './has-backdrop-dialog.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbCardFooterComponent,
        NbButtonComponent
    ]
})
export class HasBackdropDialogComponent {
    protected readonly ref = inject<NbDialogRef<HasBackdropDialogComponent>>(NbDialogRef)

    readonly title = input<string>()

    dismiss() {
        this.ref.close()
    }
}
