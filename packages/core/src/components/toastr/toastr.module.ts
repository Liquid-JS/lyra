import { ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NbOverlayModule } from '@liquid-js/lyr-core/cdk';
import { NbIconModule } from '@liquid-js/lyr-core/icon';

import { NbToastrContainerRegistry, NbToastrService } from './toastr.service';
import { NbToastComponent } from './toast.component';
import { NbToastrContainerComponent } from './toastr-container.component';
import { NB_TOASTR_CONFIG, NbToastrConfig } from './toastr-config';

/**
 * Provides the toastr service with default config, in place of `NbToastrModule.forRoot()`.
 */
export function provideNbToastr(toastrConfig: Partial<NbToastrConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    NbToastrService,
    NbToastrContainerRegistry,
    { provide: NB_TOASTR_CONFIG, useValue: toastrConfig },
  ]);
}

@NgModule({
  imports: [NbOverlayModule, NbIconModule, NbToastrContainerComponent, NbToastComponent],
})
export class NbToastrModule {
  static forRoot(toastrConfig: Partial<NbToastrConfig> = {}): ModuleWithProviders<NbToastrModule> {
    return { ngModule: NbToastrModule, providers: [provideNbToastr(toastrConfig)] };
  }
}
