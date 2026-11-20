import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
    selector: 'nb-menu-service-item1',
    template: ' <h1 class="h4">Home</h1> '
})
export class MenuServiceItem1Component {}

@Component({
    selector: 'nb-menu-service-item2',
    template: ' <h1 class="h4">User account</h1> '
})
export class MenuServiceItem2Component {}

@Component({
    selector: 'nb-menu-service-item3',
    template: ' <router-outlet /> ',
    imports: [RouterOutlet]
})
export class MenuServiceItem3Component {}

@Component({
    selector: 'nb-menu-service-item31',
    template: ' <h1 class="h4">Services</h1> '
})
export class MenuServiceItem31Component {}

@Component({
    selector: 'nb-menu-service-item32',
    template: ' <h1 class="h4">Hardware</h1> '
})
export class MenuServiceItem32Component {}

@Component({
    selector: 'nb-menu-service-item33',
    template: ' <router-outlet /> ',
    imports: [RouterOutlet]
})
export class MenuServiceItem33Component {}

@Component({
    selector: 'nb-menu-service-item331',
    template: ' <h1 class="h4">Open Source Software</h1> '
})
export class MenuServiceItem331Component {}

@Component({
    selector: 'nb-menu-service-item332',
    template: ' <h1 class="h4">Commercial Software</h1> '
})
export class MenuServiceItem332Component {}
