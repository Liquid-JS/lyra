import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbAlertComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-alert-colors',
  templateUrl: './alert-colors.component.html',
  styleUrls: ['./alert-example.component.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbAlertComponent],
})
export class AlertColorsComponent {
}
