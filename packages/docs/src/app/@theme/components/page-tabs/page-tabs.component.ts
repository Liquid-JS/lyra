import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NbIconComponent } from '@liquid-js/lyr-core';
import { NgdTabs } from '../../../docs.model';
import { NGD_AREA } from '../../../app.options';
import { NgdStructureService } from '../../services/structure.service';

@Component({
  selector: 'ngd-page-tabs',
  styleUrls: ['./page-tabs.component.scss'],
  templateUrl: './page-tabs.component.html',
  host: { '[class.horizontal]': 'horizontal()' },
  imports: [RouterLink, NbIconComponent],
})
export class NgdPageTabsComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly structureService = inject(NgdStructureService);
  private readonly area = inject(NGD_AREA);

  readonly tabs = input<NgdTabs>();

  readonly horizontal = input(false, { transform: (value: boolean | string) => value !== 'false' && value !== false });

  private availableTabs: {
    tab: string;
    title: string;
    icon: string;
    selected?: boolean;
  }[] = [
    {
      tab: 'overview',
      title: 'Overview',
      icon: 'eye-outline',
      selected: true,
    },
    {
      tab: 'api',
      title: 'API',
      icon: 'settings-outline',
    },
    {
      tab: 'theme',
      title: 'Theme',
      icon: 'droplet-outline',
    },
    {
      tab: 'examples',
      title: 'Examples',
      icon: 'image-outline',
    },
  ];

  readonly items = toSignal(combineLatest([
    toObservable(this.tabs).pipe(
      map((tabs) => this.availableTabs.filter((tab) => (tabs || {})[tab.tab])),
    ),
    this.activatedRoute.params,
  ]).pipe(
    map(([tabs, params]) => {
      const tab = this.structureService.resolveRoute(this.area, params)?.tab;
      return tabs.map((item) => ({ ...item, selected: item.tab === tab }));
    }),
  ), { initialValue: [] });
}
