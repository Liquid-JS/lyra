import { NgModule } from '@angular/core'

import { NbBadgeModule } from '@liquid-js/lyr-core/badge'
import { NbIconModule } from '@liquid-js/lyr-core/icon'
import { NbTabsetComponent, NbTabComponent } from './tabset.component'
import { NbTabContentDirective } from './tab-content.directive'
import { NbTabTitleDirective } from './tab-title.directive'

const NB_TABSET_COMPONENTS = [NbTabsetComponent, NbTabComponent]

const NB_TABSET_DIRECTIVES = [NbTabContentDirective, NbTabTitleDirective]

@NgModule({
    imports: [NbBadgeModule, NbIconModule, ...NB_TABSET_COMPONENTS, ...NB_TABSET_DIRECTIVES],
    exports: [...NB_TABSET_COMPONENTS, ...NB_TABSET_DIRECTIVES]
})
export class NbTabsetModule {}
