import { Component, inject } from '@angular/core'
import { NbDialogService, NbButtonComponent } from '@liquid-js/lyr-core'
import { ScrollDialogComponent } from './components/scroll-dialog.component'

@Component({
    selector: 'nb-dialog-scroll',
    templateUrl: './dialog-scroll.component.html',
    styleUrls: ['./dialog-common.scss'],
    imports: [NbButtonComponent]
})
export class DialogScrollComponent {
    private readonly dialogService = inject(NbDialogService)

    openWithScroll() {
        this.open(true)
    }

    openWithoutScroll() {
        this.open(false)
    }

    protected open(hasScroll: boolean) {
        this.dialogService.open(ScrollDialogComponent, { hasScroll })
    }
}
