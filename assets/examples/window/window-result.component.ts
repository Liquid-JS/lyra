import { Component, inject, signal } from '@angular/core'
import { NbWindowService, NbButtonComponent } from '@liquid-js/lyr-core'
import { VisitorsFormComponent } from './components/visitors-form.component'

@Component({
    templateUrl: './window-result.component.html',
    styleUrls: ['./window.scss'],
    imports: [NbButtonComponent]
})
export class WindowResultComponent {
    private readonly windowService = inject(NbWindowService)

    readonly visitors = signal<string[]>([])

    openWindow() {
        const windowRef = this.windowService.open(VisitorsFormComponent, { title: 'Window' })

        windowRef.onClose.subscribe((visitor) => {
            if (typeof visitor === 'string') {
                this.visitors.update((visitors) => [...visitors, visitor])
            }
        })
    }
}
