import { ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NB_DATE_SERVICE_OPTIONS, NbDateService } from '@liquid-js/lyr-core';
import { NbDateFnsOptions, NbDateFnsDateService } from './services/date-fns-date.service';

const dateFnsServiceProvider = { provide: NbDateService, useClass: NbDateFnsDateService };

/**
 * Replaces the native date service with the date-fns one, in place of `NbDateFnsDateModule.forRoot()` or
 * `forChild()`.
 */
export function provideNbDateFnsDate(options: Partial<NbDateFnsOptions> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    dateFnsServiceProvider,
    { provide: NB_DATE_SERVICE_OPTIONS, useValue: options },
  ]);
}

@NgModule({
  providers: [dateFnsServiceProvider],
})
export class NbDateFnsDateModule {
  static forRoot(options: Partial<NbDateFnsOptions>): ModuleWithProviders<NbDateFnsDateModule> {
    return { ngModule: NbDateFnsDateModule, providers: [provideNbDateFnsDate(options)] };
  }

  static forChild(options: Partial<NbDateFnsOptions>): ModuleWithProviders<NbDateFnsDateModule> {
    return { ngModule: NbDateFnsDateModule, providers: [provideNbDateFnsDate(options)] };
  }
}
