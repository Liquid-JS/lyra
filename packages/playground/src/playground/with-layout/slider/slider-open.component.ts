import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbSliderModule, NbSliderRange, NbValidationModule } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-slider-open',
  templateUrl: './slider-open.component.html',
  styleUrls: ['./slider-example.scss'],
  imports: [ReactiveFormsModule, NbCardModule, NbSliderModule, NbValidationModule],
})
export class SliderOpenComponent {
  readonly seats = new FormControl(5);
  readonly adjustment = new FormControl<number | null>(null);
  readonly team = new FormControl<NbSliderRange>({ start: 3, end: 12 });
}
