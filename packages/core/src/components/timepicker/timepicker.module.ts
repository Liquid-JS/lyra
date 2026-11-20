import { ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk'
import { NbListModule } from '@liquid-js/lyr-core/list'
import { NbCardModule } from '@liquid-js/lyr-core/card'
import { NbCalendarKitModule } from '@liquid-js/lyr-core/calendar-kit'
import { NbTimePickerDirective } from './timepicker.directive'
import { NbTimePickerComponent } from './timepicker.component'
import { NbTimePickerCellComponent } from './timepicker-cell.component'
import { NB_TIME_PICKER_CONFIG, NbTimePickerConfig } from './model'

/**
 * Provides the timepicker config, in place of `NbTimepickerModule.forRoot()` or `forChild()`.
 */
export function provideNbTimepicker(config: NbTimePickerConfig = {}): EnvironmentProviders {
    return makeEnvironmentProviders([{ provide: NB_TIME_PICKER_CONFIG, useValue: config }])
}

@NgModule({
    imports: [
        NbOverlayModule,
        NbListModule,
        NbCardModule,
        NbCalendarKitModule,
        NbTimePickerComponent,
        NbTimePickerCellComponent,
        NbTimePickerDirective
    ],
    exports: [NbTimePickerComponent, NbTimePickerCellComponent, NbTimePickerDirective]
})
export class NbTimepickerModule {
    static forRoot(config: NbTimePickerConfig = {}): ModuleWithProviders<NbTimepickerModule> {
        return { ngModule: NbTimepickerModule, providers: [provideNbTimepicker(config)] }
    }

    static forChild(config: NbTimePickerConfig = {}): ModuleWithProviders<NbTimepickerModule> {
        return { ngModule: NbTimepickerModule, providers: [provideNbTimepicker(config)] }
    }
}
