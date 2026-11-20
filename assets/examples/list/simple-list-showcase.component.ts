import { Component } from '@angular/core'
import { NbCardComponent, NbCardHeaderComponent, NbListComponent, NbListItemComponent } from '@liquid-js/lyr-core'
import { fruits } from './fruits-list'

@Component({
    templateUrl: './simple-list-showcase.component.html',
    styleUrls: ['./simple-list-showcase.component.scss'],
    imports: [NbCardComponent, NbCardHeaderComponent, NbListComponent, NbListItemComponent]
})
export class SimpleListShowcaseComponent {
    fruits = fruits
}
