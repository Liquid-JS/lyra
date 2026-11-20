import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbProgressBarComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-progress-bar-showcase',
  templateUrl: './progress-bar-showcase.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbProgressBarComponent],
})
export class ProgressBarShowcaseComponent {}
