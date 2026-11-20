import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbTagListComponent, NbTagComponent } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './tag-status.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbTagListComponent, NbTagComponent],
})
export class TagStatusComponent {
}
