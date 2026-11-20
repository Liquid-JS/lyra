import { ModuleWithProviders, NgModule } from '@angular/core'

import { NbA11yModule } from '../a11y/a11y.module'
import { NbCdkAdapterModule } from '../adapter/adapter.module'
import { NbCdkMappingModule } from './mapping'
import { NbPositionBuilderService } from './overlay-position'
import { NbOverlayContainerComponent, NbPositionedContainerComponent } from './overlay-container'
import { NbOverlayService } from './overlay-service'
import { NbPositionHelper } from './position-helper'
import { NbTriggerStrategyBuilderService } from './overlay-trigger'

@NgModule({
    imports: [NbCdkMappingModule, NbPositionedContainerComponent, NbOverlayContainerComponent],
    exports: [NbCdkMappingModule, NbCdkAdapterModule, NbOverlayContainerComponent]
})
export class NbOverlayModule {
    static forRoot(): Required<ModuleWithProviders<NbOverlayModule>> {
        return {
            ngModule: NbOverlayModule,
            providers: [
                NbPositionBuilderService,
                NbTriggerStrategyBuilderService,
                NbOverlayService,
                NbPositionHelper,
                ...NbCdkMappingModule.forRoot().providers,
                ...NbCdkAdapterModule.forRoot().providers,
                ...NbA11yModule.forRoot().providers
            ]
        }
    }
}
