import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbInputDirective } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './input-showcase.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbInputDirective]
})
export class InputsShowcaseComponent {}
