import { ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'
import { NbOverlayModule } from '@liquid-js/lyr-core/cdk'
import { NbCardModule } from '@liquid-js/lyr-core/card'
import { NbIconModule } from '@liquid-js/lyr-core/icon'
import { NbButtonModule } from '@liquid-js/lyr-core/button'
import { NbWindowService } from './window.service'
import { NbWindowsContainerComponent } from './windows-container.component'
import { NbWindowComponent } from './window.component'
import { NB_WINDOW_CONFIG, NbPartialWindowConfig } from './window.options'

/**
 * Provides the window service with default config, in place of `NbWindowModule.forRoot()`. In a lazy route's
 * providers it gives that route its own service, as `NbWindowModule.forChild()` does.
 */
export function provideNbWindow(defaultConfig?: NbPartialWindowConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        NbWindowService,
        { provide: NB_WINDOW_CONFIG, useValue: defaultConfig }
    ])
}

@NgModule({
    imports: [
        NbOverlayModule,
        NbCardModule,
        NbIconModule,
        NbButtonModule,
        NbWindowsContainerComponent,
        NbWindowComponent
    ]
})
export class NbWindowModule {
    static forRoot(defaultConfig?: NbPartialWindowConfig): ModuleWithProviders<NbWindowModule> {
        return { ngModule: NbWindowModule, providers: [provideNbWindow(defaultConfig)] }
    }

    static forChild(defaultConfig?: NbPartialWindowConfig): ModuleWithProviders<NbWindowModule> {
        return { ngModule: NbWindowModule, providers: [provideNbWindow(defaultConfig)] }
    }
}
