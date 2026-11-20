import { Component, signal } from '@angular/core';
import {
  NbCardComponent,
  NbCardHeaderComponent,
  NbCheckboxComponent,
  NbTreeGridModule,
} from '@liquid-js/lyr-core';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  size: string;
  kind: string;
}

const files: TreeNode<FSEntry>[] = [
  {
    data: { name: 'Projects', size: '1.8 MB', kind: 'dir' },
    children: [
      { data: { name: 'project-1.doc', kind: 'doc', size: '240 KB' } },
      { data: { name: 'project-2.doc', kind: 'doc', size: '290 KB' } },
    ],
  },
  {
    data: { name: 'Reports', kind: 'dir', size: '400 KB' },
    children: [
      { data: { name: 'report-1.doc', kind: 'doc', size: '100 KB' } },
      { data: { name: 'report-2.doc', kind: 'doc', size: '300 KB' } },
    ],
  },
  { data: { name: 'backup.bkp', kind: 'bkp', size: '107 MB' } },
  { data: { name: 'notes.txt', kind: 'txt', size: '2 KB' } },
];

@Component({
  templateUrl: './tree-grid-variants.component.html',
  styles: `
    nb-card-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }

    h6 {
      margin: 0;
      margin-inline-end: auto;
    }
  `,
  imports: [NbCardComponent, NbCardHeaderComponent, NbCheckboxComponent, NbTreeGridModule],
})
export class TreeGridVariantsComponent {
  readonly columns = ['name', 'kind', 'size'];
  readonly data = files;
  readonly compact = signal(true);
  readonly striped = signal(true);
}
