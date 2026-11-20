import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NbCardBodyComponent, NbCardComponent } from '@liquid-js/lyr-core';
import { NbColorPickerComponent } from '@liquid-js/lyr-extras/color-picker';

@Component({
  selector: 'nb-color-picker-showcase',
  templateUrl: './color-picker-showcase.component.html',
  styleUrls: ['./color-picker-showcase.component.scss'],
  imports: [NbCardComponent, NbCardBodyComponent, NbColorPickerComponent, ReactiveFormsModule],
})
export class ColorPickerShowcaseComponent {
  readonly color = new FormControl<string | null>('#3366ff');
  readonly presets = ['#3366ff', '#00d68f', '#0095ff', '#ffaa00', '#ff3d71', '#8f9bb3'];
}
