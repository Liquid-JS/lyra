import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NbLayoutColumnComponent, NbLayoutComponent } from '@liquid-js/lyr-core';

import { ShowcaseGrainComponent } from '../shared/showcase-grain.component';
import { PHOTOGRAPHER } from './portfolio-data';

/**
 * A photographer's site: a rail along the left with her name, the pages and where to find her, which becomes a bar
 * across the top on a phone, beside the page on grained paper.
 */
@Component({
  selector: 'npg-portfolio-shell',
  templateUrl: './portfolio-shell.component.html',
  styleUrls: ['./portfolio-shell.component.scss'],
  imports: [
    NbLayoutColumnComponent,
    NbLayoutComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ShowcaseGrainComponent,
  ],
})
export class PortfolioShellComponent {
  readonly photographer = PHOTOGRAPHER;
  readonly year = new Date().getFullYear();

  readonly pages = [
    { path: 'home', title: 'Work' },
    { path: 'about', title: 'About' },
    { path: 'contact', title: 'Contact' },
  ];
}
