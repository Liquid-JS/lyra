import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  NbBreadcrumbsModule,
  NbCardComponent,
  NbCardHeaderComponent,
  NbListComponent,
  NbListItemComponent,
} from '@liquid-js/lyr-core';
import { map } from 'rxjs';

interface Folder {
  [name: string]: Folder;
}

const files: Folder = {
  Documents: {
    2026: { Invoices: {}, Contracts: {} },
    2025: { Invoices: {} },
  },
  Photos: { Holidays: {} },
};

@Component({
  selector: 'nb-breadcrumbs-showcase',
  templateUrl: './breadcrumbs-showcase.component.html',
  styleUrls: ['./breadcrumbs-showcase.component.scss'],
  imports: [
    NbBreadcrumbsModule,
    NbCardComponent,
    NbCardHeaderComponent,
    NbListComponent,
    NbListItemComponent,
    RouterLink,
  ],
})
export class BreadcrumbsShowcaseComponent {
  protected readonly route = inject(ActivatedRoute);

  readonly path = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('path') ?? '')), {
    initialValue: '',
  });

  readonly trail = computed(() => {
    const names = this.path().split('/').filter(Boolean);
    return [
      { name: 'Files', path: '' },
      ...names.map((name, i) => ({ name, path: names.slice(0, i + 1).join('/') })),
    ];
  });

  readonly folders = computed(() => {
    let folder: Folder | undefined = files;
    for (const name of this.path().split('/').filter(Boolean)) {
      folder = folder?.[name];
    }
    return Object.keys(folder ?? {});
  });
}
