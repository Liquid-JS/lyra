import { NgModule } from '@angular/core';

import { NbContentSizeSwitcherComponent, NbThemeSelectComponent } from './theme-select.component';

@NgModule({
  imports: [NbThemeSelectComponent, NbContentSizeSwitcherComponent],
  exports: [NbThemeSelectComponent, NbContentSizeSwitcherComponent],
})
export class NbThemeSelectModule {}
