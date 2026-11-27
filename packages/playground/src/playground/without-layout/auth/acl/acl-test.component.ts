import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NbAccessChecker, NbIsGrantedDirective } from '@liquid-js/lyr-security'
import {
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-actions-test',
    templateUrl: './acl-test.component.html',
    styles: `
    nb-layout-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
    imports: [
        NbLayoutComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbIsGrantedDirective
    ]
})
export class AclTestComponent {
    private readonly accessChecker = inject(NbAccessChecker)

    readonly canCreateComments = toSignal(this.accessChecker.isGranted('create', 'comments'))
}
