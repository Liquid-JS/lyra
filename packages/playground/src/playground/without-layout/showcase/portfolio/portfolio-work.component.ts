import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NbIconComponent } from '@liquid-js/lyr-core';

import { picture, PROJECT } from './portfolio-data';

/** A project: what it was, its lead picture, the story in two columns, more pictures, and the projects either side. */
@Component({
  selector: 'npg-portfolio-work',
  templateUrl: './portfolio-work.component.html',
  styleUrls: ['./portfolio-work.component.scss'],
  imports: [NbIconComponent, RouterLink],
})
export class PortfolioWorkComponent {
  readonly project = PROJECT;
  readonly picture = picture;
}
