import { Component } from '@angular/core'
import {
    NbButtonModule,
    NbCardModule,
    NbDataTableModule,
    NbIconModule,
    NbPaginationComponent,
    nbTableDataSource
} from '@liquid-js/lyr-core'

import { TABLE_USERS } from './table-users'

@Component({
    selector: 'nb-table-selection',
    templateUrl: './table-selection.component.html',
    styles: `
    nb-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
  `,
    imports: [NbCardModule, NbDataTableModule, NbButtonModule, NbIconModule, NbPaginationComponent]
})
export class TableSelectionComponent {
    readonly columns = ['select', 'name', 'role', 'details']
    readonly source = nbTableDataSource({ data: TABLE_USERS, pageSize: 5, rowId: (user) => user.id })
}
