import { Component } from '@angular/core'
import {
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbUserComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-user-test',
    styles: [
        `
      .test-row {
        margin: 20px;
      }
    `
    ],
    templateUrl: './user-test.component.html',
    imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbUserComponent, NbLayoutColumnComponent]
})
export class UserTestComponent {}
