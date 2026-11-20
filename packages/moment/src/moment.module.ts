import { EnvironmentProviders, makeEnvironmentProviders, NgModule } from '@angular/core'

import { NbDateService } from '@liquid-js/lyr-core'
import { NbMomentDateService } from './services/moment-date.service'

/**
 * Replaces the native date service with the moment one, in place of importing `NbMomentDateModule`.
 */
export function provideNbMomentDate(): EnvironmentProviders {
    return makeEnvironmentProviders([{ provide: NbDateService, useClass: NbMomentDateService }])
}

@NgModule({
    providers: [provideNbMomentDate()]
})
export class NbMomentDateModule {
}
