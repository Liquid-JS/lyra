import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { NbCardBodyComponent, NbCardComponent } from '@liquid-js/lyr-core'
import { NbMarkdownEditorComponent } from '@liquid-js/lyr-extras/markdown-editor'

@Component({
    selector: 'nb-markdown-editor-showcase',
    templateUrl: './markdown-editor-showcase.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbMarkdownEditorComponent, ReactiveFormsModule]
})
export class MarkdownEditorShowcaseComponent {
    readonly notes = new FormControl(
        [
            '# Release notes',
            '',
            'The editor writes **CommonMark** with GitHub\'s extensions:',
            '',
            // With `autoDirection`, a paragraph in Arabic reads right to left.
            'ملاحظات الإصدار باللغة العربية تُقرأ من اليمين إلى اليسار.',
            '',
            '- [x] Tables and task lists',
            '- [ ] A WYSIWYG mode, in the tab at the bottom',
            '',
            '| Package | Entry point |',
            '| --- | --- |',
            '| `@liquid-js/lyr-extras` | `/markdown` |'
        ].join('\n')
    )
}
