import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbInputDirective,
  NbListComponent,
  NbListItemComponent,
  NbOptionComponent,
  NbRadioComponent,
  NbRadioGroupComponent,
  NbSelectComponent,
  NbTabComponent,
  NbTabsetComponent,
  NbToastrService,
  NbToggleComponent,
  NbUserComponent,
} from '@liquid-js/lyr-core';

import { DEPARTMENTS, NOTIFICATIONS, OFFICES, photoOf } from './hub-data';

/** The user's settings: their profile, what they're told about, and how the intranet looks to them. */
@Component({
  selector: 'npg-hub-settings',
  templateUrl: './hub-settings.component.html',
  styleUrls: ['./hub-settings.component.scss'],
  imports: [
    FormsModule,
    NbButtonComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbInputDirective,
    NbListComponent,
    NbListItemComponent,
    NbOptionComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent,
    NbTabComponent,
    NbTabsetComponent,
    NbToggleComponent,
    NbUserComponent,
    RouterLink,
  ],
})
export class HubSettingsComponent {
  private readonly toastr = inject(NbToastrService);

  readonly photo = photoOf('Jane Doe');
  readonly departments = DEPARTMENTS;
  readonly offices = OFFICES;
  readonly notifications = NOTIFICATIONS;
  readonly appearance = signal('system');
  readonly density = signal('comfortable');

  save() {
    this.toastr.success('Your settings are saved.', 'Saved');
  }
}
