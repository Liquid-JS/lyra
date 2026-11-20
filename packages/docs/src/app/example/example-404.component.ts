import { Component, inject } from '@angular/core'
import { NbThemeService } from '@liquid-js/lyr-core'

@Component({
    selector: 'ngd-example-404',
    template: ' Example not found. ',
    styleUrls: ['./example-404.component.scss']
})
export class NgdExample404Component {
    private readonly themeService = inject(NbThemeService)

    constructor() {
        this.themeService.changeTheme('default')
    }
}
