import { Component } from '@angular/core'
import {
    NbTagComponent,
    NbCardComponent,
    NbCardBodyComponent,
    NbTagListComponent,
    NbTagComponent as NbTagComponent_1
} from '@liquid-js/lyr-core'

import { trees } from './trees-list'

@Component({
    templateUrl: './tag-removable.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbTagListComponent, NbTagComponent_1]
})
export class TagRemovableComponent {

    trees = trees

    onTagRemove(tagToRemove: NbTagComponent) {
        this.trees = this.trees.filter((t) => t !== tagToRemove.text())
    }
}
