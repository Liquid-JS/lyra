import { NgModule } from '@angular/core';
import { NbButtonGroupComponent } from './button-group.component';
import { NbButtonToggleDirective } from './button-toggle.directive';

@NgModule({
  imports: [NbButtonGroupComponent, NbButtonToggleDirective],
  exports: [NbButtonGroupComponent, NbButtonToggleDirective],
})
export class NbButtonGroupModule { }
