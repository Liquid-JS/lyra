import { Component, DestroyRef, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import {
    NB_WINDOW,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbSelectComponent,
    NbToastrService
} from '@liquid-js/lyr-core'
import { NbMarkdownEditorComponent } from '@liquid-js/lyr-extras/markdown-editor'
import type { PreviewStyle } from '@liquid-js/underflow'

import { Folder, FOLDERS } from './hub-data'
import { HubDocumentsService } from './parts/hub-documents.service'

/** The folders a document can go in, with their parents' names: `Company / Policies`. */
const folderPaths = (folders: Folder[], parent?: string): string[] =>
    folders.flatMap((folder) => {
        const path = parent ? `${parent} / ${folder.name}` : folder.name
        return [path, ...folderPaths(folder.children ?? [], path)]
    })

/** A draft to start from, which shows what the editor writes: a table, a task list, a quote. */
const DRAFT = `# Team offsite -- agenda

Two days at the lake house, 18--19 September. Rooms, travel and meals are booked; this is the plan for the days themselves.

## Thursday

| Time  | Session                     | Who         |
| ----- | --------------------------- | ----------- |
| 09:30 | Coffee and "what went well" | Everyone    |
| 11:00 | Q3 campaign review          | Grace Young |
| 14:00 | Workshop: the brand's voice | Oliver King |

## Before we go

- [x] Book the coach from the London office
- [ ] Share the campaign numbers -- Mia
- [ ] Pack laptops... and walking shoes

> It's the one time a year we're all in one room, so let's make it count.
`

/**
 * A new document, written in markdown with a preview beside it on wide screens: a title, the folder it goes in, and
 * the text, saved to the documents.
 */
@Component({
    selector: 'npg-hub-new-document',
    templateUrl: './hub-new-document.component.html',
    styleUrls: ['./hub-new-document.component.scss'],
    imports: [
        FormsModule,
        NbButtonComponent,
        NbCardBodyComponent,
        NbCardComponent,
        NbIconComponent,
        NbInputDirective,
        NbMarkdownEditorComponent,
        NbOptionComponent,
        NbSelectComponent,
        RouterLink
    ]
})
export class HubNewDocumentComponent {
    private readonly documents = inject(HubDocumentsService)
    private readonly toastr = inject(NbToastrService)
    private readonly router = inject(Router)
    private readonly route = inject(ActivatedRoute)

    readonly folders = folderPaths(FOLDERS.filter((folder) => folder.name !== 'Shared with me'))
    readonly title = signal('Team offsite agenda')
    readonly folder = signal('Company / Handbook')
    readonly text = signal(DRAFT)
    /** Whether the title was left empty when saving. */
    readonly titleMissing = signal(false)
    /** The preview beside the text where there's room for both, in a tab otherwise. */
    readonly previewStyle = signal<PreviewStyle>('tab')

    constructor() {
        const window = inject(NB_WINDOW, { optional: true })
        if (window && typeof window.matchMedia === 'function') {
            const wide = window.matchMedia('(min-width: 992px)')
            const update = () => this.previewStyle.set(wide.matches ? 'vertical' : 'tab')
            update()
            wide.addEventListener('change', update)
            inject(DestroyRef).onDestroy(() => wide.removeEventListener('change', update))
        }
    }

    save() {
        const title = this.title().trim()
        this.titleMissing.set(!title)
        if (!title) {
            return
        }
        const size = Math.max(1, Math.round(new Blob([this.text()]).size / 1024))
        this.documents.add({ name: title, kind: 'doc', owner: 'Jane Doe', modified: new Date(), size })
        this.toastr.success(`${title} is in ${this.folder()}.`, 'Document saved')
        void this.router.navigate(['..'], { relativeTo: this.route })
    }
}
