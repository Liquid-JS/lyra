import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbIconComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-icon-colors',
  templateUrl: './icon-colors.component.html',
  styleUrls: ['./icon-colors.component.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbIconComponent],
})
export class IconColorsComponent {
}
