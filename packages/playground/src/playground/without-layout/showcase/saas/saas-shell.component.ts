import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  NbActionComponent,
  NbActionsComponent,
  NbButtonComponent,
  NbContextMenuDirective,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbLayoutColumnComponent,
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbMenuComponent,
  NbMenuItem,
  NbPrefixDirective,
  NbSidebarComponent,
  NbSidebarService,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { portrait } from '../shared/showcase-images';

/**
 * A SaaS app's frame: a header with search, notifications and the user's menu, and a sidebar with the app's sections
 * around the page.
 */
@Component({
  selector: 'npg-saas-shell',
  templateUrl: './saas-shell.component.html',
  styleUrls: ['./saas-shell.component.scss'],
  imports: [
    NbActionComponent,
    NbActionsComponent,
    NbButtonComponent,
    NbContextMenuDirective,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbMenuComponent,
    NbPrefixDirective,
    NbSidebarComponent,
    NbUserComponent,
    RouterLink,
    RouterOutlet,
  ],
})
export class SaasShellComponent {
  readonly userPhoto = portrait('Jane Doe');
  protected readonly sidebar = inject(NbSidebarService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  readonly menu: NbMenuItem[] = [
    { title: 'Dashboard', icon: 'home-outline', link: this.link('dashboard'), badge: { text: '3', status: 'primary' } },
    { title: 'Manage', group: true },
    { title: 'Customers', icon: 'people-outline', link: this.link('customers') },
    { title: 'Invoices', icon: 'file-text-outline', link: this.link('invoice') },
    {
      title: 'Reports',
      icon: 'pie-chart-outline',
      children: [
        { title: 'Revenue', link: this.link('dashboard') },
        { title: 'Customers', link: this.link('customers') },
      ],
    },
    { title: 'Account', group: true },
    { title: 'Settings', icon: 'settings-2-outline', link: this.link('settings') },
    { title: 'Help centre', icon: 'question-mark-circle-outline', badge: { text: 'new', status: 'success' } },
  ];

  readonly userMenu: NbMenuItem[] = [{ title: 'Profile', link: this.link('settings') }, { title: 'Sign out' }];

  toggleSidebar() {
    this.sidebar.toggle(true, 'saas');
  }

  // A page of this app, wherever it's mounted: in the playground, or in the docs' examples.
  protected link(page: string): string {
    return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }));
  }
}
