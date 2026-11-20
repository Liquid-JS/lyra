import { Component } from '@angular/core';
import { NbCardComponent, NbCardBodyComponent, NbActionsComponent, NbActionComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-action-width',
  templateUrl: './action-width.component.html',
  imports: [NbCardComponent, NbCardBodyComponent, NbActionsComponent, NbActionComponent],
})
export class ActionWidthComponent {
}
