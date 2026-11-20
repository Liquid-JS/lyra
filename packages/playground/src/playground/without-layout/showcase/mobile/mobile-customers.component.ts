import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbButtonGroupComponent,
  NbButtonToggleDirective,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardLinkDirective,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbPrefixDirective,
  NbTagComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { CUSTOMER_STATUS, CUSTOMERS, Customer } from '../saas/saas-data';
import { illustration } from '../shared/showcase-images';
import { dialable } from './mobile-contact';

/** A mobile app's customer list: search, a filter by status, and a card per customer with quick actions. */
@Component({
  selector: 'npg-mobile-customers',
  templateUrl: './mobile-customers.component.html',
  styleUrls: ['./mobile-screen.scss', './mobile-customers.component.scss'],
  imports: [
    NbButtonComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardLinkDirective,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbPrefixDirective,
    NbTagComponent,
    NbUserComponent,
    RouterLink,
  ],
})
export class MobileCustomersComponent {
  readonly filters: ('all' | Customer['status'])[] = ['all', 'active', 'trial'];
  readonly filter = signal<'all' | Customer['status']>('all');
  readonly search = signal('');
  readonly status = CUSTOMER_STATUS;
  readonly avatar = (name: string) => illustration(name, 'notionists');
  readonly dialable = dialable;
  readonly customers = computed(() =>
    CUSTOMERS.filter(
      (customer) =>
        (this.filter() === 'all' || customer.status === this.filter()) &&
        customer.name.toLowerCase().includes(this.search().toLowerCase()),
    ),
  );

  pick(value: unknown) {
    const match = this.filters.find((item) => item === value);
    if (match) {
      this.filter.set(match);
    }
  }
}
