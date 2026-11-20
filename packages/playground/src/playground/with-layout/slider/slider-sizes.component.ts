import { Component } from '@angular/core';
import { NbCardModule, NbComponentSize, NbSliderModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-slider-sizes',
  templateUrl: './slider-sizes.component.html',
  styleUrls: ['./slider-example.scss'],
  imports: [NbCardModule, NbSliderModule],
})
export class SliderSizesComponent {
  volume: number | null = 60;
  readonly sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];
}
