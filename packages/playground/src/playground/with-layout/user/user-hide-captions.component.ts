import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbUserComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-user-hide-captions',
  templateUrl: './user-hide-captions.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbUserComponent],
})
export class UserHideCaptionsComponent {

}
