import { Service } from '@angular/core'

import { NbTreeGridPresentationNode } from './tree-grid.model'

/**
 * Filters the tree grid's rows: a row matches when any of its data's values contains the query, ignoring case. A
 * row whose descendants match stays, expanded. For a custom filter, extend the service and override
 * `filterPredicate` or `filter`.
 */
@Service()
export class NbTreeGridFilterService<T> {
    filter(query: string, data: Array<NbTreeGridPresentationNode<T>>): Array<NbTreeGridPresentationNode<T>> {
        if (!query) {
            return data
        }

        return data.reduce((filtered: Array<NbTreeGridPresentationNode<T>>, node: NbTreeGridPresentationNode<T>) => {
            let filteredChildren: Array<NbTreeGridPresentationNode<T>> | undefined

            if (node.children) {
                filteredChildren = this.filter(query, node.children)
                node.children = filteredChildren
            }

            node.expanded = false

            if (filteredChildren && filteredChildren.length) {
                node.expanded = true
                filtered.push(node)
            } else if (this.filterPredicate(node.data, query)) {
                filtered.push(node)
            }

            return filtered
        }, [])
    }

    protected filterPredicate(data: T, searchQuery: string): boolean {
        const preparedQuery = searchQuery.trim().toLocaleLowerCase()
        // The rows are objects, though the row type isn't constrained to them.
        if (typeof data !== 'object' || data === null) {
            return false
        }
        for (const val of Object.values(data)) {
            const preparedVal = `${val}`.trim().toLocaleLowerCase()
            if (preparedVal.includes(preparedQuery)) {
                return true
            }
        }

        return false
    }
}
