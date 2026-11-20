import { Component } from '@angular/core';
import { NbLayoutComponent, NbLayoutColumnComponent, NbSidebarComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  imports: [NbLayoutComponent, NbSidebarComponent, NbLayoutColumnComponent],
})
export class SidebarRightComponent {}
