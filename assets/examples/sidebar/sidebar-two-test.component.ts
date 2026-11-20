import { Component } from '@angular/core'
import {
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutFooterComponent,
    NbSidebarComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-sidebar-two-test',
    styles: [
        `
      :host ::ng-deep nb-layout-column {
        background-color: #76ecff;
      }
    `
    ],
    templateUrl: './sidebar-two-test.component.html',
    imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbSidebarComponent, NbLayoutFooterComponent]
})
export class SidebarTwoTestComponent {}
