import { Component, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { NbCardBodyComponent, NbCardComponent, NbFileDropModule, NbFileRejection } from '@liquid-js/lyr-core'

const reasons = {
    type: 'is not a PDF',
    size: 'is larger than 1 MB',
    count: 'is over the limit of 3 files'
}

@Component({
    selector: 'nb-file-drop-multiple',
    templateUrl: './file-drop-multiple.component.html',
    imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbFileDropModule]
})
export class FileDropMultipleComponent {
    readonly documents = new FormControl(new Array<File>(), { nonNullable: true })
    readonly messages = signal(new Array<string>())

    showRejected(rejections: NbFileRejection[]) {
        this.messages.set(rejections.map(({ file, reason }) => `${file.name} ${reasons[reason]}`))
    }
}
