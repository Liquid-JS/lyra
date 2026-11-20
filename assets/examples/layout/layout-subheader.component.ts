import { Component, inject } from '@angular/core'
import {
    NbSidebarService,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbActionsComponent,
    NbActionComponent,
    NbSidebarComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-layout-subheader',
    templateUrl: './layout-subheader.component.html',
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbActionsComponent,
        NbActionComponent,
        NbSidebarComponent,
        NbLayoutColumnComponent
    ]
})
export class LayoutSubheaderComponent {
    private readonly sidebarService = inject(NbSidebarService)

    toggle() {
        this.sidebarService.toggle(true)
        return false
    }
}
