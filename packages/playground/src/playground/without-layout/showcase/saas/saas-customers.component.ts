import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbContextMenuDirective,
  NbDataTableModule,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbMenuItem,
  NbPaginationComponent,
  NbPrefixDirective,
  nbTableDataSource,
  NbTagComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { ShowcaseLogoComponent } from '../shared/showcase-logo.component';
import { CUSTOMER_STATUS, CUSTOMERS } from './saas-data';

/** A SaaS app's customer list: search, select, sort and page through customers, and edit one. */
@Component({
  selector: 'npg-saas-customers',
  templateUrl: './saas-customers.component.html',
  styleUrls: ['./saas-customers.component.scss'],
  imports: [
    NbButtonComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbContextMenuDirective,
    NbDataTableModule,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbPaginationComponent,
    NbPrefixDirective,
    NbTagComponent,
    NbUserComponent,
    RouterLink,
    ShowcaseLogoComponent,
  ],
})
export class SaasCustomersComponent {
  readonly columns = ['select', 'name', 'company', 'location', 'phone', 'status', 'actions'];
  readonly source = nbTableDataSource({ data: CUSTOMERS, pageSize: 6, rowId: (customer) => customer.id });
  readonly status = CUSTOMER_STATUS;
  readonly actions: NbMenuItem[] = [{ title: 'Send an email' }, { title: 'Export' }, { title: 'Archive' }];

  search(value: string) {
    this.source.setFilter('name', value);
  }
}
