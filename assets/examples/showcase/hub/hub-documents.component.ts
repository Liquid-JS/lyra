import { DatePipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbContextMenuDirective,
    NbDataTableModule,
    NbFileDropModule,
    NbIconComponent,
    NbMenuItem,
    nbTableDataSource,
    NbToastrService,
    NbTreeGridModule,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { Document, FILE_ICONS, Folder, FOLDERS, photoOf } from './hub-data'
import { HubDocumentsService } from './parts/hub-documents.service'

/** A folder in the tree, with its subfolders. */
interface FolderNode {
    data: Folder
    children?: FolderNode[]
    expanded?: boolean
}

const folderNode = (folder: Folder, expanded = false): FolderNode => ({
    data: folder,
    children: folder.children?.map((child) => folderNode(child)),
    expanded
})

/**
 * The documents: the folders as a tree, the open folder's files as a table, with uploads dropped in, the recent ones
 * at hand, and a new one written in markdown.
 */
@Component({
    selector: 'npg-hub-documents',
    templateUrl: './hub-documents.component.html',
    styleUrls: ['./hub-documents.component.scss'],
    imports: [
        DatePipe,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbContextMenuDirective,
        NbDataTableModule,
        NbFileDropModule,
        NbIconComponent,
        NbTreeGridModule,
        NbUserComponent,
        ReactiveFormsModule,
        RouterLink
    ]
})
export class HubDocumentsComponent {
    private readonly toastr = inject(NbToastrService)
    private readonly documents = inject(HubDocumentsService)

    readonly icons = FILE_ICONS
    readonly photoOf = photoOf
    readonly folders: FolderNode[] = FOLDERS.map((folder, index) => folderNode(folder, index === 1))
    readonly folderColumns = ['name']
    readonly columns = ['name', 'owner', 'modified', 'size', 'actions']
    readonly folder = signal('Marketing')
    readonly files = this.documents.files
    readonly recent = computed(() => this.files().slice(0, 4))
    readonly source = nbTableDataSource({ data: this.files, pageSize: 8, rowId: (file) => file.id })
    readonly uploads = new FormControl<File[]>([], { nonNullable: true })

    readonly actions: NbMenuItem[] = [
        { title: 'Open', icon: 'external-link-outline' },
        { title: 'Share', icon: 'share-outline' },
        { title: 'Download', icon: 'download-outline' },
        { title: 'Move to…', icon: 'folder-outline' },
        { title: 'Delete', icon: 'trash-2-outline' }
    ]

    constructor() {
        this.uploads.valueChanges.pipe(takeUntilDestroyed()).subscribe((files) => this.upload(files))
    }

    open(folder: Folder) {
        this.folder.set(folder.name)
    }

    /** Dropped files join the folder straight away; an upload would follow. */
    upload(files: File[]) {
        if (!files.length) {
            return
        }
        const added: Array<Omit<Document, 'id'>> = files.map((file) => ({
            name: file.name.replace(/\.[^.]+$/, ''),
            kind: file.type.startsWith('image/') ? 'image' : file.name.endsWith('.pdf') ? 'pdf' : 'doc',
            owner: 'Jane Doe',
            modified: new Date(),
            size: Math.max(1, Math.round(file.size / 1024))
        }))
        this.documents.add(...added)
        this.uploads.setValue([], { emitEvent: false })
        this.toastr.success(`${added.length === 1 ? added[0].name : `${added.length} files`} added to ${this.folder()}`, 'Uploaded')
    }

    /** A size in kilobytes as the nearest unit. */
    size(kilobytes: number): string {
        return kilobytes >= 1024 ? `${(kilobytes / 1024).toFixed(1)} MB` : `${kilobytes} KB`
    }
}
