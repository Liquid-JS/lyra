import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbUserComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-user-hide-captions',
    templateUrl: './user-hide-captions.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [NbCardComponent, NbCardBodyComponent, NbUserComponent]
})
export class UserHideCaptionsComponent {

}
