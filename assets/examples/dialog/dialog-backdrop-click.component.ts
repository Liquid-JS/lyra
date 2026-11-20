import { Component, inject } from '@angular/core'
import { NbDialogService, NbButtonComponent } from '@liquid-js/lyr-core'
import { BackdropClickDialogComponent } from './components/backdrop-click-dialog.component'

@Component({
    selector: 'nb-dialog-backdrop-click',
    templateUrl: './dialog-backdrop-click.component.html',
    styleUrls: ['./dialog-common.scss'],
    imports: [NbButtonComponent]
})
export class DialogBackdropClickComponent {
    private readonly dialogService = inject(NbDialogService)

    openWithBackdropClick() {
        this.open(true)
    }

    openWithoutBackdropClick() {
        this.open(false)
    }

    protected open(closeOnBackdropClick: boolean) {
        this.dialogService.open(BackdropClickDialogComponent, { closeOnBackdropClick })
    }
}
