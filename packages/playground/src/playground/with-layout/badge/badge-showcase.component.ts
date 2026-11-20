import { Component } from '@angular/core';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbBadgeComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-badge-showcase',
  templateUrl: './badge-showcase.component.html',
  imports: [NbCardComponent, NbCardHeaderComponent, NbBadgeComponent, NbCardBodyComponent],
})
export class BadgeShowcaseComponent {
}
