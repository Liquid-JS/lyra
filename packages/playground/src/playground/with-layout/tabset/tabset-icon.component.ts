import { Component } from '@angular/core'
import {
    NbIconConfig,
    NbCardComponent,
    NbCardBodyComponent,
    NbTabsetComponent,
    NbTabComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-tabset-icon',
    templateUrl: './tabset-icon.component.html',
    styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    :host nb-tab {
      padding: 1.25rem;
    }
  `],
    imports: [NbCardComponent, NbCardBodyComponent, NbTabsetComponent, NbTabComponent]
})
export class TabsetIconComponent {
    bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'icons' }
}
