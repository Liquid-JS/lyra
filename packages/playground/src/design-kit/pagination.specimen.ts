import { Component } from '@angular/core'
import { NbPaginationComponent } from '@liquid-js/lyr-core'

import { combinations, kit, SIZES } from './specimen'

/** 200 items, ten a page, on the fifth page, in each size. */
@Component({
    template: `
        <div class="specimens">
            @for (pagination of paginations; track $index) {
            <nb-pagination [attr.data-kit]="kit('pagination', pagination)"
                [size]="pagination.size"
                [length]="200"
                [pageSize]="10"
                [page]="4" />
            }
        </div>
    `,
    imports: [NbPaginationComponent]
})
export class PaginationSpecimenComponent {
    readonly kit = kit
    readonly paginations = combinations({ size: SIZES })
}
