import { Component } from '@angular/core'
import { NbMenuItem, NbCardComponent, NbMenuComponent } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-menu-badge',
    templateUrl: './menu-badge.component.html',
    styleUrls: ['./menu-badge.component.scss'],
    imports: [NbCardComponent, NbMenuComponent]
})
export class MenuBadgeComponent {

    items: NbMenuItem[] = [
        {
            title: 'Profile',
            expanded: true,
            badge: {
                text: '30',
                status: 'primary'
            },
            children: [
                {
                    title: 'Messages',
                    badge: {
                        text: '99+',
                        status: 'danger'
                    }
                },
                {
                    title: 'Notifications',
                    badge: {
                        dotMode: true,
                        status: 'warning'
                    }
                },
                {
                    title: 'Emails',
                    badge: {
                        text: 'new',
                        status: 'success'
                    }
                }
            ]
        }
    ]
}
