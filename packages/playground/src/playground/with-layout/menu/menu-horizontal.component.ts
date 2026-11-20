import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbMenuComponent,
  NbMenuItem,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss'],
  imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbMenuComponent],
})
export class MenuHorizontalComponent {
  // The items link to sections of this page, wherever it's shown.
  protected readonly link = inject(Router).url.split(/[?#]/)[0];

  readonly items: NbMenuItem[] = [
    { title: 'Overview', link: this.link, fragment: 'overview' },
    {
      title: 'Products',
      children: [
        { title: 'Phones', link: this.link, fragment: 'phones' },
        { title: 'Laptops', link: this.link, fragment: 'laptops' },
        {
          title: 'Accessories',
          children: [
            { title: 'Chargers', link: this.link, fragment: 'chargers' },
            { title: 'Cases', link: this.link, fragment: 'cases' },
          ],
        },
      ],
    },
    { title: 'Pricing', link: this.link, fragment: 'pricing' },
    {
      title: 'Support',
      children: [
        { title: 'Documentation', link: this.link, fragment: 'documentation' },
        { title: 'Contact us', link: this.link, fragment: 'contact' },
      ],
    },
  ];
}
