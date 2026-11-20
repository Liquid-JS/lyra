import { Component } from '@angular/core';
import { NbLayoutComponent, NbLayoutColumnComponent, NbSidebarComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-sidebar-compacted',
  templateUrl: './sidebar-compacted.component.html',
  imports: [NbLayoutComponent, NbSidebarComponent, NbLayoutColumnComponent],
})
export class SidebarCompactedComponent {}
