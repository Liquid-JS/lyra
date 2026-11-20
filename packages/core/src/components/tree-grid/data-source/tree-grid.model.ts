export const NB_DEFAULT_ROW_LEVEL: number = 0

export type NbDataGetter<N, T> = (node: N) => T
/** Returns the child nodes of a node, in the same structure as the node. */
export type NbChildrenGetter<N> = (node: N) => (N[] | undefined)
export type NbExpandedGetter<N> = (node: N) => boolean

/** Reads nodes of a shape other than `{ data, children, expanded }`. */
export interface NbGetters<N, T> {
    dataGetter?: NbDataGetter<N, T>
    childrenGetter?: NbChildrenGetter<N>
    expandedGetter?: NbExpandedGetter<N>
}

/**
 * A row as the grid renders it, and the implicit context of its cells: the row's data, its child rows, whether it's
 * open, and its nesting level, from 0.
 */
export class NbTreeGridPresentationNode<T> {
    constructor(
        public readonly data: T,
        public children: Array<NbTreeGridPresentationNode<T>> | undefined,
        public expanded: boolean,
        public readonly level: number
    ) {}

    hasChildren(): this is { children: Array<NbTreeGridPresentationNode<T>> } {
        return !!this.children && !!this.children.length
    }
}
