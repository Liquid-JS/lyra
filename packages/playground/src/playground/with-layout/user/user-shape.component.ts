import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbUserComponent } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './user-shape.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbUserComponent],
})
export class NbUserShapeComponent {}
