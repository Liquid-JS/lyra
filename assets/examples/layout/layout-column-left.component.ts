import { Component } from '@angular/core'
import { NbLayoutComponent, NbLayoutColumnComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-layout-column-left',
    templateUrl: './layout-column-left.component.html',
    imports: [NbLayoutComponent, NbLayoutColumnComponent]
})
export class LayoutColumnLeftComponent {}
