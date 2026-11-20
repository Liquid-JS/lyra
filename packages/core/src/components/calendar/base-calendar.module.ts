import { NgModule } from '@angular/core';

import { NbCalendarKitModule } from '@liquid-js/lyr-core/calendar-kit';
import { NbCardModule } from '@liquid-js/lyr-core/card';
import { NbBaseCalendarComponent } from './base-calendar.component';

@NgModule({
  imports: [NbCalendarKitModule, NbCardModule, NbBaseCalendarComponent],
  exports: [NbBaseCalendarComponent],
})
export class NbBaseCalendarModule {
}
