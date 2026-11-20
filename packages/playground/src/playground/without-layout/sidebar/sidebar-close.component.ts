import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import {
    NbButtonComponent,
    NbIconComponent,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbMenuComponent,
    NbMenuItem,
    NbSidebarComponent,
    NbSidebarService
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-sidebar-close',
    templateUrl: './sidebar-close.component.html',
    imports: [
        NbButtonComponent,
        NbIconComponent,
        NbLayoutColumnComponent,
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbMenuComponent,
        NbSidebarComponent
    ]
})
export class SidebarCloseComponent {
    private readonly sidebarService = inject(NbSidebarService)
    // The items link to sections of this page, wherever it's shown.
    private readonly link = inject(Router).url.split(/[?#]/)[0]

    readonly items: NbMenuItem[] = [
        { title: 'Dashboard', link: this.link, fragment: 'dashboard' },
        { title: 'Orders', link: this.link, fragment: 'orders' },
        { title: 'Customers', link: this.link, fragment: 'customers' }
    ]

    toggle() {
        this.sidebarService.toggle(false, 'menu')
    }
}
