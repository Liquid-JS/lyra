import { Component, inject, signal } from '@angular/core'
import { NbButtonComponent, NbDialogService } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-dialog-confirm',
    templateUrl: './dialog-confirm.component.html',
    imports: [NbButtonComponent]
})
export class DialogConfirmComponent {
    private readonly dialogService = inject(NbDialogService)

    readonly invoices = signal(['INV-1041', 'INV-1042', 'INV-1043'])
    readonly log = signal<string[]>([])
    private attempts = 0

    async leave() {
        const confirmed = await this.dialogService.confirm({
            title: 'Leave without saving?',
            message: 'Your changes will be lost.',
            confirmText: 'Leave'
        })
        this.log.update((log) => [...log, confirmed ? 'Left the page' : 'Stayed on the page'])
    }

    async delete(invoice: string) {
        await this.dialogService.confirm({
            title: `Delete ${invoice}?`,
            message: 'The invoice is removed for everyone and can\'t be restored. The first attempt fails, to show a retry.',
            confirmText: 'Delete',
            status: 'danger',
            // Stands in for a request.
            action: () =>
                new Promise<void>((resolve, reject) =>
                    setTimeout(() => (this.attempts++ % 2 ? resolve() : reject(new Error('The server is unavailable'))), 1500)
                ).then(() => this.invoices.update((invoices) => invoices.filter((i) => i !== invoice)))
        })
    }
}
