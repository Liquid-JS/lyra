import { Component, viewChild } from '@angular/core';
import {
  NbContextMenuDirective,
  NbLayoutComponent,
  NbLayoutColumnComponent,
  NbButtonComponent,
  NbContextMenuDirective as NbContextMenuDirective_1,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-context-menu-noop',
  templateUrl: './context-menu-noop.component.html',
  styles: [
    `
      :host nb-layout-column {
        height: 50vw;
      }
      .menu-target {
        margin-bottom: 7rem;
      }
      button {
        margin-inline-end: 1rem;
        margin-top: 1rem;
      }
    `,
  ],
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbButtonComponent, NbContextMenuDirective_1],
})
export class ContextMenuNoopComponent {
  readonly contextMenu = viewChild.required(NbContextMenuDirective);

  items = [{ title: 'Profile' }, { title: 'Logout' }];

  open() {
    this.contextMenu().show();
  }

  close() {
    this.contextMenu().hide();
  }
}
