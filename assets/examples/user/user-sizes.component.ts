import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbUserComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-user-sizes',
    templateUrl: './user-sizes.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [NbCardComponent, NbCardBodyComponent, NbUserComponent]
})
export class UserSizesComponent {
}
