import { Component } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-select-form',
    templateUrl: './select-form.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbSelectComponent,
        FormsModule,
        NbOptionComponent,
        ReactiveFormsModule
    ]
})
export class SelectFormComponent {
    selectedItemNgModel?: string

    selectedItemFormControl = new FormControl()
}
