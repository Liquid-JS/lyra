import { Component } from '@angular/core';
import {
  NbLayoutComponent,
  NbLayoutColumnComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbUserComponent,
  NbContextMenuDirective,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-context-menu-test',
  templateUrl: './context-menu-test.component.html',
  imports: [
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbUserComponent,
    NbContextMenuDirective,
  ],
})
export class ContextMenuTestComponent {
  items = [{ title: 'Profile', link: '/user' }, { title: 'Logout', link: '/popover' }, { title: 'Another action' }];

  itemsWithIcons = [
    { title: 'Profile', link: '/user', icon: 'person-outline' },
    { title: 'Logout', link: '/popover', icon: 'settings-outline' },
  ];
}
