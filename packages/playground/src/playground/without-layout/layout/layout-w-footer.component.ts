import { Component } from '@angular/core';
import {
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbLayoutColumnComponent,
  NbLayoutFooterComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-w-footer-showcase',
  templateUrl: './layout-w-footer.component.html',
  imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent, NbLayoutFooterComponent],
})
export class LayoutWFooterComponent {}
