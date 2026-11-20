import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbTreeGridComponent,
    NbTreeGridHeaderRowDefDirective,
    NbTreeGridRowDefDirective,
    NbTreeGridHeaderCellDefDirective,
    NbTreeGridCellDefDirective,
    NbTreeGridHeaderRowComponent,
    NbTreeGridRowComponent,
    NbTreeGridColumnDefDirective,
    NbTreeGridHeaderCellDirective,
    NbTreeGridCellDirective,
    NbTreeGridRowToggleComponent
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
    templateUrl: './tree-grid-responsive.component.html',
    styleUrls: ['./tree-grid-shared.scss'],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbTreeGridComponent,
        NbTreeGridHeaderRowDefDirective,
        NbTreeGridHeaderRowComponent,
        NbTreeGridRowDefDirective,
        NbTreeGridRowComponent,
        NbTreeGridColumnDefDirective,
        NbTreeGridHeaderCellDefDirective,
        NbTreeGridHeaderCellDirective,
        NbTreeGridCellDefDirective,
        NbTreeGridCellDirective,
        NbTreeGridRowToggleComponent
    ]
})
export class TreeGridResponsiveComponent {
    allColumns = ['name', 'size', 'kind', 'items']

    data: Array<TreeNode<FSEntry>> = [
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
}
