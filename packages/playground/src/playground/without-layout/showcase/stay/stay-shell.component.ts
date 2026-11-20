import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  NbButtonComponent,
  NbContextMenuDirective,
  NbIconComponent,
  NbLayoutColumnComponent,
  NbLayoutComponent,
  NbLayoutFooterComponent,
  NbLayoutHeaderComponent,
  NbMenuItem,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { portrait } from '../shared/showcase-images';

/** Stay's frame: a header with the search, your trips and your account, and a footer. */
@Component({
  selector: 'npg-stay-shell',
  templateUrl: './stay-shell.component.html',
  styleUrls: ['./stay-shell.component.scss'],
  imports: [
    NbButtonComponent,
    NbContextMenuDirective,
    NbIconComponent,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbUserComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class StayShellComponent {
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  readonly userPhoto = portrait('Jane Doe');
  readonly year = new Date().getFullYear();

  readonly userMenu: NbMenuItem[] = [
    { title: 'Trips', link: this.link('trips') },
    { title: 'Saved places', link: this.link('search') },
    { title: 'Account' },
    { title: 'Sign out' },
  ];

  readonly footer = [
    { title: 'Stay', links: ['About', 'Careers', 'Press', 'Gift cards'] },
    { title: 'Hosting', links: ['List your place', 'Host resources', 'Community', 'Insurance'] },
    { title: 'Support', links: ['Help centre', 'Safety', 'Cancellation options', 'Contact us'] },
  ];

  // A page of this app, wherever it's mounted: in the playground, or in the docs' examples.
  protected link(page: string): string {
    return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }));
  }
}
