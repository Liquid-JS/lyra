import {
    AfterContentChecked,
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    Directive,
    effect,
    inject,
    input,
    linkedSignal,
    OnDestroy,
    OnInit,
    signal,
    untracked,
    ViewChild
} from '@angular/core'
import { injectNbDefaults, NbContainerAppearance, injectNbTexts, NbLocalize, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { CDK_TABLE, CdkNoDataRow, CdkRowDef, CdkTableDataSourceInput } from '@angular/cdk/table'
import { NbCheckboxComponent } from '@liquid-js/lyr-core/checkbox'
import { NbCellDefDirective, NbCellDirective, NbColumnDefDirective, NbHeaderCellDefDirective, NbHeaderCellDirective, NbTableRowContext, NbCellOutletDirective, NbDataRowOutletDirective, NbFooterRowOutletDirective, NbHeaderRowOutletDirective, NbNoDataRowOutletDirective, NB_TABLE_PROVIDERS, NB_TABLE_TEMPLATE, NbTable } from '@liquid-js/lyr-core/cdk-table'
import { NbTableDataSource } from './table-data-source'

/** @internal */
declare const $localize: NbLocalize

/** @internal */
function injectNbTableTexts() {
    return injectNbTexts('table', () => ({
        selectAll: $localize`:@@nb.table.selectAll:Select all rows`,
        selectRow: $localize`:@@nb.table.selectRow:Select row`
    }))
}

/**
 * A row of details under a row of a `nbTable`, shown while the row is expanded, e.g. by a button with `nbExpandRow`.
 * Put it on a `tr nbDetailRow`; its content spans the columns:
 *
 * ```html
 * <tr nbDetailRow *nbDetailRowDef="let user; of: source">{{ user.bio }}</tr>
 * ```
 */
@Directive({
    selector: '[nbDetailRowDef]',
    providers: [{ provide: CdkRowDef, useExisting: NbDetailRowDefDirective }]
})
export class NbDetailRowDefDirective<T> extends CdkRowDef<T> {
    /** The table's data source, which knows the expanded rows, and gives the row its type. */
    readonly of = input.required<NbTableDataSource<T, unknown>>({ alias: 'nbDetailRowDefOf' })

    constructor() {
        super()
        // A detail row has no cells of the columns: its content spans them.
        this.columns = []
        this._columnsDiffer = this._differs.find([]).create()
        this._columnsDiffer.diff([])
        this.when = (_index, row) => this.of().isExpanded(row)
    }

    static ngTemplateContextGuard<T>(
        _directive: NbDetailRowDefDirective<T>,
        _context: unknown
    ): _context is NbTableRowContext<T> {
        return true
    }
}

/**
 * The row a `nbTable` shows while it has no rows to show, e.g. no data, or none that matches the filters. Put it on a
 * `tr` with an `nbNoDataCell`, which spans the columns:
 *
 * ```html
 * <tr *nbNoDataRow><td nbNoDataCell>No users match</td></tr>
 * ```
 */
@Directive({
    selector: 'ng-template[nbNoDataRow]',
    providers: [{ provide: CdkNoDataRow, useExisting: NbNoDataRowDirective }]
})
export class NbNoDataRowDirective extends CdkNoDataRow {
    // The table adds these to the row and its cells as it renders them.
    override _contentClassNames = ['nb-row', 'nb-no-data-row']
    override _cellClassNames = ['nb-cell', 'nb-no-data-cell']
}

/**
 * A table of rows from a data source, typically `nbTableDataSource()`, in columns described with templates:
 *
 * ```html
 * <table nbTable [dataSource]="source" [nbSort]="source">
 *   <ng-container nbColumnDef="name">
 *     <th nbHeaderCell *nbHeaderCellDef nbSortHeader>Name</th>
 *     <td nbCell *nbCellDef="let user; of: source">{{ user.name }}</td>
 *   </ng-container>
 *   <tr nbHeaderRow *nbHeaderRowDef="columns"></tr>
 *   <tr nbRow *nbRowDef="let user; of: source; columns: columns"></tr>
 * </table>
 * <nb-pagination [for]="source" />
 * ```
 *
 * @stacked-example(Showcase, table/table-showcase.component)
 *
 * `of: source` gives the row its type in the cell and row templates, so `user.name` is checked. The data source sorts
 * (`nbSort` with `nbSortHeader`), filters (`source.filters`) and pages (`nb-pagination [for]`) rows in the browser,
 * from `data`, or asks a server for a page with `load`, given its `params`, e.g. a customer's id. New filters, a new
 * order or new params go back to the first page.
 * @stacked-example(Rows from a server, table/table-server.component)
 *
 * `nb-select-column` adds a column of checkboxes, with one in the header for all the rows of the page; the data
 * source's `selection()` has the selected rows, which a new page, order or filters clear. A detail row
 * (`*nbDetailRowDef`) shows under a row while it's expanded, e.g. by a button with `[nbExpandRow]="user"`:
 * @stacked-example(Selection and details, table/table-selection.component)
 *
 * `compact` takes less padding in the cells, and `striped` gives every other row a background; like the tree grid,
 * a table placed directly in `nb-card` lines up with the card. A `*nbNoDataRow` shows while there are no rows.
 * @styles
 *
 * table-cell-border-width:
 * table-cell-border-style:
 * table-cell-border-color:
 * table-row-min-height:
 * table-cell-padding:
 * table-compact-cell-padding:
 * table-card-edge-padding:
 * table-edge-padding:
 * table-floating-shadow:
 * table-header-background-color:
 * table-header-text-color:
 * table-header-text-font-family:
 * table-header-text-font-size:
 * table-header-text-font-weight:
 * table-header-text-line-height:
 * table-footer-background-color:
 * table-footer-text-color:
 * table-footer-text-font-family:
 * table-footer-text-font-size:
 * table-footer-text-font-weight:
 * table-footer-text-line-height:
 * table-row-background-color:
 * table-row-even-background-color:
 * table-row-hover-background-color:
 * table-row-selected-background-color:
 * table-row-text-color:
 * table-row-text-font-family:
 * table-row-text-font-size:
 * table-row-text-font-weight:
 * table-row-text-line-height:
 * table-striped-row-background-color:
 * table-detail-row-background-color:
 * table-no-data-text-color:
 * table-no-data-padding:
 */
@Component({
    selector: 'table[nbTable]',
    template: NB_TABLE_TEMPLATE,
    styleUrls: ['./table.component.scss'],
    providers: [{ provide: CDK_TABLE, useExisting: NbTableComponent }, ...NB_TABLE_PROVIDERS],
    // As in the CDK table, rows and the cells rendered into them are checked on every change detection.
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        NbHeaderRowOutletDirective,
        NbDataRowOutletDirective,
        NbNoDataRowOutletDirective,
        NbFooterRowOutletDirective
    ],
    host: {
        'class': 'nb-table',
        '[class.nb-table-compact]': 'compact()',
        '[class.nb-table-striped]': 'striped()',
        '[class]': '"appearance-" + appearance()'
    }
})
export class NbTableComponent<T> extends NbTable<T> implements AfterContentInit, AfterContentChecked {
    // The app's defaults for data tables, which the appearance starts from.
    protected readonly nbDefaults = injectNbDefaults('table')

    /**
     * Appearance on its own: `outline`, its cells' borders, or `floating`, a shadow in place of its outer borders, over
     * the page. In a card, it has the card's.
     */
    readonly appearanceInput = input<NbContainerAppearance | undefined>(undefined, { alias: 'appearance' })
    /** The appearance in use: the input's, the app's default, or 'outline'. */
    readonly appearance = linkedSignal<NbContainerAppearance>(
        () => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'outline'
    )

    /** Less padding in the cells. */
    readonly compact = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** A background on every other row. */
    readonly striped = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    protected readonly detailRowDefs = contentChildren(NbDetailRowDefDirective, { descendants: true })

    /** How many columns the rows show, which detail and no-data cells span. */
    readonly columnCount = signal(1)

    protected readonly currentSource = signal<CdkTableDataSourceInput<T> | undefined>(undefined)

    override get dataSource(): CdkTableDataSourceInput<T> {
        return super.dataSource
    }

    override set dataSource(dataSource: CdkTableDataSourceInput<T>) {
        super.dataSource = dataSource
        this.currentSource.set(dataSource)
    }

    constructor() {
        super()
        // Each row can have its detail row after it.
        effect(() => {
            this.multiTemplateDataRows = this.detailRowDefs().length > 0
        })
        // The table shows detail rows as it renders the data, which expanding a row doesn't change.
        effect(() => {
            const source = this.currentSource()
            if (source instanceof NbTableDataSource) {
                source.expanded()
                untracked(() => this._data && this.renderRows())
            }
        })
    }

    override ngAfterContentInit() {
        this.multiTemplateDataRows = this.detailRowDefs().length > 0
        super.ngAfterContentInit()
    }

    override ngAfterContentChecked() {
        super.ngAfterContentChecked()
        const rowDef = this._contentRowDefs?.find((def) => !(def instanceof NbDetailRowDefDirective))
        this.columnCount.set(Math.max(1, rowDef ? [...rowDef.columns].length : 1))
    }

    /** The table's data source, when it's an `NbTableDataSource`. */
    get source(): NbTableDataSource<T, unknown> | undefined {
        const source = this.dataSource
        return source instanceof NbTableDataSource ? source : undefined
    }
}

/**
 * The row of a detail row definition (`*nbDetailRowDef`), with its content in one cell across the columns.
 */
@Component({
    selector: 'tr[nbDetailRow]',
    template: `
    <td class="nb-cell nb-detail-cell" [attr.colspan]="table.columnCount()"><ng-content /></td>
    <ng-container nbCellOutlet />
  `,
    host: {
        class: 'nb-row nb-detail-row',
        role: 'row'
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NbCellOutletDirective]
})
export class NbDetailRowComponent {
    protected readonly table = inject(NbTableComponent)
}

/**
 * The cell of a table's no-data row (`*nbNoDataRow`), across the columns it shows.
 */
@Directive({
    selector: 'td[nbNoDataCell]',
    host: {
        '[attr.colspan]': 'table.columnCount()'
    }
})
export class NbNoDataCellDirective {
    protected readonly table = inject(NbTableComponent)
}

/**
 * Expands or collapses a row's details (`*nbDetailRowDef`): put it on a button in the row, with the row.
 *
 * ```html
 * <button nbButton ghost [nbExpandRow]="user">Details</button>
 * ```
 */
@Directive({
    selector: '[nbExpandRow]',
    host: {
        '[attr.aria-expanded]': 'expanded()',
        '(click)': 'toggle()'
    }
})
export class NbExpandRowDirective<T> {
    protected readonly table = inject<NbTableComponent<T>>(NbTableComponent)

    /** The row whose details it expands. */
    readonly row = input.required<T>({ alias: 'nbExpandRow' })

    expanded() {
        return !!this.table.source?.isExpanded(this.row())
    }

    toggle() {
        this.table.source?.expand(this.row())
    }
}

/**
 * A column of checkboxes that select rows of the page, with one in the header for all of them. The table's data
 * source keeps the selection: `source.selection()`.
 *
 * ```html
 * <nb-select-column />
 * <tr nbHeaderRow *nbHeaderRowDef="['select', 'name']"></tr>
 * ```
 */
@Component({
    selector: 'nb-select-column',
    template: `
    <ng-container nbColumnDef>
      <th nbHeaderCell *nbHeaderCellDef class="nb-select-cell">
        <nb-checkbox
          [checked]="!!table.source?.allSelected()"
          [indeterminate]="!!table.source?.someSelected()"
          (checkedChange)="table.source?.selectAll($event)"
          ><span class="visually-hidden">{{ texts().selectAll }}</span></nb-checkbox
        >
      </th>
      <td nbCell *nbCellDef="let row; of: table.source" class="nb-select-cell">
        <nb-checkbox [checked]="!!table.source?.isSelected(row)" (checkedChange)="table.source?.select(row, $event)"
          ><span class="visually-hidden">{{ texts().selectRow }}</span></nb-checkbox
        >
      </td>
    </ng-container>
  `,
    imports: [
        NbColumnDefDirective,
        NbHeaderCellDefDirective,
        NbHeaderCellDirective,
        NbCellDefDirective,
        NbCellDirective,
        NbCheckboxComponent
    ]
})
export class NbSelectColumnComponent<T> implements OnInit, OnDestroy {
    protected readonly table = inject<NbTableComponent<T>>(NbTableComponent)
    protected readonly texts = injectNbTableTexts()

    /** The column's name, for the row definitions' columns. */
    readonly name = input('select')

    // Read in ngOnInit, to add the column to the table before it renders.
    @ViewChild(NbColumnDefDirective, { static: true }) protected columnDef?: NbColumnDefDirective
    @ViewChild(NbHeaderCellDefDirective, { static: true }) protected headerCellDef?: NbHeaderCellDefDirective
    @ViewChild(NbCellDefDirective, { static: true }) protected cellDef?: NbCellDefDirective

    ngOnInit() {
    // The static queries are set by now, as the template always has them.
        const { columnDef, headerCellDef, cellDef } = this
        if (!columnDef || !headerCellDef || !cellDef) {
            return
        }
        columnDef.name = this.name()
        // The column finds its cells once its view is checked, after the table renders: it gets them now.
        columnDef.headerCell = headerCellDef
        columnDef.cell = cellDef
        this.table.addColumnDef(columnDef)
    }

    ngOnDestroy() {
        if (this.columnDef) {
            this.table.removeColumnDef(this.columnDef)
        }
    }
}
