import { Component } from '@angular/core'
import { NbCardComponent, NbCardBodyComponent, NbCheckboxComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-checkbox-showcase',
    templateUrl: './checkbox-showcase.component.html',
    imports: [NbCardComponent, NbCardBodyComponent, NbCheckboxComponent]
})
export class CheckboxShowcaseComponent {
    checked = false

    toggle(checked: boolean) {
        this.checked = checked
    }
}
