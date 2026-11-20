import { Component } from '@angular/core';
import { NbLoginComponent } from '@liquid-js/lyr-auth';
import { NbAlertComponent, NbInputDirective, NbCheckboxComponent, NbButtonComponent } from '@liquid-js/lyr-core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  imports: [
    NbAlertComponent,
    FormsModule,
    NbInputDirective,
    NbCheckboxComponent,
    RouterLink,
    NbButtonComponent,
  ],
})
export class LoginComponent extends NbLoginComponent {}
