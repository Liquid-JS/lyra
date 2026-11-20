import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbSliderModule, NbSliderRange, NbValidationModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-slider-showcase',
  templateUrl: './slider-showcase.component.html',
  styleUrls: ['./slider-example.scss'],
  imports: [ReactiveFormsModule, NbCardModule, NbSliderModule, NbValidationModule],
})
export class SliderShowcaseComponent {
  readonly volume = new FormControl(40);
  readonly price = new FormControl<NbSliderRange>({ start: 50, end: 250 });
  readonly bass = new FormControl(3);
  readonly treble = new FormControl({ value: -2, disabled: true });

  readonly formatPrice = (value: number) => `$${value}`;
}
