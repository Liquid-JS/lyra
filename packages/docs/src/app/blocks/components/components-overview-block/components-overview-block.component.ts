import { Component, inject } from '@angular/core';

import { NgdMenuService } from '../../../@theme/services/menu.service';
import { NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent } from '@liquid-js/lyr-core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ngd-components-overview-block',
  styleUrls: ['./components-overview-block.component.scss'],
  templateUrl: './components-overview-block.component.html',
  imports: [NbCardComponent, NbCardHeaderComponent, RouterLink, NbCardBodyComponent],
})
export class NgdComponentsOverviewBlockComponent {
  private readonly menu = inject(NgdMenuService);

  // The Components area's sections, each a heading over its components; the services aren't components.
  readonly components: { name: string; icon: string; link?: string; group: boolean }[] = this.menu
    .getPreparedMenu('components')
    .filter(({ title, children }) => !!children && title !== 'Services')
    .flatMap(({ title, children }) => [
      { name: title, icon: '', group: true },
      ...(children ?? []).map(({ data, link }) => ({
        name: data?.name ?? '',
        icon: data?.type === 'tabs' ? data.icon : '',
        link,
        group: false,
      })),
    ]);
}
