import { Component, inject } from '@angular/core'
import {
    NbSidebarService,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbButtonComponent,
    NbSidebarComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-sidebar-toggle',
    templateUrl: './sidebar-toggle.component.html',
    styles: [
        `
      :host nb-layout-header button:last-child {
        margin-inline-start: auto;
      }
    `
    ],
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbButtonComponent,
        NbSidebarComponent,
        NbLayoutColumnComponent
    ]
})
export class SidebarToggleComponent {
    private readonly sidebarService = inject(NbSidebarService)

    toggle() {
        this.sidebarService.toggle(false, 'left')
    }

    toggleCompact() {
        this.sidebarService.toggle(true, 'right')
    }
}
