import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbIconComponent,
  NbInputDirective,
  NbOptionComponent,
  NbRadioComponent,
  NbRadioGroupComponent,
  NbSelectComponent,
  NbStepComponent,
  NbStepperComponent,
  NbStepperNextDirective,
  NbStepperPreviousDirective,
  NbValidationModule,
} from '@liquid-js/lyr-core';
import { NbMaskDirective } from '@liquid-js/lyr-extras/mask';

import { ShopCart } from './shop-cart.service';
import { deliveryPrice, SHOP_DELIVERY, ShopDeliveryOption } from './shop-data';
import { ShopOrderSummaryComponent } from './parts/shop-order-summary.component';
import { ShopPictureComponent } from './parts/shop-picture.component';

/**
 * Checkout in three steps, delivery, payment and a last look at the order, with the order beside them. The forms start
 * filled in with sample details, so the order can be placed straight away.
 */
@Component({
  templateUrl: './shop-checkout.component.html',
  styleUrls: ['./shop-checkout.component.scss'],
  imports: [
    CurrencyPipe,
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbInputDirective,
    NbMaskDirective,
    NbOptionComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent,
    NbStepComponent,
    NbStepperComponent,
    NbStepperNextDirective,
    NbStepperPreviousDirective,
    NbValidationModule,
    ReactiveFormsModule,
    RouterLink,
    ShopOrderSummaryComponent,
    ShopPictureComponent,
  ],
})
export class ShopCheckoutComponent {
  protected readonly cart = inject(ShopCart);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  readonly deliveryOptions = SHOP_DELIVERY;

  readonly delivery = new FormGroup({
    name: new FormControl('Jane Doe', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('jane.doe@example.com', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    address: new FormControl('12 High Street', { nonNullable: true, validators: Validators.required }),
    city: new FormControl('London', { nonNullable: true, validators: Validators.required }),
    postcode: new FormControl('SW1A 1AA', { nonNullable: true, validators: Validators.required }),
    country: new FormControl('gb', { nonNullable: true }),
    option: new FormControl<ShopDeliveryOption>('standard', { nonNullable: true }),
  });

  readonly payment = new FormGroup({
    method: new FormControl<'card' | 'paypal'>('card', { nonNullable: true }),
    holder: new FormControl('Jane Doe', { nonNullable: true, validators: Validators.required }),
    number: new FormControl('4242424242424242', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(16)],
    }),
    expiry: new FormControl('0929', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    cvc: new FormControl('123', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
  });

  readonly option = toSignal(this.delivery.controls.option.valueChanges, {
    initialValue: this.delivery.controls.option.value,
  });
  readonly method = toSignal(this.payment.controls.method.valueChanges, {
    initialValue: this.payment.controls.method.value,
  });

  constructor() {
    // Card details only count when paying by card.
    this.payment.controls.method.valueChanges.subscribe((method) => {
      const card = [this.payment.controls.holder, this.payment.controls.number, this.payment.controls.expiry];
      [...card, this.payment.controls.cvc].forEach((control) =>
        method === 'card' ? control.enable() : control.disable(),
      );
    });
  }

  price(option: ShopDeliveryOption) {
    return deliveryPrice(option, this.cart.subtotal());
  }

  /** The card's last four digits, for the review. */
  lastDigits() {
    return this.payment.controls.number.value.slice(-4);
  }

  place() {
    this.cart.place(this.price(this.option()));
    void this.router.navigate(['../order-placed'], { relativeTo: this.route });
  }
}
