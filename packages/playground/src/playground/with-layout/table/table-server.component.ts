import { Component, computed, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  NbCardModule,
  NbDataTableModule,
  NbInputModule,
  NbPaginationComponent,
  NbSelectModule,
  NbSpinnerModule,
  nbTableDataSource,
  NbTablePage,
  NbTableQuery,
} from '@liquid-js/lyr-core';

import { TABLE_USERS, TableUser } from './table-users';

/** A server's users endpoint, here answered in the browser after a moment. */
function fetchUsers({ page, pageSize, sort, filters, params }: NbTableQuery<{ city: string }>): Observable<
  NbTablePage<TableUser>
> {
  const search = String(filters['search'] ?? '').toLowerCase();
  const users = TABLE_USERS.filter(
    (user) => (!params.city || user.city === params.city) && user.name.toLowerCase().includes(search),
  ).sort((a, b) => {
    if (!sort) {
      return 0;
    }
    const order = String(a[sort.column as keyof TableUser]).localeCompare(String(b[sort.column as keyof TableUser]));
    return sort.direction === 'asc' ? order : -order;
  });
  return of({ rows: users.slice(page * pageSize, (page + 1) * pageSize), total: users.length }).pipe(delay(400));
}

@Component({
  selector: 'nb-table-server',
  templateUrl: './table-server.component.html',
  styles: `
    nb-card-header {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
  `,
  imports: [NbCardModule, NbDataTableModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbPaginationComponent],
})
export class TableServerComponent {
  readonly cities = ['London', 'New York', 'Chicago', 'Manchester', 'Boston', 'Leeds'];
  readonly city = signal('');
  readonly columns = ['name', 'city', 'role'];

  readonly source = nbTableDataSource({
    load: fetchUsers,
    params: computed(() => ({ city: this.city() })),
    pageSize: 5,
    rowId: (user) => user.id,
  });

  selectCity(city: string | null) {
    this.city.set(city ?? '');
  }
}
