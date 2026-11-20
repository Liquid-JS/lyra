import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbToggleComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-app-toggle-test',
    templateUrl: './toggle-test.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbToggleComponent]
})
export class ToggleTestComponent {}
