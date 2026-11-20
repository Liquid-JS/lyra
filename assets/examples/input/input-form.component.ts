import { Component } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NbCardComponent, NbCardBodyComponent, NbInputDirective } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './input-form.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class InputFormComponent {
    inputItemNgModel?: string
    textareaItemNgModel?: string
    inputItemFormControl = new FormControl()
    textareaItemFormControl = new FormControl()
}
