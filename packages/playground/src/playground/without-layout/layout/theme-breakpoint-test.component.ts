import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'

import {
    NbThemeService,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbLayoutFooterComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-breakpoint-test',
    templateUrl: './theme-breakpoint-test.component.html',
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbLayoutFooterComponent
    ]
})
export class ThemeBreakpointTestComponent {
    private readonly themeService = inject(NbThemeService)

    readonly change = toSignal(this.themeService.onMediaQueryChange(), { initialValue: [] })
}
