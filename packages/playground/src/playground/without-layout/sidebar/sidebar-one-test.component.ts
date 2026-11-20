import { Component } from '@angular/core';
import { NbLayoutComponent, NbSidebarComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-sidebar-one-test',
  styles: [
    `
      :host ::ng-deep nb-layout-column {
        background-color: #76ecff;
      }
    `,
  ],
  templateUrl: './sidebar-one-test.component.html',
  imports: [NbLayoutComponent, NbSidebarComponent],
})
export class SidebarOneTestComponent {}
