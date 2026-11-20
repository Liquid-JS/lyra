import { Component } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent, NbCheckboxComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-checkbox-sizes',
    templateUrl: './checkbox-sizes.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbCheckboxComponent]
})
export class CheckboxSizesComponent {}
