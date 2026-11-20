import { Component } from '@angular/core';
import {
  NbLayoutComponent,
  NbLayoutColumnComponent,
  NbCardComponent,
  NbCardBodyComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ngx-app',
  templateUrl: './app.component.html',
  imports: [
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonComponent,
    RouterLink,
  ],
})
export class AppComponent {}
