import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
    NbButtonComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbInputDirective,
    NbListComponent,
    NbListItemComponent,
    NbOptionComponent,
    NbProgressBarComponent,
    NbSelectComponent,
    NbTabComponent,
    NbTabsetComponent,
    NbToastrService,
    NbToggleComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { portrait } from '../shared/showcase-images'

/** A SaaS app's settings: the profile, notifications and the plan, in tabs. */
@Component({
    selector: 'npg-saas-settings',
    templateUrl: './saas-settings.component.html',
    styleUrls: ['./saas-settings.component.scss'],
    imports: [
        NbButtonComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbInputDirective,
        NbListComponent,
        NbListItemComponent,
        NbOptionComponent,
        NbProgressBarComponent,
        NbSelectComponent,
        NbTabComponent,
        NbTabsetComponent,
        NbToggleComponent,
        NbUserComponent,
        RouterLink
    ]
})
export class SaasSettingsComponent {
    private readonly toastr = inject(NbToastrService)

    readonly photo = portrait('Jane Doe')
    readonly notifications = [
        { title: 'New customers', description: 'When someone signs up or starts a trial.', on: true },
        { title: 'Payments', description: 'When an invoice is paid or a payment fails.', on: true },
        { title: 'Weekly summary', description: 'A digest of your numbers every Monday.', on: false },
        { title: 'Product news', description: 'New features and tips, once a month.', on: false }
    ]

    save() {
        this.toastr.success('Your settings are saved.', 'Saved')
    }
}
