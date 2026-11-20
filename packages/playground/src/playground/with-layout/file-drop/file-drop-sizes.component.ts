import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { NbCardBodyComponent, NbCardComponent, NbFileDropModule } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-file-drop-sizes',
    templateUrl: './file-drop-sizes.component.html',
    imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbFileDropModule]
})
export class FileDropSizesComponent {
    readonly sizes = ['tiny', 'small', 'medium', 'large', 'giant'] as const
    // A file in the second row, to show how the list and its buttons scale too.
    readonly file = new FormControl<File | null>(new File(['x'.repeat(2048)], 'report.pdf', { type: 'application/pdf' }))
}
