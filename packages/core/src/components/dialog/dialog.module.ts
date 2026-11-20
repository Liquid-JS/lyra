import { ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk'
import { NbDialogService } from './dialog.service'
import { NbDialogContainerComponent } from './dialog-container'
import { NB_DIALOG_CONFIG, NbDialogConfig } from './dialog-config'

/**
 * Provides the dialog service with default config, in place of `NbDialogModule.forRoot()`. In a lazy route's
 * providers it gives that route its own service, as `NbDialogModule.forChild()` does.
 */
export function provideNbDialog(dialogConfig: Partial<NbDialogConfig> = {}): EnvironmentProviders {
    return makeEnvironmentProviders([
        NbDialogService,
        { provide: NB_DIALOG_CONFIG, useValue: dialogConfig }
    ])
}

@NgModule({
    imports: [NbOverlayModule, NbDialogContainerComponent]
})
export class NbDialogModule {
    static forRoot(dialogConfig: Partial<NbDialogConfig> = {}): ModuleWithProviders<NbDialogModule> {
        return { ngModule: NbDialogModule, providers: [provideNbDialog(dialogConfig)] }
    }

    static forChild(dialogConfig: Partial<NbDialogConfig> = {}): ModuleWithProviders<NbDialogModule> {
        return { ngModule: NbDialogModule, providers: [provideNbDialog(dialogConfig)] }
    }
}
