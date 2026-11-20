import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbCardComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbListComponent,
    NbListItemComponent,
    NbToggleComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { illustration } from '../shared/showcase-images'

/** A setting: one that opens a page (with its current value, if it has one), or one that switches on and off. */
interface Setting {
    icon: string
    status: string
    title: string
    value?: string
    toggle?: boolean
    on?: boolean
}

/** A mobile app's settings: the account, and groups of settings that open a page or switch on and off. */
@Component({
    selector: 'npg-mobile-settings',
    templateUrl: './mobile-settings.component.html',
    styleUrls: ['./mobile-screen.scss', './mobile-settings.component.scss'],
    imports: [
        NbCardComponent,
        NbCardHeaderComponent,
        NbIconComponent,
        NbListComponent,
        NbListItemComponent,
        NbToggleComponent,
        NbUserComponent,
        RouterLink
    ]
})
export class MobileSettingsComponent {
    readonly avatar = illustration('Jane Doe', 'notionists')
    readonly groups: Array<{ title: string, items: Setting[] }> = [
        {
            title: 'Account',
            items: [
                { icon: 'person-outline', status: 'primary', title: 'Profile' },
                { icon: 'lock-outline', status: 'info', title: 'Password and security' },
                { icon: 'credit-card-outline', status: 'success', title: 'Plan and billing' }
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: 'bell-outline', status: 'warning', title: 'Notifications', toggle: true, on: true },
                { icon: 'moon-outline', status: 'primary', title: 'Dark mode', toggle: true, on: false },
                { icon: 'globe-outline', status: 'info', title: 'Language', value: 'English (UK)' }
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: 'question-mark-circle-outline', status: 'success', title: 'Help centre' },
                { icon: 'log-out-outline', status: 'danger', title: 'Sign out' }
            ]
        }
    ]
}
