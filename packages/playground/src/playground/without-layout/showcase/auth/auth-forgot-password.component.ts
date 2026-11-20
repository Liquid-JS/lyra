import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NbButtonComponent, NbCardBodyComponent, NbCardComponent, NbInputDirective } from '@liquid-js/lyr-core';

import { AUTH_FRAME } from './auth-frame';

/** A page to ask for a password reset link. */
@Component({
  selector: 'npg-auth-forgot-password',
  templateUrl: './auth-forgot-password.component.html',
  styleUrls: ['./auth-forgot-password.component.scss'],
  imports: [NbButtonComponent, NbCardBodyComponent, NbCardComponent, NbInputDirective, NgTemplateOutlet, RouterLink],
})
export class AuthForgotPasswordComponent {
  /** In a card, or plain in the split frame. */
  protected readonly frame = inject(AUTH_FRAME);
}
