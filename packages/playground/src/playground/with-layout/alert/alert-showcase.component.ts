import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbAlertComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-alert-showcase',
  templateUrl: './alert-showcase.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbAlertComponent],
})
export class AlertShowcaseComponent {
}
