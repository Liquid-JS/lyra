import { Component, inject, signal } from '@angular/core'
import { NbDialogService, NbButtonComponent } from '@liquid-js/lyr-core'
import { DialogNamePromptComponent } from './components/name-prompt-dialog.component'

@Component({
    selector: 'nb-dialog-result',
    templateUrl: './dialog-result.component.html',
    styleUrls: ['./dialog-common.scss'],
    imports: [NbButtonComponent]
})
export class DialogResultComponent {
    private readonly dialogService = inject(NbDialogService)

    readonly names = signal<string[]>([])

    open() {
        this.dialogService.open(DialogNamePromptComponent).onClose.subscribe((name) => {
            if (typeof name === 'string' && name) {
                this.names.update((names) => [...names, name])
            }
        })
    }
}
