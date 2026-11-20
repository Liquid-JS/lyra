import { Component, inject, TemplateRef } from '@angular/core'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbDialogPosition,
    NbDialogRef,
    NbDialogService
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-dialog-position',
    templateUrl: './dialog-position.component.html',
    imports: [NbButtonComponent, NbCardComponent, NbCardBodyComponent, NbCardFooterComponent]
})
export class DialogPositionComponent {
    private readonly dialogService = inject(NbDialogService)

    open(dialog: TemplateRef<{ dialogRef: NbDialogRef<unknown> }>, position: NbDialogPosition) {
        this.dialogService.open(dialog, { position, positionOffset: '1rem' })
    }

    openNotice(notice: TemplateRef<{ dialogRef: NbDialogRef<unknown> }>) {
        this.dialogService.open(notice, {
            position: 'bottom-start',
            positionOffset: '1rem',
            hasBackdrop: false,
            hasScroll: true,
            autoFocus: false,
            closeOnEsc: false
        })
    }
}
