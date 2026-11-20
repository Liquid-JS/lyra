import { Component, OnInit, inject } from '@angular/core';
import {
  NB_WINDOW,
  NbMenuService,
  NbLayoutComponent,
  NbLayoutHeaderComponent,
  NbLayoutColumnComponent,
  NbUserComponent,
  NbContextMenuDirective,
} from '@liquid-js/lyr-core';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'nb-context-menu-click',
  templateUrl: './context-menu-click.component.html',
  styles: [
    `
      :host nb-layout-header ::ng-deep nav {
        justify-content: flex-end;
      }
    `,
  ],
  imports: [
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbUserComponent,
    NbContextMenuDirective,
    NbLayoutColumnComponent,
  ],
})
export class ContextMenuClickComponent implements OnInit {
  private readonly nbMenuService = inject(NbMenuService);
  private readonly window = inject(NB_WINDOW);

  items = [{ title: 'Profile' }, { title: 'Logout' }];

  ngOnInit() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe((title) => this.window?.alert(`${title} was clicked!`));
  }
}
