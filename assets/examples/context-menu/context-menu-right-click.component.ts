import { Component, viewChild } from '@angular/core'
import {
    NbContextMenuDirective,
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbButtonComponent,
    NbContextMenuDirective as NbContextMenuDirective_1
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-context-menu-right-click',
    templateUrl: './context-menu-right-click.component.html',
    styles: [
        `
      button {
        margin-inline-end: 1rem;
        margin-top: 1rem;
      }
    `
    ],
    host: { '(document:click)': 'close()' },
    imports: [NbLayoutComponent, NbLayoutColumnComponent, NbButtonComponent, NbContextMenuDirective_1]
})
export class ContextMenuRightClickComponent {
    readonly contextMenu = viewChild.required(NbContextMenuDirective)

    items = [{ title: 'Profile' }, { title: 'Logout' }]

    open() {
        this.contextMenu().show()
        return false
    }

    close() {
        this.contextMenu().hide()
    }
}
