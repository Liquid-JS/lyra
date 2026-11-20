import { Component, input } from '@angular/core';
import {
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbListComponent,
  NbListItemComponent,
  NbTabsetComponent,
  NbTabComponent,
} from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-dynamic-to-add',
  templateUrl: './dynamic-to-add.component.html',
})
export class DynamicToAddComponent {
  readonly text = input<string>('');
}

@Component({
  selector: 'nb-popover-list',
  styles: [
    `
      nb-card {
        border: 0;
        margin-bottom: 0;
      }
    `,
  ],
  templateUrl: './popover-list.component.html',
  imports: [NbCardComponent, NbCardHeaderComponent, NbListComponent, NbListItemComponent],
})
export class PopoverListComponent {}

@Component({
  selector: 'nb-popover-tabs',
  styles: [
    `
      nb-card {
        border: 0;
        margin-bottom: 0;
      }
    `,
  ],
  templateUrl: './popover-tabs.component.html',
  imports: [
    NbCardComponent,
    NbCardHeaderComponent,
    NbTabsetComponent,
    NbTabComponent,
    NbCardBodyComponent,
  ],
})
export class PopoverTabsComponent {}
