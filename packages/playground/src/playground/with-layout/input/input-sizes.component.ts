import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbInputDirective } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './input-sizes.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbInputDirective],
})
export class InputSizesComponent {}
