import { Component } from '@angular/core'
import { NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-layout-showcase',
    templateUrl: './layout-showcase.component.html',
    imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent]
})
export class LayoutShowcaseComponent {}
