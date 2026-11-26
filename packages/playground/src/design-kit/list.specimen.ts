import { Component } from '@angular/core'
import { NbListComponent, NbListItemComponent, NbListItemDescriptionComponent, NbListItemTitleComponent, NbUserComponent } from '@liquid-js/lyr-core'

import { kit } from './specimen'

/** A list of people, each with a title and a description. */
@Component({
    template: `
        <div class="specimens">
            <nb-list [attr.data-kit]="kit('list', {})"
                style="width: 20rem">
                @for (person of people; track person.name) {
                <nb-list-item>
                    <nb-list-item-title>{{ person.name }}</nb-list-item-title>
                    <nb-list-item-description>{{ person.role }}</nb-list-item-description>
                </nb-list-item>
                }
            </nb-list>
        </div>
    `,
    imports: [NbListComponent, NbListItemComponent, NbListItemTitleComponent, NbListItemDescriptionComponent, NbUserComponent]
})
export class ListSpecimenComponent {
    readonly kit = kit
    readonly people = [
        { name: 'Jane Doe', role: 'Designer' },
        { name: 'John Smith', role: 'Developer' },
        { name: 'Alex Taylor', role: 'Product manager' }
    ]
}
