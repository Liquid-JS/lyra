import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { NbCardBodyComponent, NbCardComponent, NbValidationModule } from '@liquid-js/lyr-core'
import { NbMarkdownEditorComponent } from '@liquid-js/lyr-extras/markdown-editor'

@Component({
    selector: 'nb-markdown-editor-status',
    templateUrl: './markdown-editor-status.component.html',
    styleUrls: ['./markdown-editor-status.component.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbMarkdownEditorComponent, ReactiveFormsModule, NbValidationModule]
})
export class MarkdownEditorStatusComponent {
    readonly description = new FormControl('', Validators.required)
    readonly notes = new FormControl('A *read-only* editor: the text can be selected and copied.\n\n- [x] Released')
    readonly comment = new FormControl({ value: 'A *disabled* editor.', disabled: true })
}
