import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, withLatestFrom, map } from 'rxjs/operators';
import {
  NbThemeService,
  NbMenuItem,
  NbSidebarService,
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbLayoutColumnComponent,
  NbLayoutFooterComponent,
  NbSidebarComponent,
  NbMenuComponent,
} from '@liquid-js/lyr-core';

import { NgdMenuService } from '../@theme/services/menu.service';
import { NgdPaginationService } from '../@theme/services';

import { NgdHeaderComponent } from '../@theme/components/header/header.component';
import { NgdFooterComponent } from '../@theme/components/footer/footer.component';
import { NGD_AREA } from '../app.options';

@Component({
  selector: 'ngd-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  imports: [
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NgdHeaderComponent,
    NbSidebarComponent,
    NbMenuComponent,
    NbLayoutColumnComponent,
    RouterOutlet,
    NbLayoutFooterComponent,
    NgdFooterComponent,
  ],
})
export class NgdDocumentationComponent {
  private readonly service = inject(NgdMenuService);
  private readonly router = inject(Router);
  private readonly themeService = inject(NbThemeService);
  private readonly sidebarService = inject(NbSidebarService);
  private readonly paginationService = inject(NgdPaginationService);

  menuItems = new Array<NbMenuItem>();
  collapsedBreakpoints = ['xs', 'is', 'sm', 'md', 'lg'];
  sidebarTag = 'menuSidebar';

  private readonly area = inject(NGD_AREA);

  constructor() {
    this.themeService.changeTheme('docs-page');
    this.paginationService.setPaginationItems(this.area);
    this.menuItems = this.service.getPreparedMenu(this.area);

    // On a narrow screen, the sidebar closes once a page from it opens; the routes open an area's first page.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        withLatestFrom(this.themeService.onMediaQueryChange().pipe(map((changes) => changes[1]))),
        takeUntilDestroyed(),
      )
      .subscribe(([, mediaQuery]) => {
        if (this.collapsedBreakpoints.includes(mediaQuery.name)) {
          this.sidebarService.collapse(this.sidebarTag);
        }
      });
  }
}
