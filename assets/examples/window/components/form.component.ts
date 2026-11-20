import { Component, inject } from '@angular/core'
import { NbWindowRef, NbInputDirective } from '@liquid-js/lyr-core'
import { FormsModule } from '@angular/forms'

@Component({
    templateUrl: './form.component.html',
    imports: [FormsModule, NbInputDirective]
})
export class FormComponent {
    readonly windowRef = inject(NbWindowRef)

    close() {
        this.windowRef.close()
    }
}
