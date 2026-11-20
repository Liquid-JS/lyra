import { Component } from '@angular/core';
import { NbLayoutComponent, NbLayoutHeaderComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-layout-header-test',
  templateUrl: './layout-header-test.component.html',
  imports: [NbLayoutComponent, NbLayoutHeaderComponent],
})
export class LayoutHeaderTestComponent {}
