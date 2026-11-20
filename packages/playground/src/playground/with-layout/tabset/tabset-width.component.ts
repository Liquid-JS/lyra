import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbTabsetComponent, NbTabComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-tabset-width',
  templateUrl: './tabset-width.component.html',
  styles: [`
    :host nb-tab {
      padding: 1.25rem;
    }
  `],
  imports: [NbCardComponent, NbCardBodyComponent, NbTabsetComponent, NbTabComponent],
})
export class TabsetWidthComponent {
}
