import { Component, ViewEncapsulation, inject } from '@angular/core'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { NbLayoutColumnComponent, NbLayoutComponent, NbThemeService } from '@liquid-js/lyr-core'

import { loadPlaygroundTheme } from '../playground/playground-theme'

/** Hosts the design kit's specimen pages, in the theme the `theme` query parameter names, by default `default`. */
@Component({
    template: `
        <nb-layout>
            <nb-layout-column class="design-kit">
                @if (themeLoaded()) {
                <router-outlet />
                }
            </nb-layout-column>
        </nb-layout>
    `,
    styles: `
        .design-kit .specimens {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 2rem;
        }

        /* A showcase's last card keeps no margin below it, so a specimen ends where its card does. */
        .design-kit [data-kit] > * > nb-card:last-child {
            margin-bottom: 0;
        }
    `,
    encapsulation: ViewEncapsulation.None,
    imports: [NbLayoutComponent, NbLayoutColumnComponent, RouterOutlet]
})
export class DesignKitShellComponent {
    readonly themeLoaded = loadPlaygroundTheme()

    constructor() {
        inject(NbThemeService).changeTheme(inject(ActivatedRoute).snapshot.queryParamMap.get('theme') ?? 'default')
    }
}
