import { Component, inject } from '@angular/core'
import { NbDialogService, NbButtonComponent } from '@liquid-js/lyr-core'
import { HasBackdropDialogComponent } from './components/has-backdrop-dialog.component'

@Component({
    selector: 'nb-dialog-has-backdrop',
    templateUrl: './dialog-has-backdrop.component.html',
    styleUrls: ['./dialog-common.scss'],
    imports: [NbButtonComponent]
})
export class DialogHasBackdropComponent {
    private readonly dialogService = inject(NbDialogService)

    openWithBackdrop() {
        this.open(true)
    }

    openWithoutBackdrop() {
        this.open(false)
    }

    protected open(hasBackdrop: boolean) {
        this.dialogService.open(HasBackdropDialogComponent, { hasBackdrop })
    }
}
