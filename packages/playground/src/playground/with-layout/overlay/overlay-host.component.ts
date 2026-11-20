import { Component, signal } from '@angular/core';
import {
  NbButtonComponent,
  NbCardModule,
  NbOptionComponent,
  NbOverlayHostDirective,
  NbSelectComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-overlay-host',
  templateUrl: './overlay-host.component.html',
  styleUrls: ['./overlay-host.component.scss'],
  imports: [NbButtonComponent, NbCardModule, NbOptionComponent, NbOverlayHostDirective, NbSelectComponent],
})
export class OverlayHostComponent {
  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange'];
  readonly fruit = signal<string | undefined>(undefined);
}
