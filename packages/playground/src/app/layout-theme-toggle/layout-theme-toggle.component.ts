import { Component, inject } from '@angular/core'
import { NbThemeService } from '@liquid-js/lyr-core'
import { TitleCasePipe } from '@angular/common'

@Component({
    selector: 'npg-layout-theme-toggle',
    styleUrls: ['./layout-theme-toggle.component.scss'],
    templateUrl: './layout-theme-toggle.component.html',
    imports: [TitleCasePipe]
})
export class LayoutThemeToggleComponent {
    private readonly themeService = inject(NbThemeService)

    readonly themeList = ['default', 'dark', 'cosmic', 'corporate', 'material-light', 'material-dark']
    readonly current = this.themeService.theme

    handleChange(theme: string) {
        this.themeService.setThemePreference(theme)
    }
}
