import { Component } from '@angular/core'

import { NbCardComponent, NbCardBodyComponent, NbTagListComponent, NbTagComponent } from '@liquid-js/lyr-core'
import { trees } from './trees-list'

@Component({
    templateUrl: './tag-appearance.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbTagListComponent, NbTagComponent]
})
export class TagAppearanceComponent {
    trees = trees
}
