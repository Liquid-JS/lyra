import { Component } from '@angular/core';
import { NbMenuItem, NbCardComponent, NbMenuComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-menu-children',
  templateUrl: './menu-children.component.html',
  imports: [NbCardComponent, NbMenuComponent],
})
export class MenuChildrenComponent {

  items: NbMenuItem[] = [
    {
      title: 'Profile',
      expanded: true,
      children: [
        {
          title: 'Change Password',
        },
        {
          title: 'Privacy Policy',
        },
        {
          title: 'Logout',
        },
      ],
    },
    {
      title: 'Shopping Bag',
    },
    {
      // A parent with its own page: the title goes there, and the chevron opens the submenu.
      title: 'Orders',
      link: '/menu/menu-children.component',
      children: [
        {
          title: 'Returns',
        },
        {
          title: 'Invoices',
        },
      ],
    },
  ];
}
