import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { NbCardBodyComponent, NbCardComponent, NbOptionComponent, NbSelectComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-select-all',
    templateUrl: './select-all.component.html',
    imports: [ReactiveFormsModule, NbCardComponent, NbCardBodyComponent, NbSelectComponent, NbOptionComponent]
})
export class SelectAllComponent {
    readonly toppings = ['Basil', 'Garlic', 'Mushrooms', 'Olives', 'Onion', 'Peppers', 'Tomato']
    readonly all = new FormControl(new Array<string>())
    readonly limited = new FormControl(['Basil'])
}
