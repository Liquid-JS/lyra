import { Component } from '@angular/core'
import {
    NbComponentSize,
    NbCardComponent,
    NbCardBodyComponent,
    NbActionsComponent,
    NbActionComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-action-sizes',
    templateUrl: './action-sizes.component.html',
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [NbCardComponent, NbCardBodyComponent, NbActionsComponent, NbActionComponent]
})
export class ActionSizesComponent {
    sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']
}
