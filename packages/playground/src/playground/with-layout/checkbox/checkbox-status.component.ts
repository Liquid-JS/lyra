import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbCheckboxComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-checkbox-status',
    templateUrl: './checkbox-status.component.html',
    styleUrls: ['./checkbox-status.component.scss'],
    imports: [NbCardComponent, NbCardBodyComponent, NbCheckboxComponent]
})
export class CheckboxStatusComponent {}
