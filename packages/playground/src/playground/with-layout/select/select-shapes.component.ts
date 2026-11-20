import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-select-shapes',
    templateUrl: './select-shapes.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent]
})
export class SelectShapeComponent {}
