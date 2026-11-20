import { Component } from '@angular/core';
import { NbMenuItem, NbCardComponent, NbMenuComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'npg-menu-autocollapse',
  templateUrl: './menu-autocollapse.component.html',
  imports: [NbCardComponent, NbMenuComponent],
})
export class MenuAutoCollapseComponent {
  items: NbMenuItem[] = [
    {
      title: 'Profile',
      expanded: true,
      ariaRole: 'button',
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
      ariaRole: 'button',
      children: [
        {
          title: 'First Product',
        },
        {
          title: 'Second Product',
        },
        {
          title: 'Third Product',
        },
      ],
    },
    {
      title: 'Orders',
      ariaRole: 'button',
      children: [
        {
          title: 'First Order',
        },
        {
          title: 'Second Order',
        },
        {
          title: 'Third Order',
        },
      ],
    },
  ];
}
