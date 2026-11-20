import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core'
import { NbThemeService, NbLayoutComponent, NbLayoutColumnComponent } from '@liquid-js/lyr-core'

import { RouterOutlet } from '@angular/router'
import { loadPlaygroundTheme } from '../playground-theme'

@Component({
    templateUrl: './playground-layout.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [NbLayoutComponent, NbLayoutColumnComponent, RouterOutlet]
})
export class PlaygroundLayoutComponent implements OnInit {
    private readonly themeService = inject(NbThemeService)

    readonly themeLoaded = loadPlaygroundTheme()

    ngOnInit() {
    // The theme the user chose, or the system's, which a page that set another (e.g. a theme test) leaves.
        this.themeService.setThemePreference(this.themeService.themePreference())
    }
}
