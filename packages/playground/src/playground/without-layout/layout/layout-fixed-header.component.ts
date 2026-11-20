import { Component } from '@angular/core';
import { NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-layout-fixed-header',
  templateUrl: './layout-fixed-header.component.html',
  imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent],
})
export class LayoutFixedHeaderComponent {}
