import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { NbMenuService, NbCardComponent, NbMenuComponent, NbButtonComponent } from '@liquid-js/lyr-core';
import { menuServiceItems } from './menu-service-items';

@Component({
  selector: 'nb-menu-services',
  templateUrl: './menu-service.component.html',
  styleUrls: ['./menu-service.component.scss'],
  imports: [NbCardComponent, NbMenuComponent, RouterOutlet, NbButtonComponent],
})
export class MenuServiceComponent {
  private readonly menuService = inject(NbMenuService);
  private readonly destroyRef = inject(DestroyRef);

  // Served at /menu/... in the playground and at /example/menu/... in the docs.
  menuItems = menuServiceItems(inject(Router).url.split('/menu/menu-service.component')[0]);

  readonly selectedItem = signal('');

  addMenuItem() {
    this.menuService.addItems(
      [
        {
          title: '@liquid-js/lyr-core',
          target: '_blank',
          icon: 'plus-outline',
          url: 'https://github.com/Liquid-JS/lyra',
        },
      ],
      'menu',
    );
  }

  collapseAll() {
    this.menuService.collapseAll('menu');
  }

  navigateHome() {
    this.menuService.navigateHome('menu');
  }

  getSelectedItem() {
    this.menuService
      .getSelectedItem('menu')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((menuBag) => {
        this.selectedItem.set(menuBag?.item?.title ?? 'Nothing selected');
      });
  }
}
