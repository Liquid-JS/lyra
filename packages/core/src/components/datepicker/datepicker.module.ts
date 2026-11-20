import { ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { DatePipe } from '@angular/common'

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk'
import { NbCalendarModule, NbCalendarRangeModule, NbBaseCalendarModule } from '@liquid-js/lyr-core/calendar'
import { NbCardModule } from '@liquid-js/lyr-core/card'
import { NbTimepickerModule } from '@liquid-js/lyr-core/timepicker'
import { NbCalendarKitModule } from '@liquid-js/lyr-core/calendar-kit'
import { NbCalendarWithTimeComponent } from './calendar-with-time.component'
import { NbDateAdapterService, NbDateTimeAdapterService, NbRangeAdapterService } from './datepicker-adapter'
import {
    NbDatepickerComponent,
    NbRangepickerComponent,
    NbBasePickerComponent
} from './datepicker.component'
import { NbDatepickerContainerComponent } from './datepicker-container.component'
import { NB_DATE_ADAPTER, NbDatepickerDirective } from './datepicker.directive'
import { NbDateTimePickerComponent } from './date-timepicker.component'

/**
 * Provides the adapters that parse and format the picker inputs, in place of `NbDatepickerModule.forRoot()`.
 */
export function provideNbDatepicker(): EnvironmentProviders {
    return makeEnvironmentProviders([
        DatePipe,
        { provide: NB_DATE_ADAPTER, multi: true, useClass: NbDateAdapterService },
        { provide: NB_DATE_ADAPTER, multi: true, useClass: NbRangeAdapterService },
        { provide: NB_DATE_ADAPTER, multi: true, useClass: NbDateTimeAdapterService }
    ])
}

@NgModule({
    imports: [
        NbOverlayModule,
        NbCalendarModule,
        NbCalendarRangeModule,
        NbCardModule,
        NbBaseCalendarModule,
        NbTimepickerModule,
        NbCalendarKitModule,
        NbDatepickerDirective,
        NbDatepickerContainerComponent,
        NbCalendarWithTimeComponent,
        NbDateTimePickerComponent,
        NbDatepickerComponent,
        NbRangepickerComponent,
        NbBasePickerComponent
    ],
    exports: [
        NbDatepickerDirective,
        NbDatepickerComponent,
        NbRangepickerComponent,
        NbDateTimePickerComponent,
        NbCalendarWithTimeComponent
    ]
})
export class NbDatepickerModule {
    static forRoot(): ModuleWithProviders<NbDatepickerModule> {
        return { ngModule: NbDatepickerModule, providers: [provideNbDatepicker()] }
    }
}
