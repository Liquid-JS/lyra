import { NgModule } from '@angular/core';

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk';
import { NbIconModule } from '@liquid-js/lyr-core/icon';

import { NbTooltipComponent } from './tooltip.component';
import { NbTooltipDirective } from './tooltip.directive';

@NgModule({
  imports: [NbOverlayModule, NbIconModule, NbTooltipComponent, NbTooltipDirective],
  exports: [NbTooltipDirective],
})
export class NbTooltipModule {
}
