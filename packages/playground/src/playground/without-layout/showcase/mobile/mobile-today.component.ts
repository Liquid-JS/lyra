import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCheckboxComponent,
  NbFormFieldComponent,
  NbIconComponent,
  NbInputDirective,
  NbListComponent,
  NbListItemComponent,
  NbPrefixDirective,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { illustration } from '../shared/showcase-images';

/** A mobile app's home screen: the day's numbers, meetings and tasks. */
@Component({
  selector: 'npg-mobile-today',
  templateUrl: './mobile-today.component.html',
  styleUrls: ['./mobile-screen.scss', './mobile-today.component.scss'],
  imports: [
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCheckboxComponent,
    NbFormFieldComponent,
    NbIconComponent,
    NbInputDirective,
    NbListComponent,
    NbListItemComponent,
    NbPrefixDirective,
    NbUserComponent,
    RouterLink,
  ],
})
export class MobileTodayComponent {
  readonly avatar = (name: string) => illustration(name, 'notionists');
  readonly numbers = [
    { value: '3', label: 'Meetings', icon: 'calendar-outline', status: 'primary' },
    { value: '5', label: 'Tasks', icon: 'checkmark-square-2-outline', status: 'success' },
    { value: '2', label: 'Overdue', icon: 'alert-circle-outline', status: 'danger' },
  ];
  readonly meetings = [
    { time: '10:00', title: 'Quarterly review', with: 'Jane Doe', company: 'Northwind Traders' },
    { time: '13:30', title: 'Product demo', with: 'Emma Brown', company: 'Fabrikam' },
    { time: '16:00', title: 'Renewal call', with: 'Liam Johnson', company: 'Litware Inc' },
  ];
  readonly tasks = [
    { title: 'Send the proposal to Fabrikam', done: true },
    { title: 'Follow up on invoice INV-0731', done: false },
    { title: 'Prepare slides for the review', done: false },
  ];
}
