import { NgModule } from '@angular/core'

import { NbCalendarComponent } from './calendar.component'
import { NbBaseCalendarModule } from './base-calendar.module'

@NgModule({
    imports: [NbBaseCalendarModule, NbCalendarComponent],
    exports: [NbCalendarComponent]
})
export class NbCalendarModule {
}
