import { Component, OnInit, inject } from '@angular/core'

import {
    NbSidebarService,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbLayoutFooterComponent,
    NbSidebarComponent,
    NbSidebarHeaderComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-sidebar-test',
    styles: [
        `
      :host ::ng-deep nb-layout-column {
        background-color: #76ecff;
      }
    `
    ],
    templateUrl: './sidebar-test.component.html',
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbSidebarComponent,
        NbSidebarHeaderComponent,
        NbLayoutColumnComponent,
        NbLayoutFooterComponent
    ]
})
export class SidebarTestComponent implements OnInit {
    private readonly sidebarService = inject(NbSidebarService)

    content = 'First '

    collapseLeft() {
        this.sidebarService.toggle(false, 'left')
    }

    collapseRight() {
        this.sidebarService.toggle(true, 'right')
    }

    ngOnInit() {
        for (let i = 0; i < 1000; i++) {
            this.content += 'Lyra '
        }
        this.content += ' Last'
    }
}
