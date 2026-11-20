import { Service } from '@angular/core'
import { NbSortDirection, NbSortRequest } from '../tree-grid-sort.component'
import { NbTreeGridPresentationNode } from './tree-grid.model'

// The values a column sorts by.
type NbTreeGridSortValue = string | number | bigint | boolean | Date

/**
 * Sorts the tree grid's rows by a column's value at every level, comparing values as JavaScript does. For custom
 * sorting, extend the service and override `comparator` or `sort`.
 */
@Service()
export class NbTreeGridSortService<T> {

    sort(request: NbSortRequest | undefined, data: Array<NbTreeGridPresentationNode<T>>): Array<NbTreeGridPresentationNode<T>> {
        if (!request) {
            return data
        }

        const sorted = data.sort((na, nb) => this.comparator(request, na, nb))
        for (const node of data) {
            if (node.children) {
                node.children = this.sort(request, node.children)
            }
        }
        return sorted
    }

    protected comparator(
        request: NbSortRequest,
        na: NbTreeGridPresentationNode<T>,
        nb: NbTreeGridPresentationNode<T>
    ): number {
        const key = request.column
        const dir = request.direction
        // The column values, compared as JavaScript compares them.
        const a = (na.data as Record<string, NbTreeGridSortValue>)[key]
        const b = (nb.data as Record<string, NbTreeGridSortValue>)[key]

        let res = 0

        if (a > b) {
            res = 1
        }
        if (a < b) {
            res = -1
        }

        return dir === NbSortDirection.ASCENDING ? res : res * -1
    }
}
