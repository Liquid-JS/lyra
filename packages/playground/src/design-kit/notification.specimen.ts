import { afterNextRender, Component, inject, TemplateRef, viewChild } from '@angular/core'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbComponentStatus,
    NbDialogService,
    NbToastrService,
    NbWindowService
} from '@liquid-js/lyr-core'

import { kit, STATUSES } from './specimen'

/**
 * Toasts in each status, a dialog and a window, as the services open them; each opened element is tagged
 * afterwards, as the services, not this template, render them.
 */
@Component({
    template: `
        <div class="specimens">
            <p>Toasts, a dialog and a window open over this page.</p>
        </div>
        <ng-template #dialog>
            <nb-card>
                <nb-card-header>Delete project?</nb-card-header>
                <nb-card-body>The project and its files will be deleted.</nb-card-body>
                <nb-card-footer>
                    <button nbButton
                        ghost>Cancel</button>
                    <button nbButton
                        status="danger">Delete</button>
                </nb-card-footer>
            </nb-card>
        </ng-template>
        <ng-template #window>The window's content.</ng-template>
    `,
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCardFooterComponent, NbButtonComponent]
})
export class NotificationSpecimenComponent {
    private readonly toastr = inject(NbToastrService)
    private readonly dialogs = inject(NbDialogService)
    private readonly windows = inject(NbWindowService)
    private readonly dialog = viewChild.required<TemplateRef<unknown>>('dialog')
    private readonly window = viewChild.required<TemplateRef<unknown>>('window')

    constructor() {
        afterNextRender(() => {
            const statuses = STATUSES as ReadonlyArray<NbComponentStatus>
            for (const status of statuses) {
                this.toastr.show('Your changes were saved.', 'Saved', { status, duration: 0, destroyByClick: false })
            }
            this.dialogs.open(this.dialog(), { hasBackdrop: false, autoFocus: false })
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
