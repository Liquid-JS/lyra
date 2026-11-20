import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbActionsComponent, NbActionComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-action-badge',
  templateUrl: './action-badge.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbActionsComponent, NbActionComponent],
})
export class ActionBadgeComponent {
}
