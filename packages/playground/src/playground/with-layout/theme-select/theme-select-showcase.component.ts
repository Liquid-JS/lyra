import { Component } from '@angular/core'
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbContentSizeSwitcherComponent,
    NbThemeSelectComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-theme-select-showcase',
    template: `
    <nb-card>
      <nb-card-body class="preferences">
        <nb-theme-select />
        <nb-content-size-switcher />
      </nb-card-body>
    </nb-card>
  `,
    styles: `
    .preferences {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 1rem;
      min-height: 20rem;
    }
  `,
    imports: [NbCardComponent, NbCardBodyComponent, NbThemeSelectComponent, NbContentSizeSwitcherComponent]
})
export class ThemeSelectShowcaseComponent {}
