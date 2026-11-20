import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NbButtonComponent, NbIconComponent } from '@liquid-js/lyr-core'

import { ShowcaseLogoComponent } from '../shared/showcase-logo.component'
import { CLIENTS, GRID, PHOTOGRAPHER, picture } from './portfolio-data'

/** The home page: the photographer's name and a line, her pictures in a grid, her clients, and a way to get in touch. */
@Component({
    selector: 'npg-portfolio-home',
    templateUrl: './portfolio-home.component.html',
    styleUrls: ['./portfolio-home.component.scss'],
    imports: [NbButtonComponent, NbIconComponent, RouterLink, ShowcaseLogoComponent]
})
export class PortfolioHomeComponent {
    readonly photographer = PHOTOGRAPHER
    readonly grid = GRID
    readonly clients = CLIENTS
    readonly picture = picture

    /** A picture's number in the grid, two digits. */
    index(position: number): string {
        return String(position + 1).padStart(2, '0')
    }
}
