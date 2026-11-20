import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'nb-firebase-playground',
  template: ` <router-outlet /> `,
  imports: [RouterOutlet],
})
export class FirebasePlaygroundComponent {}
