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
    selector: 'nb-sidebar-fixed',
    templateUrl: './sidebar-fixed.component.html',
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbButtonComponent,
        NbSidebarComponent,
        NbLayoutColumnComponent
    ]
})
export class SidebarFixedComponent {
    private readonly sidebarService = inject(NbSidebarService)

    toggle() {
        this.sidebarService.toggle()
    }
}
