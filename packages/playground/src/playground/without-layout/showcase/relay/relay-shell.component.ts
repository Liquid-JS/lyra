import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  NbLayoutFooterComponent,
  NbLayoutHeaderComponent,
  NbMenuComponent,
  NbMenuItem,
  NbOptionComponent,
  NbPrefixDirective,
  NbSelectComponent,
  NbSidebarComponent,
  NbSidebarService,
  NbUserComponent,
} from '@liquid-js/lyr-core';
import { filter, map, startWith } from 'rxjs/operators';

import { portrait } from '../shared/showcase-images';
import { Environment } from './relay-data';

type Frame = 'site' | 'console';

/**
 * Relay's frame: for the site, a top bar with the product's pages and a footer; for the console, a header with the
 * environment and the account, and a sidebar with the console's sections. Each page's route says which it's in.
 */
@Component({
  selector: 'npg-relay-shell',
  templateUrl: './relay-shell.component.html',
  styleUrls: ['./relay-shell.component.scss'],
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
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    NbMenuComponent,
    NbOptionComponent,
    NbPrefixDirective,
    NbSelectComponent,
    NbSidebarComponent,
    NbUserComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  host: { '[class.console]': 'frame() === "console"' },
})
export class RelayShellComponent {
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly sidebar = inject(NbSidebarService);

  readonly year = new Date().getFullYear();
  readonly userPhoto = portrait('Jane Doe');
  environment: Environment = 'live';

  /** Which frame the page shown is in, from its route's data. */
  readonly frame = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map((): Frame => {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        return (child?.snapshot.data['frame'] as Frame | undefined) ?? 'site';
      }),
    ),
    { requireSync: true },
  );

  readonly consoleMenu: NbMenuItem[] = [
    { title: 'Overview', icon: 'activity-outline', link: this.link('overview') },
    { title: 'Events', icon: 'list-outline', link: this.link('events') },
    { title: 'Endpoints', icon: 'link-2-outline', link: this.link('overview') },
    { title: 'Developers', group: true },
    { title: 'API keys', icon: 'lock-outline', link: this.link('keys') },
    { title: 'Docs', icon: 'book-open-outline', link: this.link('docs') },
    { title: 'Status', icon: 'wifi-outline', badge: { text: 'all good', status: 'success' } },
  ];

  readonly userMenu: NbMenuItem[] = [
    { title: 'Account settings' },
    { title: 'Billing' },
    { title: 'Back to the site', link: this.link('home') },
    { title: 'Sign out' },
  ];

  // The site's pages, for the phone's menu.
  readonly siteMenu: NbMenuItem[] = [
    { title: 'Docs', link: this.link('docs') },
    { title: 'Pricing', link: this.link('pricing') },
    { title: 'Sign in', link: this.link('overview') },
  ];

  // The footer's links that have a page in the showcase; the others are placeholders.
  readonly footerPages: Partial<Record<string, string>> = { Pricing: this.link('pricing'), Docs: this.link('docs') };

  readonly footer = [
    { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Status'] },
    { title: 'Developers', links: ['Docs', 'API reference', 'SDKs', 'Examples'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
  ];

  toggleSidebar() {
    this.sidebar.toggle(true, 'relay');
  }

  // A page of this app, wherever it's mounted: in the playground, or in the docs' examples.
  protected link(page: string): string {
    return this.router.serializeUrl(this.router.createUrlTree([page], { relativeTo: this.route }));
  }
}
