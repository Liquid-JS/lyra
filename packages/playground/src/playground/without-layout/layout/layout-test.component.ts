import { Component } from '@angular/core';
import {
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbLayoutColumnComponent,
  NbLayoutFooterComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-layout-test',
  styles: [
    `
      :host ::ng-deep nb-layout-column {
        background-color: #fb75ff;
      }
      :host ::ng-deep nb-layout-column.right {
        background-color: #aeff34;
      }
      :host ::ng-deep nb-layout-column.left {
        background-color: #76ecff;
      }
    `,
  ],
  templateUrl: './layout-test.component.html',
  imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent, NbLayoutFooterComponent],
})
export class LayoutTestComponent {}
