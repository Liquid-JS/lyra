import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NbCardBodyComponent, NbCardComponent, NbInputDirective } from '@liquid-js/lyr-core';
import { NbMaskDirective, NbMaskOptions } from '@liquid-js/lyr-extras/mask';

@Component({
  selector: 'nb-mask-showcase',
  templateUrl: './mask-showcase.component.html',
  styleUrls: ['./mask-example.scss'],
  imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbInputDirective, NbMaskDirective],
})
export class MaskShowcaseComponent {
  readonly phone = new FormControl('2015550123');
  readonly date = new FormControl('');
  readonly zip = new FormControl('');
  readonly amount = new FormControl('');

  // The next characters of the mask show before they're typed.
  readonly eager: NbMaskOptions = { eager: true };
  // Numbers with two decimals, grouped in thousands.
  readonly money: NbMaskOptions = { number: { locale: 'en-US', fraction: 2 } };
}
