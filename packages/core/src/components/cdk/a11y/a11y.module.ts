import { ModuleWithProviders, NgModule, Injectable } from '@angular/core';

import { NbFocusTrapFactoryService } from './focus-trap';
import { NbFocusKeyManagerFactoryService } from './focus-key-manager';
import { NbActiveDescendantKeyManagerFactoryService } from './descendant-key-manager';
import { FocusMonitor } from '@angular/cdk/a11y';

// The CDK focus monitor, available without `NbA11yModule.forRoot()` (e.g. in a lazy loaded module).
// Aliases a CDK service, so it stays on @Injectable: a @Service factory can't type the inherited CDK statics.
@Injectable({ providedIn: 'root', useExisting: FocusMonitor })
export class NbFocusMonitor extends FocusMonitor {}

@NgModule({})
export class NbA11yModule {
  static forRoot(): Required<ModuleWithProviders<NbA11yModule>> {
    return {
      ngModule: NbA11yModule,
      providers: [
        NbFocusTrapFactoryService,
        NbFocusKeyManagerFactoryService,
        NbActiveDescendantKeyManagerFactoryService,
        { provide: NbFocusMonitor, useClass: FocusMonitor },
      ],
    };
  }
}
