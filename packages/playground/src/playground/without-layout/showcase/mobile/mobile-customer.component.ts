import { Component } from '@angular/core';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardMediaDirective,
  NbIconComponent,
  NbListComponent,
  NbListItemComponent,
  NbTabComponent,
  NbTabsetComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { CUSTOMERS } from '../saas/saas-data';
import { illustration } from '../shared/showcase-images';
import { dialable } from './mobile-contact';

/** A mobile app's customer profile: who they are, quick actions, their numbers, and their activity or details. */
@Component({
  selector: 'npg-mobile-customer',
  templateUrl: './mobile-customer.component.html',
  styleUrls: ['./mobile-screen.scss', './mobile-customer.component.scss'],
  imports: [
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardMediaDirective,
    NbIconComponent,
    NbListComponent,
    NbListItemComponent,
    NbTabComponent,
    NbTabsetComponent,
    NbUserComponent,
  ],
})
export class MobileCustomerComponent {
  readonly customer = CUSTOMERS[0];
  readonly dialable = dialable;
  readonly avatar = illustration('Jane Doe', 'notionists');
  readonly numbers = [
    { value: '£12,400', label: 'Revenue' },
    { value: '14', label: 'Invoices' },
    { value: '3 yrs', label: 'Customer' },
  ];
  readonly activity = [
    { icon: 'file-text-outline', status: 'primary', title: 'Invoice INV-0731 sent', when: 'Today, 9:12' },
    { icon: 'phone-outline', status: 'success', title: 'Call about the renewal', when: 'Yesterday' },
    { icon: 'email-outline', status: 'info', title: 'Proposal opened', when: 'Monday' },
    { icon: 'alert-circle-outline', status: 'warning', title: 'Invoice INV-0712 overdue', when: 'Last week' },
  ];
  readonly details = [
    { label: 'Email', value: this.customer.email },
    { label: 'Phone', value: this.customer.phone },
    { label: 'Company', value: 'Northwind Traders' },
    { label: 'Location', value: 'London, UK' },
  ];
}
