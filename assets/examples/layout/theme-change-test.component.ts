import { Component, inject } from '@angular/core'
import {
    NbThemeService,
    NbLayoutComponent,
    NbLayoutHeaderComponent,
    NbLayoutColumnComponent,
    NbLayoutFooterComponent,
    NbSidebarComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-change-theme-test',
    templateUrl: './theme-change-test.component.html',
    imports: [
        NbLayoutComponent,
        NbLayoutHeaderComponent,
        NbSidebarComponent,
        NbLayoutColumnComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbCardBodyComponent,
        NbLayoutFooterComponent
    ]
})
export class ThemeChangeTestComponent {
    private readonly themeService = inject(NbThemeService)

    currentTheme = 'default'

    changeTheme() {
        this.currentTheme = this.currentTheme === 'default' ? 'cosmic' : 'default'
        this.themeService.changeTheme(this.currentTheme)
    }
}
