import { Component } from '@angular/core';

import { trees } from './trees-list';
import { NbCardComponent, NbCardBodyComponent, NbTagListComponent, NbTagComponent } from '@liquid-js/lyr-core';

@Component({
  templateUrl: './tag-appearance.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbTagListComponent, NbTagComponent],
})
export class TagAppearanceComponent {
  trees = trees;
}
