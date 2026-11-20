import { Component } from '@angular/core'
import { NbLayoutComponent, NbLayoutColumnComponent, NbSidebarComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-sidebar-showcase',
    templateUrl: './sidebar-showcase.component.html',
    imports: [NbLayoutComponent, NbSidebarComponent, NbLayoutColumnComponent]
})
export class SidebarShowcaseComponent {}
