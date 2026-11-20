import { DatePipe } from '@angular/common'
import { Component } from '@angular/core'
import {
    NbCardModule,
    NbDataTableModule,
    NbInputModule,
    NbPaginationComponent,
    nbTableDataSource
} from '@liquid-js/lyr-core'

import { TABLE_USERS } from './table-users'

@Component({
    selector: 'nb-table-showcase',
    templateUrl: './table-showcase.component.html',
    styles: `
    nb-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
  `,
    imports: [DatePipe, NbCardModule, NbDataTableModule, NbInputModule, NbPaginationComponent]
})
export class TableShowcaseComponent {
    readonly columns = ['name', 'email', 'role', 'joined']
    readonly source = nbTableDataSource({ data: TABLE_USERS, pageSize: 5 })
}
