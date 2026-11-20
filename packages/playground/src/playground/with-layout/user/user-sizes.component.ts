import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbUserComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-user-sizes',
    templateUrl: './user-sizes.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbUserComponent]
})
export class UserSizesComponent {
}
