import { afterNextRender, Component, inject, TemplateRef, viewChild } from '@angular/core'
import { NbComponentStatus, NbDialogService, NbToastrService, NbWindowService } from '@liquid-js/lyr-core'

import { kit, STATUSES } from './specimen'

/**
 * Toasts in each status, a confirm dialog and a window, as the services open them; each opened element is tagged
 * afterwards, as the services, not this template, render them.
 */
@Component({
    template: `
        <div class="specimens">
            <p>Toasts, a dialog and a window open over this page.</p>
        </div>
        <ng-template #window>The window's content.</ng-template>
    `
})
export class NotificationSpecimenComponent {
    private readonly toastr = inject(NbToastrService)
    private readonly dialogs = inject(NbDialogService)
    private readonly windows = inject(NbWindowService)
    private readonly window = viewChild.required<TemplateRef<unknown>>('window')

    constructor() {
        afterNextRender(() => {
            const statuses = STATUSES as ReadonlyArray<NbComponentStatus>
            for (const status of statuses) {
                this.toastr.show('Your changes were saved.', 'Saved', { status, duration: 0, destroyByClick: false })
            }
            // The dialog `confirm()` opens; a design's own content is a card in a dialog `open()` opens.
            void this.dialogs.confirm({ title: 'Delete project?', message: 'The project and its files will be deleted.', confirmText: 'Delete', status: 'danger' }, { hasBackdrop: false, autoFocus: false })
            this.windows.open(this.window(), { title: 'Window', hasBackdrop: false })
            setTimeout(() => {
                // By each toast's own status, as the toastr stacks the newest first.
                document.querySelectorAll('nb-toast').forEach((toast) => {
                    const status = statuses.find((candidate) => toast.classList.contains(`status-${candidate}`))
                    toast.setAttribute('data-kit', kit('toast', { status }))
                })
                document.querySelector('nb-dialog-container')?.setAttribute('data-kit', kit('dialog', {}))
                document.querySelector('nb-window')?.setAttribute('data-kit', kit('window', {}))
            }, 200)
        })
    }
}
