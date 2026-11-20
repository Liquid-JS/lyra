import { NgModule } from '@angular/core'
import {
    NbListComponent,
    NbListItemActionsComponent,
    NbListItemComponent,
    NbListItemDescriptionComponent,
    NbListItemLinkDirective,
    NbListItemTitleComponent
} from './list.component'
import { NbListPageTrackerDirective } from './list-page-tracker.directive'
import { NbInfiniteListDirective } from './infinite-list.directive'

const components = [
    NbListComponent,
    NbListItemComponent,
    NbListItemTitleComponent,
    NbListItemDescriptionComponent,
    NbListItemActionsComponent,
    NbListItemLinkDirective,
    NbListPageTrackerDirective,
    NbInfiniteListDirective
]

@NgModule({
    imports: [...components],
    exports: components
})
export class NbListModule {}
