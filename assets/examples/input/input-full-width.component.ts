import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbInputDirective } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './input-full-width.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbInputDirective]
})
export class InputFullWidthComponent {}
