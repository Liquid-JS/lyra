import { Component, inject, forwardRef, input } from '@angular/core'
import {
    NbSortDirection,
    NbSortRequest,
    NbTreeGridDataSource,
    NbTreeGridDataSourceBuilder,
    NbTreeGridRowToggleComponent,
    NbIconComponent,
    NbCardComponent,
    NbCardBodyComponent,
    NbInputDirective,
    NbFilterInputDirective,
    NbTreeGridComponent,
    NbSortDirective,
    NbSortHeaderComponent,
    NbTreeGridHeaderRowDefDirective,
    NbTreeGridRowDefDirective,
    NbTreeGridHeaderCellDefDirective,
    NbTreeGridCellDefDirective,
    NbTreeGridHeaderRowComponent,
    NbTreeGridRowComponent,
    NbTreeGridColumnDefDirective,
    NbTreeGridHeaderCellDirective,
    NbTreeGridCellDirective
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
    items?: number
}

@Component({
    selector: 'nb-tree-grid-showcase',
    templateUrl: './tree-grid-showcase.component.html',
    styleUrls: ['./tree-grid-shared.scss', './tree-grid-showcase.component.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        NbFilterInputDirective,
        NbTreeGridComponent,
        NbSortDirective,
        NbTreeGridHeaderRowDefDirective,
        NbTreeGridHeaderRowComponent,
        NbTreeGridRowDefDirective,
        NbTreeGridRowComponent,
        NbTreeGridColumnDefDirective,
        NbTreeGridHeaderCellDefDirective,
        NbTreeGridHeaderCellDirective,
        NbSortHeaderComponent,
        NbTreeGridCellDefDirective,
        NbTreeGridCellDirective,
        forwardRef(() => FsIconComponent)
    ]
})
export class TreeGridShowcaseComponent {
    private readonly dataSourceBuilder = inject<NbTreeGridDataSourceBuilder<FSEntry>>(NbTreeGridDataSourceBuilder)

    customColumn = 'name'
    defaultColumns = ['size', 'kind', 'items']
    allColumns = [this.customColumn, ...this.defaultColumns]

    dataSource: NbTreeGridDataSource<FSEntry>

    sortColumn?: string
    sortDirection: NbSortDirection = NbSortDirection.NONE

    constructor() {
        this.dataSource = this.dataSourceBuilder.create(this.data)
    }

    updateSort(sortRequest: NbSortRequest) {
        this.sortColumn = sortRequest.column
        this.sortDirection = sortRequest.direction
    }

    getSortDirection(column: string): NbSortDirection {
        if (this.sortColumn === column) {
            return this.sortDirection
        }
        return NbSortDirection.NONE
    }

    private data: Array<TreeNode<FSEntry>> = [
        {
            data: { name: 'Projects', size: '1.8 MB', items: 5, kind: 'dir' },
            children: [
                { data: { name: 'project-1.doc', kind: 'doc', size: '240 KB' } },
                { data: { name: 'project-2.doc', kind: 'doc', size: '290 KB' } },
                {
                    data: { name: 'project-3', kind: 'dir', size: '466 KB', items: 3 },
                    children: [
                        { data: { name: 'project-3A.doc', kind: 'doc', size: '200 KB' } },
                        { data: { name: 'project-3B.doc', kind: 'doc', size: '266 KB' } },
                        { data: { name: 'project-3C.doc', kind: 'doc', size: '0' } }
                    ]
                },
                { data: { name: 'project-4.docx', kind: 'docx', size: '900 KB' } }
            ]
        },
        {
            data: { name: 'Reports', kind: 'dir', size: '400 KB', items: 2 },
            children: [
                {
                    data: { name: 'Report 1', kind: 'dir', size: '100 KB', items: 1 },
                    children: [{ data: { name: 'report-1.doc', kind: 'doc', size: '100 KB' } }]
                },
                {
                    data: { name: 'Report 2', kind: 'dir', size: '300 KB', items: 2 },
                    children: [
                        { data: { name: 'report-2.doc', kind: 'doc', size: '290 KB' } },
                        { data: { name: 'report-2-note.txt', kind: 'txt', size: '10 KB' } }
                    ]
                }
            ]
        },
        {
            data: { name: 'Other', kind: 'dir', size: '109 MB', items: 2 },
            children: [
                { data: { name: 'backup.bkp', kind: 'bkp', size: '107 MB' } },
                { data: { name: 'secret-note.txt', kind: 'txt', size: '2 MB' } }
            ]
        }
    ]

    getShowOn(index: number) {
        const minWithForMultipleColumns = 400
        const nextColumnStep = 100
        return minWithForMultipleColumns + nextColumnStep * index
    }
}

@Component({
    selector: 'nb-fs-icon',
    template: `
    @if (isDir()) {
      <nb-tree-grid-row-toggle [expanded]="expanded()" />
    } @else {
      <nb-icon icon="file-text-outline" />
    }
  `,
    imports: [NbTreeGridRowToggleComponent, NbIconComponent]
})
export class FsIconComponent {
    readonly kind = input<string>()
    readonly expanded = input<boolean>()

    isDir(): boolean {
        return this.kind() === 'dir'
    }
}
