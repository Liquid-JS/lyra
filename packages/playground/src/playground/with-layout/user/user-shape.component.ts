import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbUserComponent } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './user-shape.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [NbCardComponent, NbCardBodyComponent, NbUserComponent]
})
export class NbUserShapeComponent {}
