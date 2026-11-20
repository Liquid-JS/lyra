import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbInputDirective } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './input-colors.component.html',
    styleUrls: ['./input-colors.component.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbInputDirective]
})
export class InputColorsComponent {}
