import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbUserComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-user-showcase',
  templateUrl: './user-showcase.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbUserComponent],
})
export class UserShowcaseComponent {
}
