import { Component } from '@angular/core';
import { NbLayoutComponent, NbLayoutFooterComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-layout-footer-test',
  templateUrl: './layout-footer-test.component.html',
  imports: [NbLayoutComponent, NbLayoutFooterComponent],
})
export class LayoutFooterTestComponent {}
