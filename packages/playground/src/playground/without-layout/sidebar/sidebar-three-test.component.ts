import { Component } from '@angular/core';
import {
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbLayoutFooterComponent,
  NbSidebarComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-sidebar-three-test',
  styles: [
    `
      :host ::ng-deep nb-layout-column {
        background-color: #76ecff;
      }
    `,
  ],
  templateUrl: './sidebar-three-test.component.html',
  imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbSidebarComponent, NbLayoutFooterComponent],
})
export class SidebarThreeTestComponent {}
