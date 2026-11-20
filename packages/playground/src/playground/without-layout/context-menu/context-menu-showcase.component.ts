import { Component } from '@angular/core';
import {
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbLayoutColumnComponent,
  NbButtonComponent,
  NbContextMenuDirective,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-context-menu-showcase',
  templateUrl: './context-menu-showcase.component.html',
  styles: [
    `
      :host nb-layout-header ::ng-deep nav {
        justify-content: flex-end;
      }
    `,
  ],
  imports: [
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbButtonComponent,
    NbContextMenuDirective,
    NbLayoutColumnComponent,
  ],
})
export class ContextMenuShowcaseComponent {
  items = [{ title: 'Profile' }, { title: 'Logout' }];
}
