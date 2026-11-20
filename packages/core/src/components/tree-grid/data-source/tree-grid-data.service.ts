import { Service } from '@angular/core'

import { NbGetters, NB_DEFAULT_ROW_LEVEL, NbTreeGridPresentationNode } from './tree-grid.model'

/** The nodes the default getters read. */
interface NbTreeGridDefaultNode<T> {
    data: T
    children?: Array<NbTreeGridDefaultNode<T>>
    expanded?: boolean
}

@Service()
export class NbTreeGridDataService<T> {

    private readonly defaultGetters: Required<NbGetters<NbTreeGridDefaultNode<T>, T>> = {
        dataGetter: (node) => node.data,
        childrenGetter: (d) => d.children || undefined,
        expandedGetter: (d) => !!d.expanded
    }

    toPresentationNodes<N>(
        nodes: N[],
        customGetters?: NbGetters<N, T>,
        level: number = NB_DEFAULT_ROW_LEVEL
    ): Array<NbTreeGridPresentationNode<T>> {
    // Without custom getters, the nodes are `{ data, children, expanded }`, which the default getters read.
        const getters = { ...this.defaultGetters, ...customGetters } as Required<NbGetters<N, T>>

        return this.mapNodes(nodes, getters, level)
    }

    private mapNodes<N>(nodes: N[], getters: Required<NbGetters<N, T>>, level: number): Array<NbTreeGridPresentationNode<T>> {
        const { dataGetter, childrenGetter, expandedGetter } = getters

        return nodes.map((node) => {
            const childrenNodes = childrenGetter(node)
            let children: Array<NbTreeGridPresentationNode<T>> | undefined
            if (childrenNodes) {
                children = this.toPresentationNodes(childrenNodes, getters, level + 1)
            }

            return new NbTreeGridPresentationNode(dataGetter(node), children, expandedGetter(node), level)
        })
    }

    flattenExpanded(nodes: Array<NbTreeGridPresentationNode<T>>): Array<NbTreeGridPresentationNode<T>> {
        return nodes.reduce((res: Array<NbTreeGridPresentationNode<T>>, node: NbTreeGridPresentationNode<T>) => {
            res.push(node)

            if (node.expanded && node.hasChildren()) {
                res.push(...this.flattenExpanded(node.children))
            }

            return res
        }, [])
    }

    copy(nodes: Array<NbTreeGridPresentationNode<T>>): Array<NbTreeGridPresentationNode<T>> {
        return nodes.map((node: NbTreeGridPresentationNode<T>) => {
            let children: Array<NbTreeGridPresentationNode<T>> | undefined
            if (node.hasChildren()) {
                children = this.copy(node.children)
            }
            return new NbTreeGridPresentationNode(node.data, children, node.expanded, node.level)
        })
    }
}
