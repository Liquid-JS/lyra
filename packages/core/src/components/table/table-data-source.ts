import { DataSource } from '@angular/cdk/collections'
import {
    computed,
    DestroyRef,
    inject,
    Injector,
    isSignal,
    linkedSignal,
    signal,
    Signal,
    untracked,
    WritableSignal
} from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs'

import { NbPageable } from '@liquid-js/lyr-core/pagination'
import { NbSortDirection, NbSortRequest, NbSortState } from '@liquid-js/lyr-core/tree-grid'

/** A table's order: a column, and which way. */
export interface NbTableSort {
    column: string
    direction: 'asc' | 'desc'
}

/** A table's filters, by name, e.g. a column or `search`. Empty values filter nothing. */
export type NbTableFilters = Record<string, unknown>

/** What a table asks a loader for: a page of rows, in an order, filtered, for its params. */
export interface NbTableQuery<P> {
    /** The page, from 0. */
    page: number
    pageSize: number
    sort?: NbTableSort
    filters: NbTableFilters
    params: P
}

/** A page of rows a loader gives, and how many rows there are on all pages. */
export interface NbTablePage<T> {
    rows: ReadonlyArray<T>
    total: number
}

interface NbTableDataSourceCommonOptions<T> {
    /** Rows on a page; 10 by default. */
    pageSize?: number
    /**
     * A row's identity, which keeps it selected and expanded when the rows are loaded again; the row itself by default.
     */
    rowId?: (row: T) => unknown
}

/** Rows in the browser, which the data source sorts, filters and pages itself. */
export interface NbTableDataSourceArrayOptions<T> extends NbTableDataSourceCommonOptions<T> {
    data: ReadonlyArray<T> | Signal<ReadonlyArray<T>>
    /** A row's value to sort a column by; the row's property of the column's name by default. */
    sortValue?: (row: T, column: string) => unknown
    /**
     * Whether a row passes the filters; by default each filter is the row's property of its name, as text that includes
     * the filter's text, or equal to it otherwise.
     */
    filter?: (row: T, filters: NbTableFilters) => boolean
}

/** Rows a server gives a page at a time. */
export interface NbTableDataSourceLoaderOptions<T, P> extends NbTableDataSourceCommonOptions<T> {
    /** Loads a page of rows for a query; loading again for a new query drops the previous one. */
    load: (query: NbTableQuery<P>) => Observable<NbTablePage<T>>
    /** More of what the rows depend on, e.g. a customer's id; a change loads the first page again. */
    params?: Signal<P>
}

export type NbTableDataSourceOptions<T, P> = NbTableDataSourceArrayOptions<T> | NbTableDataSourceLoaderOptions<T, P>

const isEmpty = (value: unknown) =>
    value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)

/** Compares two values to sort by: numbers and dates by value, text in the user's order, empty values last. */
function compare(a: unknown, b: unknown): number {
    if (isEmpty(a) || isEmpty(b)) {
        return isEmpty(a) === isEmpty(b) ? 0 : isEmpty(a) ? 1 : -1
    }
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() - b.getTime()
    }
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b
    }
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

function defaultFilter<T>(row: T, filters: NbTableFilters) {
    return Object.entries(filters).every(([name, value]) => {
        if (isEmpty(value)) {
            return true
        }
        const cell = (row as Record<string, unknown>)[name]
        if (typeof value === 'string') {
            return String(cell ?? '').toLocaleLowerCase().includes(value.toLocaleLowerCase())
        }
        return cell === value
    })
}

/**
 * The rows of a `nbTable`, from an array in the browser or a server, sorted, filtered and a page at a time; it's also
 * what `nbSort` sorts and `nb-pagination [for]` pages, and it keeps the selection and the expanded rows of the page.
 *
 * Create it with `nbTableDataSource()` in an injection context, e.g. a component's field.
 */
export class NbTableDataSource<T, P = void> extends DataSource<T> implements NbPageable, NbSortState {
    /** The order; `undefined` for the rows' own. A change goes back to the first page. */
    readonly sort = signal<NbTableSort | undefined>(undefined)
    /** The filters; a change goes back to the first page. */
    readonly filters = signal<NbTableFilters>({})
    readonly pageSize: WritableSignal<number>
    /** The page, from 0; new filters, order or params go back to the first page. */
    readonly page: WritableSignal<number>

    /** The rows of the page. */
    readonly rows: Signal<ReadonlyArray<T>>
    /** How many rows there are on all pages. */
    readonly total: Signal<number>
    /** Whether a page is loading from the server. */
    readonly loading: Signal<boolean>
    /** What the last load failed with, until the next one succeeds. */
    readonly error: Signal<unknown>

    /** The selected rows of the page; a new page, page size, order, filters or params clear them. */
    readonly selection: Signal<ReadonlyArray<T>>
    readonly allSelected: Signal<boolean>
    readonly someSelected: Signal<boolean>
    /** The expanded rows of the page; a new page, page size, order, filters or params collapse them. */
    readonly expanded: Signal<ReadonlyArray<T>>

    protected readonly rowId: (row: T) => unknown
    protected readonly selectedIds: WritableSignal<ReadonlySet<unknown>>
    protected readonly expandedIds: WritableSignal<ReadonlySet<unknown>>
    protected readonly rows$: Observable<ReadonlyArray<T>>
    protected readonly reloads = signal(0)

    constructor(options: NbTableDataSourceOptions<T, P>, injector: Injector) {
        super()
        this.rowId = options.rowId ?? ((row) => row)
        this.pageSize = signal(options.pageSize ?? 10)
        const params = 'load' in options ? options.params : undefined
        this.page = linkedSignal({
            source: () => [this.filters(), this.sort(), params?.()],
            computation: () => 0
        })

        if ('load' in options) {
            const loaded = signal<NbTablePage<T>>({ rows: [], total: 0 })
            const loading = signal(false)
            const error = signal<unknown>(undefined)
            const query = computed<NbTableQuery<P>>(() => {
                this.reloads()
                return {
                    page: this.page(),
                    pageSize: this.pageSize(),
                    sort: this.sort(),
                    filters: this.filters(),
                    params: params?.() as P
                }
            })
            const subscription = toObservable(query, { injector })
                .pipe(
                    tap(() => loading.set(true)),
                    switchMap((next) =>
                        options.load(next).pipe(
                            tap(() => error.set(undefined)),
                            catchError((failure: unknown) => {
                                error.set(failure)
                                return of(undefined)
                            })
                        )
                    )
                )
                .subscribe((result) => {
                    loading.set(false)
                    if (result) {
                        loaded.set(result)
                    }
                })
            injector.get(DestroyRef).onDestroy(() => subscription.unsubscribe())
            this.rows = computed(() => loaded().rows)
            this.total = computed(() => loaded().total)
            this.loading = loading.asReadonly()
            this.error = error.asReadonly()
        } else {
            const data = isSignal(options.data) ? options.data : signal(options.data)
            const sortValue = options.sortValue ?? ((row: T, column: string) => (row as Record<string, unknown>)[column])
            const filter = options.filter ?? defaultFilter
            const filtered = computed(() => {
                const filters = this.filters()
                const rows = data().filter((row) => filter(row, filters))
                const sort = this.sort()
                if (!sort) {
                    return rows
                }
                const direction = sort.direction === 'desc' ? -1 : 1
                return rows
                    .map((row, index) => ({ row, index, value: sortValue(row, sort.column) }))
                    .sort((a, b) => {
                        // Empty values stay last either way; equal ones keep their order.
                        const empty = compare(a.value, b.value)
                        const order = isEmpty(a.value) || isEmpty(b.value) ? empty : direction * empty
                        return order || a.index - b.index
                    })
                    .map(({ row }) => row)
            })
            this.total = computed(() => filtered().length)
            this.rows = computed(() => {
                const size = this.pageSize()
                // A page past the end, e.g. once rows are removed, shows the last one.
                const last = Math.max(0, Math.ceil(filtered().length / size) - 1)
                const page = Math.min(this.page(), last)
                return filtered().slice(page * size, (page + 1) * size)
            })
            this.loading = signal(false).asReadonly()
            this.error = signal(undefined).asReadonly()
        }

        // The selection and the expanded rows belong to the page as it's asked for.
        const pageKey = computed(() => [this.page(), this.pageSize(), this.sort(), this.filters(), params?.()])
        this.selectedIds = linkedSignal({ source: pageKey, computation: () => new Set<unknown>() })
        this.expandedIds = linkedSignal({ source: pageKey, computation: () => new Set<unknown>() })
        this.selection = computed(() => this.rows().filter((row) => this.selectedIds().has(this.rowId(row))))
        this.expanded = computed(() => this.rows().filter((row) => this.expandedIds().has(this.rowId(row))))
        this.allSelected = computed(() => this.rows().length > 0 && this.selection().length === this.rows().length)
        this.someSelected = computed(() => this.selection().length > 0 && !this.allSelected())
        this.rows$ = toObservable(this.rows, { injector })
    }

    /** @internal */
    connect(): Observable<ReadonlyArray<T>> {
        return this.rows$.pipe(map((rows) => [...rows]))
    }

    /** @internal */
    disconnect() {}

    /** Loads the page again, e.g. after the server's data changed. */
    reload() {
        this.reloads.update((count) => count + 1)
    }

    /** Sets one filter; empty values filter nothing. */
    setFilter(name: string, value: unknown) {
        this.filters.update((filters) => ({ ...filters, [name]: value }))
    }

    /** Sorts by a sort header's request, for `nbSort`. */
    sortBy(request: NbSortRequest) {
        this.sort.set(
            request.direction === NbSortDirection.NONE
                ? undefined
                : { column: request.column, direction: request.direction === NbSortDirection.DESCENDING ? 'desc' : 'asc' }
        )
    }

    /** The direction a column is sorted in, for its sort header. */
    sortDirection(column: string): NbSortDirection {
        const sort = this.sort()
        if (sort?.column !== column) {
            return NbSortDirection.NONE
        }
        return sort.direction === 'desc' ? NbSortDirection.DESCENDING : NbSortDirection.ASCENDING
    }

    isSelected(row: T) {
        return this.selectedIds().has(this.rowId(row))
    }

    /** Selects a row, or with `selected` false deselects it. */
    select(row: T, selected = !this.isSelected(row)) {
        const id = this.rowId(row)
        this.selectedIds.update((ids) => {
            const next = new Set(ids)
            if (selected) {
                next.add(id)
            } else {
                next.delete(id)
            }
            return next
        })
    }

    /** Selects all rows of the page, or deselects them when they all are. */
    selectAll(selected = !untracked(this.allSelected)) {
        this.selectedIds.set(new Set(selected ? this.rows().map((row) => this.rowId(row)) : []))
    }

    isExpanded(row: T) {
        return this.expandedIds().has(this.rowId(row))
    }

    /** Expands a row's details, or with `expanded` false collapses them. */
    expand(row: T, expanded = !this.isExpanded(row)) {
        const id = this.rowId(row)
        this.expandedIds.update((ids) => {
            const next = new Set(ids)
            if (expanded) {
                next.add(id)
            } else {
                next.delete(id)
            }
            return next
        })
    }
}

/**
 * Creates a table's data source, in an injection context: from rows in the browser (`data`), or a `load` function that
 * fetches a page from a server for a query, with `params`.
 *
 * ```ts
 * readonly users = nbTableDataSource({ data: this.allUsers, pageSize: 25 });
 *
 * readonly orders = nbTableDataSource({
 *   load: ({ page, pageSize, sort, filters, params }) => this.api.orders(params.customerId, page, pageSize, sort),
 *   params: computed(() => ({ customerId: this.customerId() })),
 *   rowId: (order) => order.id,
 * });
 * ```
 */
export function nbTableDataSource<T>(options: NbTableDataSourceArrayOptions<T>): NbTableDataSource<T>
export function nbTableDataSource<T, P = void>(options: NbTableDataSourceLoaderOptions<T, P>): NbTableDataSource<T, P>
export function nbTableDataSource<T, P>(options: NbTableDataSourceOptions<T, P>): NbTableDataSource<T, P> {
    return new NbTableDataSource(options, inject(Injector))
}
