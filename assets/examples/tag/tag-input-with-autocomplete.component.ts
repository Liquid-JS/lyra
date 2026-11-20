import { Component, ElementRef, viewChild } from '@angular/core'
import {
    NbTagComponent,
    NbTagInputDirective,
    NbCardComponent,
    NbCardBodyComponent,
    NbFormFieldComponent,
    NbTagListComponent,
    NbTagComponent as NbTagComponent_1,
    NbTagInputDirective as NbTagInputDirective_1,
    NbAutocompleteDirective,
    NbIconComponent,
    NbSuffixDirective,
    NbAutocompleteComponent,
    NbOptionComponent
} from '@liquid-js/lyr-core'

import { trees } from './trees-list'

@Component({
    templateUrl: './tag-input-with-autocomplete.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbFormFieldComponent,
        NbTagListComponent,
        NbTagComponent_1,
        NbTagInputDirective_1,
        NbAutocompleteDirective,
        NbIconComponent,
        NbSuffixDirective,
        NbAutocompleteComponent,
        NbOptionComponent
    ]
})
export class TagInputWithAutocompleteComponent {

    tags = new Set<string>()
    options: string[] = trees

    readonly tagInput = viewChild.required(NbTagInputDirective, { read: ElementRef })

    onTagRemove(tagToRemove: NbTagComponent) {
        const text = tagToRemove.text()
        if (text !== undefined) {
            this.tags.delete(text)
            this.options.push(text)
        }
    }

    onTagAdd(value: string) {
        if (value) {
            this.tags.add(value)
            this.options = this.options.filter((o) => o !== value)
        }
        this.tagInput().nativeElement.value = ''
    }
}
