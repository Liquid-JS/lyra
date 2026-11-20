import { Component, inject } from '@angular/core'
import {
    NbSidebarService,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbSidebarComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-layout-sidebar-subheader',
    templateUrl: './layout-sidebar-subheader.component.html',
    imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbSidebarComponent, NbLayoutColumnComponent]
})
export class LayoutSidebarSubheaderComponent {
    private readonly sidebarService = inject(NbSidebarService)

    toggle() {
        this.sidebarService.toggle(true)
        return false
    }
}
