import { inject, Service } from '@angular/core'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { ɵNbCollectionViewer as NbCollectionViewer } from '@liquid-js/lyr-core/base'
import { NbDataSource } from '@liquid-js/lyr-core/cdk-table'
import { NbSortable, NbSortRequest } from '../tree-grid-sort.component'
import { NbTreeGridDataService } from './tree-grid-data.service'
import { NbTreeGridFilterService } from './tree-grid-filter.service'
import { NbTreeGridSortService } from './tree-grid-sort.service'
import { NbGetters, NB_DEFAULT_ROW_LEVEL, NbTreeGridPresentationNode } from './tree-grid.model'
import { NbToggleOptions, NbTreeGridService } from './tree-grid.service'

export interface NbFilterable {
    filter(filterRequest: string): void
}

/**
 * The tree grid's rows: nested nodes it filters, sorts and flattens into the rows to render. Create one with
 * `NbTreeGridDataSourceBuilder`. `T` is a row's data, which `expand`, `collapse` and `toggle` take.
 */
export class NbTreeGridDataSource<T> extends NbDataSource<NbTreeGridPresentationNode<T>>
    implements NbSortable, NbFilterable {
    /** Stream that emits when a new data array is set on the data source. */
    private data = new BehaviorSubject(new Array<NbTreeGridPresentationNode<T>>())

    /** Stream emitting render data to the table (depends on ordered data changes). */
    private readonly renderData = new BehaviorSubject<Array<NbTreeGridPresentationNode<T>>>([])

    private readonly filterRequest = new BehaviorSubject<string>('')

    private readonly sortRequest = new BehaviorSubject<NbSortRequest | undefined>(undefined)

    constructor(private sortService: NbTreeGridSortService<T>,
        private filterService: NbTreeGridFilterService<T>,
        private treeGridService: NbTreeGridService<T>,
        private treeGridDataService: NbTreeGridDataService<T>) {
        super()
    }

    setData<N>(data: N[], customGetters?: NbGetters<N, T>) {
        let presentationData = new Array<NbTreeGridPresentationNode<T>>()
        if (data) {
            presentationData = this.treeGridDataService.toPresentationNodes(data, customGetters)
        }

        this.data = new BehaviorSubject(presentationData)
        this.updateChangeSubscription()
    }

    connect(
        _collectionViewer: NbCollectionViewer
    ): Observable<Array<NbTreeGridPresentationNode<T>> | ReadonlyArray<NbTreeGridPresentationNode<T>>> {
        return this.renderData
    }

    disconnect(_collectionViewer: NbCollectionViewer) {
    }

    expand(row: T) {
        this.treeGridService.expand(this.data.value, row)
        this.data.next(this.data.value)
    }

    collapse(row: T) {
        this.treeGridService.collapse(this.data.value, row)
        this.data.next(this.data.value)
    }

    toggle(row: T, options?: NbToggleOptions) {
        this.treeGridService.toggle(this.data.value, row, options)
        this.data.next(this.data.value)
    }

    /** Toggles the row at an index among the rendered rows. */
    toggleByIndex(dataIndex: number, options?: NbToggleOptions) {
        const node: NbTreeGridPresentationNode<T> = this.renderData.value && this.renderData.value[dataIndex]
        if (node) {
            this.toggle(node.data, options)
        }
    }

    /** The nesting level, from 0, of the row at an index among the rendered rows. */
    getLevel(rowIndex: number): number {
        const row = this.renderData.value[rowIndex]
        return row ? row.level : NB_DEFAULT_ROW_LEVEL
    }

    sort(sortRequest: NbSortRequest) {
        this.sortRequest.next(sortRequest)
    }

    filter(searchQuery: string) {
        this.filterRequest.next(searchQuery)
    }

    protected updateChangeSubscription() {
        const dataStream = this.data

        const filteredData = combineLatest([dataStream, this.filterRequest])
            .pipe(
                map(([data]) => this.treeGridDataService.copy(data)),
                map((data) => this.filterData(data))
            )

        const sortedData = combineLatest([filteredData, this.sortRequest])
            .pipe(
                map(([data]) => this.sortData(data))
            )

        sortedData
            .pipe(
                map((data: Array<NbTreeGridPresentationNode<T>>) => this.treeGridDataService.flattenExpanded(data))
            )
            .subscribe((data: Array<NbTreeGridPresentationNode<T>>) => this.renderData.next(data))
    }

    private filterData(data: Array<NbTreeGridPresentationNode<T>>): Array<NbTreeGridPresentationNode<T>> {
        return this.filterService.filter(this.filterRequest.value, data)
    }

    private sortData(data: Array<NbTreeGridPresentationNode<T>>): Array<NbTreeGridPresentationNode<T>> {
        return this.sortService.sort(this.sortRequest.value, data)
    }
}

/**
 * Creates tree grid data sources from nested nodes.
 */
@Service()
export class NbTreeGridDataSourceBuilder<T> {
    private readonly filterService = inject<NbTreeGridFilterService<T>>(NbTreeGridFilterService)
    private readonly sortService = inject<NbTreeGridSortService<T>>(NbTreeGridSortService)
    private readonly treeGridService = inject<NbTreeGridService<T>>(NbTreeGridService)
    private readonly treeGridDataService = inject<NbTreeGridDataService<T>>(NbTreeGridDataService)

    /**
     * The nodes are `{ data, children, expanded }` unless `customGetters` read nodes of another shape.
     */
    create<N>(data: N[], customGetters?: NbGetters<N, T>): NbTreeGridDataSource<T> {
        const dataSource = new NbTreeGridDataSource<T>(
            this.sortService,
            this.filterService,
            this.treeGridService,
            this.treeGridDataService
        )

        dataSource.setData(data, customGetters)
        return dataSource
    }
}
