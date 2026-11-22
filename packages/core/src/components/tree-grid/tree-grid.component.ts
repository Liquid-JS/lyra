import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    EmbeddedViewRef,
    inject,
    input,
    linkedSignal,
    OnChanges,
    OnDestroy,
    QueryList,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { injectNbDefaults, NbContainerAppearance, NB_WINDOW, NbPlatform, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { CDK_TABLE } from '@angular/cdk/table'
import { fromEvent, merge } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { NB_TABLE_TEMPLATE, NbTable, NB_TABLE_PROVIDERS, ɵNbRowContext as NbRowContext, NbHeaderRowOutletDirective, NbDataRowOutletDirective, NbNoDataRowOutletDirective, NbFooterRowOutletDirective } from '@liquid-js/lyr-core/cdk-table'
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from './data-source/tree-grid-data-source'
import { NB_DEFAULT_ROW_LEVEL, NbTreeGridPresentationNode } from './data-source/tree-grid.model'
import { NbToggleOptions } from './data-source/tree-grid.service'
import { NB_TREE_GRID } from './tree-grid-injection-tokens'
import { NbTreeGridRowComponent } from './tree-grid-row.component'
import { NbTreeGridCellDirective } from './tree-grid-cell.component'
import { NbTreeGridColumnDefDirective } from './tree-grid-column-def.directive'
import {
    NbTreeGridFooterRowDefDirective,
    NbTreeGridHeaderRowDefDirective,
    NbTreeGridRowDefDirective
} from './tree-grid-def.component'
import { NbColumnsService } from './tree-grid-columns.service'

/**
 * A table of nested rows, which open and close, with sorting and filtering.
 *
 * @stacked-example(Showcase, tree-grid/tree-grid-showcase.component)
 *
 * ### Installation
 *
 * Import `NbTreeGridModule` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbTreeGridModule],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbTreeGridModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbTreeGridModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 *
 * ### Usage
 *
 * At the least, define the row with [nbTreeGridRowDef](components/data/tree-grid/api#nbtreegridrowdefdirective),
 * which lists the columns to show, and a
 * [nbTreeGridColumnDef](components/data/tree-grid/api#nbtreegridcolumndefdirective) for each of those columns, with
 * its cell definitions.
 * @stacked-example(Basic, tree-grid/tree-grid-basic.component)
 *
 * The `source` input and `NbTreeGridDataSourceBuilder.create` take an array of nodes with `data`, `children` and
 * `expanded` properties. For nodes of another shape, pass `NbTreeGridDataSourceBuilder.create` a getter for each of
 * the three.
 * @stacked-example(Custom node structure, tree-grid/tree-grid-custom-node-structure.component)
 *
 * To sort, put the `nbSort` directive on the table and `nbSortHeader` on the header cells. A click on a header
 * emits `sort` with the column's name and the next direction, and sorts the data source when `nbSort` is given one.
 * The data source sorts every level: the top-level rows, and each row's children among themselves, so a child stays
 * under its parent. Values compare as JavaScript compares them, so a column to sort by holds numbers or dates rather
 * than their text.
 * @stacked-example(Sortable, tree-grid/tree-grid-sortable.component)
 *
 * `NbTreeGridDataSourceBuilder` creates an `NbTreeGridDataSource`, whose `toggle`, `sort` and `filter` methods
 * change the grid from code. The `nbSort` and `nbFilterInput` directives take the data source directly and call
 * them themselves.
 * @stacked-example(Data Source Builder, tree-grid/tree-grid-showcase.component)
 *
 * The data source's `filter(query)` shows only the rows that match, e.g. as the user types in a field:
 * @stacked-example(Filter, tree-grid/tree-grid-filterable.component)
 *
 * The `hideOn` and `showOn` inputs of
 * [nbTreeGridColumnDef](components/data/tree-grid/api#nbtreegridcolumndefdirective) hide or show a column by the
 * window's width, which the grid follows as the window is resized.
 * @stacked-example(Responsive columns, tree-grid/tree-grid-responsive.component)
 *
 * To customise the sort or row toggle icons, use the `nbSortHeaderIcon` and `nbTreeGridRowToggle` directives.
 * `nbSortHeaderIcon` is a structural directive whose implicit context is the current direction; the context also
 * has `isAscending`, `isDescending` and `isNone`.
 * @stacked-example(Custom icons, tree-grid/tree-grid-custom-icons.component)
 *
 * By default, a click anywhere in a row toggles it, and a double click toggles it with all its descendants.
 * `[clickToToggle]="false"` on `nbTreeGridRow` turns both off.
 * @stacked-example(Disable click toggle, tree-grid/tree-grid-disable-click-toggle.component)
 *
 * A grid with no rows to show, e.g. no data or none that matches a filter, shows its `nbTreeGridNoDataRowDef` row.
 * Its `nbTreeGridNoDataCell` spans the columns the grid shows.
 *
 * ```html
 * <tr *nbTreeGridNoDataRowDef>
 *   <td nbTreeGridNoDataCell>No files match</td>
 * </tr>
 * ```
 * @stacked-example(No data, tree-grid/tree-grid-no-data.component)
 *
 * `compact` takes less padding in the cells, and `striped` gives every other row a background. A grid placed directly
 * in `nb-card` lines up with the card's header and footer, and the card's border takes the place of its own.
 * @stacked-example(Compact and striped in a card, tree-grid/tree-grid-variants.component)
 * @styles
 *
 * tree-grid-cell-border-width:
 * tree-grid-cell-border-style:
 * tree-grid-cell-border-color:
 * tree-grid-row-min-height:
 * tree-grid-cell-padding:
 * tree-grid-compact-cell-padding:
 * tree-grid-card-edge-padding:
 * tree-grid-edge-padding:
 * tree-grid-floating-shadow:
 * tree-grid-header-background-color:
 * tree-grid-header-text-color:
 * tree-grid-header-text-font-family:
 * tree-grid-header-text-font-size:
 * tree-grid-header-text-font-weight:
 * tree-grid-header-text-line-height:
 * tree-grid-footer-background-color:
 * tree-grid-footer-text-color:
 * tree-grid-footer-text-font-family:
 * tree-grid-footer-text-font-size:
 * tree-grid-footer-text-font-weight:
 * tree-grid-footer-text-line-height:
 * tree-grid-row-background-color:
 * tree-grid-row-even-background-color:
 * tree-grid-row-hover-background-color:
 * tree-grid-row-text-color:
 * tree-grid-row-text-font-family:
 * tree-grid-row-text-font-size:
 * tree-grid-row-text-font-weight:
 * tree-grid-row-text-line-height:
 * tree-grid-striped-row-background-color:
 * tree-grid-no-data-text-color:
 * tree-grid-no-data-padding:
 * tree-grid-sort-header-button-background-color:
 * tree-grid-sort-header-button-border:
 * tree-grid-sort-header-button-padding:
 * tree-grid-button-outline-width:
 * tree-grid-button-outline-color:
 * tree-grid-button-outline-border-radius:
 */
@Component({
    selector: 'table[nbTreeGrid]',
    template: NB_TABLE_TEMPLATE,
    styleUrls: ['./tree-grid.component.scss'],
    providers: [
        { provide: NB_TREE_GRID, useExisting: NbTreeGridComponent },
        { provide: CDK_TABLE, useExisting: NbTreeGridComponent },
        NbColumnsService,
        ...NB_TABLE_PROVIDERS
    ],
    // As in the CDK table, rows and the cells rendered into them are checked on every change detection.
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        NbHeaderRowOutletDirective,
        NbDataRowOutletDirective,
        NbNoDataRowOutletDirective,
        NbFooterRowOutletDirective
    ],
    host: {
        'class': 'nb-tree-grid',
        '[class.nb-tree-grid-compact]': 'compact()',
        '[class.nb-tree-grid-striped]': 'striped()',
        '[class]': '"appearance-" + appearance()'
    }
})
export class NbTreeGridComponent<T>
    extends NbTable<NbTreeGridPresentationNode<T>>
    implements OnChanges, AfterContentInit, AfterViewInit, OnDestroy {
    protected readonly destroyRef = inject(DestroyRef)
    private readonly dataSourceBuilder = inject<NbTreeGridDataSourceBuilder<T>>(NbTreeGridDataSourceBuilder)
    private readonly window = inject(NB_WINDOW)
    private readonly platform = inject(NbPlatform)

    private _source?: NbTreeGridDataSource<T>

    constructor() {
        super()
        // The rows are presentation nodes made anew on every change; the row of a data item stays the same row, so
        // opening or closing one keeps the others, and their toggles turn in place.
        this.trackBy = (_index, node) => node.data
    }

    /**
     * The rows: an array of nodes (`{ data, children, expanded }`), or a data source built from one.
     */
    readonly source = input<T[] | NbTreeGridDataSource<T>>(undefined, { alias: 'nbTreeGrid' })

    /**
     * The indent of each nesting level, e.g. `1rem`, applied to a nested row's first cell as its start padding. By
     * default the cell's own padding, once per level.
     */
    readonly levelPadding = input<string>('')

    /**
     * Gives every shown column the same width.
     */
    readonly equalColumnsWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    // The app's defaults for tree grids, which the appearance starts from.
    protected readonly nbDefaults = injectNbDefaults('treeGrid')

    /**
     * Appearance on its own: `outline`, its cells' borders, or `floating`, a shadow in place of its outer borders, over
     * the page. In a card, it has the card's.
     */
    readonly appearanceInput = input<NbContainerAppearance | undefined>(undefined, { alias: 'appearance' })
    /** The appearance in use: the input's, the app's default, or 'outline'. */
    readonly appearance = linkedSignal<NbContainerAppearance>(
        () => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'outline'
    )

    /**
     * Less padding in the cells, for dense data.
     */
    readonly compact = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * A background on every other row.
     */
    readonly striped = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    // Applied in ngOnChanges, as the setter did, so the CDK table has the data source before it renders rows.
    ngOnChanges({ source }: SimpleChanges) {
        const data = this.source()
        if (!source || !data) {
            return
        }

        this._source = data instanceof NbTreeGridDataSource ? data : this.dataSourceBuilder.create(data)
        this.dataSource = this._source
    }

    override ngAfterContentInit() {
        super.ngAfterContentInit()
        // Before the table first renders, so it starts with the columns that fit the window.
        if (this.platform.isBrowser) {
            this.updateVisibleColumns()
        }
    }

    ngAfterViewInit() {
        this.checkDefsCount()
        const rowsChange$ = merge(
            this._contentRowDefs.changes,
            this._contentHeaderRowDefs.changes,
            this._contentFooterRowDefs.changes
        )
        rowsChange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.checkDefsCount())

        if (this.platform.isBrowser && this.window) {
            const windowResize$ = fromEvent(this.window, 'resize').pipe(debounceTime(50))
            merge(rowsChange$, this._contentColumnDefs.changes, windowResize$)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.updateVisibleColumns())
        }
    }

    override ngOnDestroy() {
        super.ngOnDestroy()
    }

    toggleRow(row: NbTreeGridRowComponent, options?: NbToggleOptions) {
        this._source?.toggle(this.getRowNode(row).data, options)
    }

    toggleCellRow(cell: NbTreeGridCellDirective) {
        this._source?.toggle(this.getCellNode(cell).data)
    }

    getColumnWidth(): string {
        if (this.equalColumnsWidth()) {
            return `${100 / this.getColumnsCount()}%`
        }
        return ''
    }

    getCellLevel(cell: NbTreeGridCellDirective, columnName: string): number {
        if (this.isFirstColumn(columnName)) {
            return this.getCellNode(cell).level
        }
        return NB_DEFAULT_ROW_LEVEL
    }

    // Rows and cells are rendered by the grid, so their row views are in the row outlet.
    private getRowNode(row: NbTreeGridRowComponent): NbTreeGridPresentationNode<T> {
        return this.getNodeByRowEl(row.elementRef.nativeElement)
    }

    private getCellNode(cell: NbTreeGridCellDirective): NbTreeGridPresentationNode<T> {
        return this.getNodeByRowEl(cell.elementRef.nativeElement.parentElement)
    }

    private getNodeByRowEl(rowEl: HTMLElement | null): NbTreeGridPresentationNode<T> {
        const node = rowEl ? this.getContextByRowEl(rowEl)?.$implicit : undefined
        if (!node) {
            throw new Error('NbTreeGridComponent: the row is not rendered by the tree grid.')
        }
        return node
    }

    private getContextByRowEl(rowEl: HTMLElement): NbRowContext<NbTreeGridPresentationNode<T>> | undefined {
        const rowsContainer: ViewContainerRef = this._rowOutlet.viewContainer

        for (let i = 0; i < rowsContainer.length; i++) {
            const rowViewRef = rowsContainer.get(i) as EmbeddedViewRef<NbRowContext<NbTreeGridPresentationNode<T>>>

            if (rowViewRef.rootNodes.includes(rowEl)) {
                return rowViewRef.context
            }
        }

        return undefined
    }

    private getColumns(): string[] {
        let rowDef: NbTreeGridHeaderRowDefDirective | NbTreeGridRowDefDirective<unknown>

        if (this._contentHeaderRowDefs.length) {
            rowDef = this._contentHeaderRowDefs.first as NbTreeGridHeaderRowDefDirective
        } else {
            rowDef = this._contentRowDefs.first as NbTreeGridRowDefDirective<unknown>
        }

        return Array.from(rowDef.getVisibleColumns() || [])
    }

    /**
     * How many columns the grid shows, which can change with the window's width.
     */
    getColumnsCount(): number {
        return this.getColumns().length
    }

    private isFirstColumn(columnName: string): boolean {
        return this.getColumns()[0] === columnName
    }

    private checkDefsCount() {
        if (this._contentRowDefs.length > 1) {
            throw new Error('Found multiple row definitions')
        }
        if (this._contentHeaderRowDefs.length > 1) {
            throw new Error('Found multiple header row definitions')
        }
        if (this._contentFooterRowDefs.length > 1) {
            throw new Error('Found multiple footer row definitions')
        }
    }

    private updateVisibleColumns() {
        if (!this.window) {
            return
        }
        const width = this.window.innerWidth
        const columnDefs = this._contentColumnDefs as QueryList<NbTreeGridColumnDefDirective>

        const columnsToHide: string[] = columnDefs
            .filter((col: NbTreeGridColumnDefDirective) => col.shouldHide(width))
            .map((col) => col.name)

        const columnsToShow: string[] = columnDefs
            .filter((col: NbTreeGridColumnDefDirective) => col.shouldShow(width))
            .map((col) => col.name)

        if (!columnsToHide.length && !columnsToShow.length) {
            return
        }

        const rowDefs = [
            this._contentHeaderRowDefs.first as NbTreeGridHeaderRowDefDirective,
            this._contentRowDefs.first as NbTreeGridRowDefDirective<unknown>,
            this._contentFooterRowDefs.first as NbTreeGridFooterRowDefDirective
        ].filter((d) => !!d)

        for (const rowDef of rowDefs) {
            for (const column of columnsToHide) {
                rowDef.hideColumn(column)
            }

            for (const column of columnsToShow) {
                rowDef.showColumn(column)
            }
        }
        // The table renders changed columns when it's next checked, which a window resize doesn't schedule.
        this._changeDetectorRef.markForCheck()
    }
}
