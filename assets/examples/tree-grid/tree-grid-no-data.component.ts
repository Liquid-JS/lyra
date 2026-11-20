import { Component, inject, signal } from '@angular/core'
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbInputDirective,
    NbTreeGridDataSourceBuilder,
    NbTreeGridModule
} from '@liquid-js/lyr-core'

interface TreeNode<T> {
    data: T
    children?: Array<TreeNode<T>>
    expanded?: boolean
}

interface FSEntry {
    name: string
    size: string
    kind: string
}

const files: Array<TreeNode<FSEntry>> = [
    {
        data: { name: 'Projects', size: '1.8 MB', kind: 'dir' },
        children: [
            { data: { name: 'project-1.doc', kind: 'doc', size: '240 KB' } },
            { data: { name: 'project-2.doc', kind: 'doc', size: '290 KB' } }
        ]
    },
    {
        data: { name: 'Reports', kind: 'dir', size: '400 KB' },
        children: [
            { data: { name: 'report-1.doc', kind: 'doc', size: '100 KB' } },
            { data: { name: 'report-2.doc', kind: 'doc', size: '300 KB' } }
        ]
    },
    { data: { name: 'backup.bkp', kind: 'bkp', size: '107 MB' } },
    { data: { name: 'notes.txt', kind: 'txt', size: '2 KB' } }
]

@Component({
    templateUrl: './tree-grid-no-data.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbInputDirective, NbTreeGridModule]
})
export class TreeGridNoDataComponent {
    readonly columns = ['name', 'kind', 'size']
    readonly dataSource = inject(NbTreeGridDataSourceBuilder<FSEntry>).create(files)
    readonly query = signal('')

    filter(event: Event) {
        this.query.set((event.target as HTMLInputElement).value)
        this.dataSource.filter(this.query())
    }
}
