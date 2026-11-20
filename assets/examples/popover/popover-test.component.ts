import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
    NbPopoverDirective,
    NbInputDirective,
    NbButtonComponent,
    NbSelectComponent,
    NbOptionComponent
} from '@liquid-js/lyr-core'
import { DynamicToAddComponent } from './components/dynamic.components'

@Component({
    selector: 'nb-popover-example',
    templateUrl: './popover-test.component.html',
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbPopoverDirective,
        NbInputDirective,
        NbButtonComponent,
        DynamicToAddComponent,
        NbSelectComponent,
        NbOptionComponent
    ]
})
export class PopoverTestComponent {

    customPopoverComponent = DynamicToAddComponent

    items = [{ title: 'Profile', link: '/card' }, { title: 'Log out', link: '/auth' }]
}
