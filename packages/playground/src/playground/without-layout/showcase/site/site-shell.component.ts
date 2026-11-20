import { ApplicationRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  NbButtonComponent,
  NbContextMenuDirective,
  NbIconComponent,
  NbInputDirective,
  NbLayoutColumnComponent,
  NbLayoutComponent,
  NbLayoutFooterComponent,
  NbLayoutHeaderComponent,
  NbMenuItem,
  NbMenuService,
  NB_DOCUMENT,
} from '@liquid-js/lyr-core';
import { filter } from 'rxjs';

/** A product site's frame: a header with its sections and sign-in, and a footer with links and a newsletter. */
@Component({
  selector: 'npg-site-shell',
  templateUrl: './site-shell.component.html',
  styleUrls: ['./site-shell.component.scss'],
  imports: [
    NbButtonComponent,
    NbContextMenuDirective,
    NbIconComponent,
    NbInputDirective,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbLayoutFooterComponent,
    NbLayoutHeaderComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class SiteShellComponent {
  /** The address the newsletter goes to, once subscribed. */
  readonly subscribed = signal<string | undefined>(undefined);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly appRef = inject(ApplicationRef);
  protected readonly document = inject(NB_DOCUMENT);

  readonly year = new Date().getFullYear();
  // The phone menu: the home page's sections, the blog and sign-in.
  readonly sections: NbMenuItem[] = [
    { title: 'Features', data: { section: 'features' } },
    { title: 'Pricing', data: { section: 'pricing' } },
    { title: 'Blog', data: { path: 'blog' } },
    { title: 'Sign in', data: { path: '../auth/sign-in' } },
  ];

  constructor() {
    inject(NbMenuService)
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'site-sections'),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(({ item }) => {
        const { section, path } = item.data as { section?: string; path?: string };
        if (section) {
          void this.router.navigate(['home'], { relativeTo: this.route, fragment: section });
          void this.scrollTo(section);
        } else if (path) {
          void this.router.navigate([path], { relativeTo: this.route });
        }
      });
  }

  /**
   * Scrolls to a section of the home page once the link's navigation to it settles, also when it's the page shown, so a
   * second click on the same link scrolls there again.
   */
  async scrollTo(section: string) {
    await this.appRef.whenStable();
    this.document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  readonly footer = [
    { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
    { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
    { title: 'Resources', links: ['Blog', 'Guides', 'Help centre', 'Status'] },
  ];
}
