import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  NbBreadcrumbComponent,
  NbBreadcrumbsComponent,
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCheckboxComponent,
  NbInputDirective,
  NbOptionComponent,
  NbRadioComponent,
  NbRadioGroupComponent,
  NbSelectComponent,
  NbToastrService,
  NbUserComponent,
} from '@liquid-js/lyr-core';
import { NbPhoneInputComponent } from '@liquid-js/lyr-extras/phone-input';

import { portrait } from '../shared/showcase-images';

/** A SaaS app's form for a customer's details, in two columns that become one on small screens. */
@Component({
  selector: 'npg-saas-customer-edit',
  templateUrl: './saas-customer-edit.component.html',
  styleUrls: ['./saas-customer-edit.component.scss'],
  imports: [
    FormsModule,
    NbBreadcrumbComponent,
    NbBreadcrumbsComponent,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCheckboxComponent,
    NbInputDirective,
    NbOptionComponent,
    NbPhoneInputComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent,
    NbUserComponent,
    RouterLink,
  ],
})
export class SaasCustomerEditComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(NbToastrService);

  phone = '+442079460018';
  readonly photo = portrait('Jane Doe');

  /** Saves the customer, and goes back to the list. */
  save() {
    this.toastr.success('Jane Doe\'s details are saved.', 'Saved');
    void this.router.navigate(['../../customers'], { relativeTo: this.route });
  }
}
