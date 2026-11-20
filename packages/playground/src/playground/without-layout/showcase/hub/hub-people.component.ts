import { Component, computed, signal } from '@angular/core'
import {
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbOptionComponent,
    NbPrefixDirective,
    NbSelectComponent,
    NbDataTableModule,
    NbPaginationComponent,
    nbTableDataSource,
    NbTagComponent,
    NbTreeGridModule,
    NbUserComponent
} from '@liquid-js/lyr-core'

import { Department, DEPARTMENTS, Office, OFFICES, PEOPLE, Person } from './hub-data'

/** A person in the org tree, under their manager. */
interface OrgNode {
    data: Person
    children?: OrgNode[]
    expanded?: boolean
}

// The tree under a person: whoever reports to them, and so on.
const reportsTo = (managerId: number): OrgNode[] =>
    PEOPLE.filter((person) => person.managerId === managerId).map((person) => ({
        data: person,
        children: reportsTo(person.id),
        expanded: true
    }))

/** The people directory: a searchable, filterable table or card grid, and the org tree of one department beside it. */
@Component({
    selector: 'npg-hub-people',
    templateUrl: './hub-people.component.html',
    styleUrls: ['./hub-people.component.scss'],
    imports: [
        NbButtonComponent,
        NbButtonGroupComponent,
        NbButtonToggleDirective,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardFooterComponent,
        NbCardHeaderComponent,
        NbFormFieldComponent,
        NbIconComponent,
        NbInputDirective,
        NbOptionComponent,
        NbPrefixDirective,
        NbSelectComponent,
        NbDataTableModule,
        NbPaginationComponent,
        NbTagComponent,
        NbTreeGridModule,
        NbUserComponent
    ]
})
export class HubPeopleComponent {
    readonly departments = DEPARTMENTS
    readonly offices = OFFICES
    readonly columns = ['name', 'role', 'department', 'office', 'email']
    readonly treeColumns = ['name', 'office']

    readonly view = signal<'table' | 'cards'>('table')
    readonly search = signal('')
    readonly department = signal<Department | ''>('')
    readonly office = signal<Office | ''>('')

    /** The people the search and filters leave. */
    readonly people = computed(() => {
        const search = this.search().trim().toLowerCase()
        return PEOPLE.filter(
            (person) =>
                (!search || `${person.name} ${person.role}`.toLowerCase().includes(search)) &&
        (!this.department() || person.department === this.department()) &&
        (!this.office() || person.office === this.office())
        )
    })

    readonly source = nbTableDataSource({ data: this.people, pageSize: 8, rowId: (person) => person.id })

    /** The design team, under its head. */
    readonly tree: OrgNode[] = PEOPLE.filter((person) => person.role === 'Head of design').map((head) => ({
        data: head,
        children: reportsTo(head.id),
        expanded: true
    }))

    readonly count = computed(() => this.people().length)

    /** A view from the toggle, which gives its pressed value. */
    setView(view: 'table' | 'cards' | null) {
    // A pressed toggle stays pressed in a single-select group, so there's always one.
        if (view) {
            this.view.set(view)
        }
    }
}
