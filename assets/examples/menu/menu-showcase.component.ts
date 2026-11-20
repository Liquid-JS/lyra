import { Component } from '@angular/core'
import { NbMenuItem, NbCardComponent, NbMenuComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-menu-showcase',
    templateUrl: './menu-showcase.component.html',
    imports: [NbCardComponent, NbMenuComponent]
})
export class MenuShowcaseComponent {

    items: NbMenuItem[] = [
        {
            title: 'Profile',
            icon: 'person-outline'
        },
        {
            title: 'Change Password',
            icon: 'lock-outline'
        },
        {
            title: 'Privacy Policy',
            icon: { icon: 'checkmark-outline', pack: 'icons' }
        },
        {
            title: 'Logout',
            icon: 'unlock-outline'
        }
    ]
}
