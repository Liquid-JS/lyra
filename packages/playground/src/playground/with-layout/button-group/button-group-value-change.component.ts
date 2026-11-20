import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  NbCardComponent,
  NbCardBodyComponent,
  NbButtonGroupComponent,
  NbButtonToggleDirective,
} from '@liquid-js/lyr-core';
import { JsonPipe } from '@angular/common';

@Component({
  templateUrl: './button-group-value-change.component.html',
  imports: [
    NbCardComponent,
    NbCardBodyComponent,
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    JsonPipe,
  ],
})
export class ButtonGroupValueChangeComponent {
  private readonly cd = inject(ChangeDetectorRef);

  singleSelectGroupValue: unknown = null;
  multiSelectGroupValue = new Array<unknown>();

  updateSingleSelectGroupValue(value: unknown) {
    this.singleSelectGroupValue = value;
    this.cd.markForCheck();
  }

  updateMultiSelectGroupValue(value: unknown[]) {
    this.multiSelectGroupValue = value;
    this.cd.markForCheck();
  }
}
