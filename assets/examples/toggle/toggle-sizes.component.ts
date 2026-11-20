import { Component } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent, NbToggleComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-toggle-sizes',
    templateUrl: './toggle-sizes.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbToggleComponent]
})
export class ToggleSizesComponent {}
