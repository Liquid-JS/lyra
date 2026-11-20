import { Component } from '@angular/core'
import { NbCardComponent, NbListComponent, NbListItemComponent, NbUserComponent } from '@liquid-js/lyr-core'

@Component({
    templateUrl: './users-list-showcase.component.html',
    styleUrls: ['./simple-list-showcase.component.scss'],
    imports: [NbCardComponent, NbListComponent, NbListItemComponent, NbUserComponent]
})
export class UsersListShowcaseComponent {
    users: Array<{ name: string, title: string }> = [
        { name: 'Jane Doe', title: 'Head of design' },
        { name: 'John Smith', title: 'Head of engineering' },
        { name: 'Emma Brown', title: 'Product designer' },
        { name: 'Olivia Wilson', title: 'Finance manager' },
        { name: 'Liam Johnson', title: 'Senior engineer' }
    ]
}
