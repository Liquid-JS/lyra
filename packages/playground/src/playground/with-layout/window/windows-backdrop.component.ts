import { Component, TemplateRef, inject, viewChild } from '@angular/core'
import { NbWindowService, NbButtonComponent } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './windows-backdrop.component.html',
    styleUrls: ['./window.scss'],
    imports: [NbButtonComponent]
})
export class WindowsBackdropComponent {
    private readonly windowService = inject(NbWindowService)

    readonly escCloseTemplate = viewChild.required('escClose', { read: TemplateRef })
    readonly disabledEscTemplate = viewChild.required('disabledEsc', { read: TemplateRef })

    openWindowWithBackdrop() {
        this.windowService.open(this.escCloseTemplate(), { title: 'Window with backdrop', hasBackdrop: true })
    }

    openWindowWithoutBackdrop() {
        this.windowService.open(this.disabledEscTemplate(), {
            title: 'Window without backdrop',
            hasBackdrop: false,
            closeOnEsc: false
        })
    }
}
