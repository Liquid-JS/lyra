import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbProgressBarComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-progress-bar-status',
  templateUrl: './progress-bar-status.component.html',
  styleUrls: ['./progress-bar-status.component.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbProgressBarComponent],
})
export class ProgressBarStatusComponent {}
