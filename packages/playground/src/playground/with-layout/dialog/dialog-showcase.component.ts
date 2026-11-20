import { Component, inject } from '@angular/core'
import { NbDialogService, NbButtonComponent } from '@liquid-js/lyr-core'
import { ShowcaseDialogComponent } from './components/showcase-dialog.component'

@Component({
    selector: 'nb-dialog-showcase',
    template: '<button nbButton (click)="open()">Open Dialog</button>',
    styleUrls: ['./dialog-common.scss'],
    imports: [NbButtonComponent]
})
export class DialogShowcaseComponent {
    private readonly dialogService = inject(NbDialogService)

    open() {
        this.dialogService.open(ShowcaseDialogComponent, {
            context: {
                title: 'This is a title passed to the dialog component'
            }
        })
    }
}
