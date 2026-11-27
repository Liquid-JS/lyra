import { Component } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent, NbInputModule } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './input-autosize.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbInputModule]
})
export class InputAutosizeComponent {}
