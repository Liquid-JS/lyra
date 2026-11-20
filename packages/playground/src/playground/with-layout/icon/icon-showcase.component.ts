import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbIconComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-icon-showcase',
  templateUrl: './icon-showcase.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbIconComponent],
})
export class IconShowcaseComponent {

  constructor() { }
}
