import { Component } from '@angular/core';
import {
  NbLayoutComponent,
  NbLayoutColumnComponent,
  NbButtonComponent,
  NbContextMenuDirective,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-context-menu-modes',
  templateUrl: './context-menu-modes.component.html',
  styles: [
    `
      :host nb-layout-column {
        height: 50vw;
      }

      button {
        margin-inline-end: 1rem;
      }
    `,
  ],
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbButtonComponent, NbContextMenuDirective],
})
export class ContextMenuModesComponent {
  items = [{ title: 'Profile' }, { title: 'Logout' }];
}
