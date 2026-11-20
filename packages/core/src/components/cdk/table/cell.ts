import { Directive, ElementRef, InjectionToken, Input, inject, input } from '@angular/core'
import { DataSource } from '@angular/cdk/collections'
import {
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkFooterCell,
    CdkFooterCellDef,
    CdkHeaderCell,
    CdkHeaderCellDef
} from '@angular/cdk/table'
import { coerceBooleanProperty } from '@angular/cdk/coercion'

/** Where a table's rows come from, which gives its row and cell templates their type. */
export type NbTableRowsOf<T> = DataSource<T> | ReadonlyArray<T>

/** What a table's row and cell templates get: the row, and where it is. */
export interface NbTableRowContext<T> {
    $implicit: T
    index?: number
    /** The row's index in the data, with detail rows. */
    dataIndex?: number
    /** The rendered row's index, with detail rows. */
    renderIndex?: number
    count?: number
    first?: boolean
    last?: boolean
    even?: boolean
    odd?: boolean
}

/**
 * A column's cell template. `of` names where the rows come from, so the row is typed:
 * `<td nbCell *nbCellDef="let user; of: source">{{ user.name }}</td>`.
 */
@Directive({
    selector: '[nbCellDef]',
    providers: [{ provide: CdkCellDef, useExisting: NbCellDefDirective }]
})
export class NbCellDefDirective<T = unknown> extends CdkCellDef {
    /** Where the rows come from, for the row's type in the template only. */
    readonly of = input<NbTableRowsOf<T> | undefined>(undefined, { alias: 'nbCellDefOf' })

    static ngTemplateContextGuard<T>(
        _directive: NbCellDefDirective<T>,
        _context: unknown
    ): _context is NbTableRowContext<T> {
        return true
    }
}

/** A column's header cell template: `<th nbHeaderCell *nbHeaderCellDef>Name</th>`. */
@Directive({
    selector: '[nbHeaderCellDef]',
    providers: [{ provide: CdkHeaderCellDef, useExisting: NbHeaderCellDefDirective }]
})
export class NbHeaderCellDefDirective extends CdkHeaderCellDef {}

/** A column's footer cell template: `<td nbFooterCell *nbFooterCellDef>Total</td>`. */
@Directive({
    selector: '[nbFooterCellDef]',
    providers: [{ provide: CdkFooterCellDef, useExisting: NbFooterCellDefDirective }]
})
export class NbFooterCellDefDirective extends CdkFooterCellDef {}

export const NB_SORT_HEADER_COLUMN_DEF = new InjectionToken('NB_SORT_HEADER_COLUMN_DEF')

/**
 * A table column, named by `nbColumnDef`, holding its header, data and footer cell templates. Its cells get the
 * class `nb-column-<name>`.
 */
@Directive({
    selector: '[nbColumnDef]',
    providers: [
        { provide: CdkColumnDef, useExisting: NbColumnDefDirective },
        { provide: NB_SORT_HEADER_COLUMN_DEF, useExisting: NbColumnDefDirective }
    ]
})
export class NbColumnDefDirective extends CdkColumnDef {
    // The CDK table reads these as plain properties of its base class, so they stay decorated inputs.
    private _hasStickyCellChanged = false

    /** The column's name, unique in the table; the row definitions list the columns to show by it. */
    @Input('nbColumnDef')
    override get name(): string {
        return this._name
    }
    override set name(value: string) {
        this._setNameInput(value)
    }

    /** Whether the column stays in view at the start of the row as the table scrolls sideways. */
    @Input()
    override get sticky(): boolean {
        return this._stickyCell
    }
    override set sticky(value: boolean) {
        if (value !== this._stickyCell) {
            this._stickyCell = value
            this._hasStickyCellChanged = true
        }
    }
    private _stickyCell = false

    /** Whether the column stays in view at the end of the row as the table scrolls sideways. */
    @Input()
    override get stickyEnd(): boolean {
        return this._stickyEnd
    }
    override set stickyEnd(value: boolean) {
        const prevValue = this._stickyEnd
        this._stickyEnd = coerceBooleanProperty(value)
        this._hasStickyCellChanged = prevValue !== this._stickyEnd
    }

    /** Whether `sticky` or `stickyEnd` changed since last asked; asking resets it. */
    override hasStickyChanged(): boolean {
        const hasStickyChanged = this._hasStickyCellChanged
        this.resetStickyChanged()
        return hasStickyChanged
    }

    override resetStickyChanged() {
        this._hasStickyCellChanged = false
    }
}

/** A header cell, with the `nb-header-cell` and `nb-column-<name>` classes and the `columnheader` role. */
@Directive({
    selector: 'nb-header-cell, th[nbHeaderCell]',
    host: {
        class: 'nb-header-cell',
        role: 'columnheader'
    }
})
export class NbHeaderCellDirective extends CdkHeaderCell {
    constructor() {
        super()
        const columnDef = inject(NbColumnDefDirective)
        const elementRef = inject(ElementRef)
        elementRef.nativeElement.classList.add(`nb-column-${columnDef.cssClassFriendlyName}`)
    }
}

/** A footer cell, with the `nb-footer-cell` and `nb-column-<name>` classes and the `gridcell` role. */
@Directive({
    selector: 'nb-footer-cell, td[nbFooterCell]',
    host: {
        class: 'nb-footer-cell',
        role: 'gridcell'
    }
})
export class NbFooterCellDirective extends CdkFooterCell {
    constructor() {
        super()
        const columnDef = inject(NbColumnDefDirective)
        const elementRef = inject(ElementRef)
        elementRef.nativeElement.classList.add(`nb-column-${columnDef.cssClassFriendlyName}`)
    }
}

/** A data cell, with the `nb-cell` and `nb-column-<name>` classes and the `gridcell` role. */
@Directive({
    selector: 'nb-cell, td[nbCell]',
    host: {
        class: 'nb-cell',
        role: 'gridcell'
    }
})
export class NbCellDirective extends CdkCell {
    constructor() {
        super()
        const columnDef = inject(NbColumnDefDirective)
        const elementRef = inject(ElementRef)
        elementRef.nativeElement.classList.add(`nb-column-${columnDef.cssClassFriendlyName}`)
    }
}
