import { NgModule } from '@angular/core'

import { NbSwatchGroupComponent } from './swatch-group.component'
import { NbSwatchComponent } from './swatch.component'

const NB_SWATCH_COMPONENTS = [NbSwatchGroupComponent, NbSwatchComponent]

/** The swatch group and its swatches, for apps that use NgModules. */
@NgModule({
    imports: [...NB_SWATCH_COMPONENTS],
    exports: [...NB_SWATCH_COMPONENTS]
})
export class NbSwatchModule {}
