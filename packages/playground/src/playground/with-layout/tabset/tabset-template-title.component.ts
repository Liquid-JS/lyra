import { Component } from '@angular/core'
import {
    NbCardComponent,
    NbCardBodyComponent,
    NbTabsetComponent,
    NbTabComponent,
    NbTabTitleDirective
} from '@liquid-js/lyr-core'

@Component({
    templateUrl: './tabset-template-title.component.html',
    styles: [
        `
      :host nb-tab {
        padding: 1.25rem;
      }
    `
    ],
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbTabsetComponent,
        NbTabComponent,
        NbTabTitleDirective
    ]
})
export class TabsetTemplateTitleComponent {}
