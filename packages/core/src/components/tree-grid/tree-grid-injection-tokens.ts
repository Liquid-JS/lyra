import { InjectionToken } from '@angular/core'

import type { NbTreeGridComponent } from './tree-grid.component'

export const NB_TREE_GRID = new InjectionToken<NbTreeGridComponent<unknown>>('NB_TREE_GRID')
