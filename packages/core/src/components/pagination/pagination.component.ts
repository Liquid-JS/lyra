import {
    Component,
    computed,
    inject,
    input,
    linkedSignal,
    LOCALE_ID,
    model,
    Signal,
    WritableSignal
} from '@angular/core'

import { injectNbDefaults, NbComponentSize, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base'
import { NbButtonComponent } from '@liquid-js/lyr-core/button'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'
import { NbInputDirective } from '@liquid-js/lyr-core/input'
import { NbOptionComponent, NbSelectComponent } from '@liquid-js/lyr-core/select'

/** @internal */
declare const $localize: NbLocalize

let lastPaginationId = 0

/** Something with pages that a `nb-pagination` can move through, such as a table's data source. */
export interface NbPageable {
    /** The page, from 0. */
    readonly page: WritableSignal<number>
    readonly pageSize: WritableSignal<number>
    /** How many items there are on all pages. */
    readonly total: Signal<number>
    /** Whether a page is loading. */
    readonly loading?: Signal<boolean>
}

/**
 * Moves through the pages of a list or table: shows which items are on the page, and goes to the first, previous,
 * next, last, or a typed page.
 *
 * ```html
 * <nb-pagination [length]="total()" [(page)]="page" [(pageSize)]="size" [pageSizeOptions]="[10, 25, 50]" />
 * ```
 *
 * @stacked-example(Showcase, pagination/pagination-showcase.component)
 *
 * `page` counts from 0, as a page indicator's does, and `pageSize` is the number of items on a page; both are
 * models, so bind them both ways or listen to `pageChange` and `pageSizeChange` and load the page. Set `loading`
 * while it loads: the controls ignore changes but keep focus.
 *
 * `for` moves through something with pages instead, such as a table's data source: the pagination reads and sets its
 * page and page size, and shows its total and whether it's loading.
 *
 * ```html
 * <nb-pagination [for]="source" [pageSizeOptions]="[10, 25, 50]" />
 * ```
 *
 * Placed under a tree grid:
 * @stacked-example(Tree grid, pagination/pagination-tree-grid.component)
 * @styles
 *
 * pagination-gap:
 * pagination-text-color:
 * pagination-text-font-family:
 * pagination-text-font-size:
 * pagination-text-font-weight:
 * pagination-text-line-height:
 * pagination-page-input-width:
 * pagination-page-size-width:
 * pagination-loading-opacity:
 */
@Component({
    selector: 'nb-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    imports: [NbButtonComponent, NbIconComponent, NbInputDirective, NbSelectComponent, NbOptionComponent],
    host: {
        'role': 'navigation',
        '[attr.aria-label]': 'texts().label',
        '[attr.aria-busy]': 'busy() || null',
        '[class.loading]': 'busy()'
    }
})
export class NbPaginationComponent {
    // The app's defaults for this type, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('pagination')

    protected readonly texts = injectNbTexts('pagination', () => ({
        label: $localize`:@@nb.pagination.label:Pagination`,
        range: (start, end, length) =>
            $localize`:@@nb.pagination.range:${start}:start:–${end}:end: of ${length}:length:`,
        pageSize: $localize`:@@nb.pagination.pageSize:Items per page`,
        page: $localize`:@@nb.pagination.page:Page`,
        pageCount: (count) => $localize`:@@nb.pagination.pageCount:of ${count}:count:`,
        first: $localize`:@@nb.pagination.first:First page`,
        previous: $localize`:@@nb.pagination.previous:Previous page`,
        next: $localize`:@@nb.pagination.next:Next page`,
        last: $localize`:@@nb.pagination.last:Last page`
    }))
    protected readonly numberFormat = new Intl.NumberFormat(inject(LOCALE_ID))
    protected readonly labelId = `nb-pagination-${lastPaginationId++}`

    /** The page shown, counting from 0; ignored while `for` is set. */
    readonly page = model(0)

    /** How many items a page has; ignored while `for` is set. */
    readonly pageSize = model(10)

    /** How many items there are in all; ignored while `for` is set. */
    readonly length = input(0)

    /** Page sizes to choose from; the select is shown when there are any, with the current size added if it's missing. */
    readonly pageSizeOptions = input(new Array<number>())

    /** Whether to show the buttons for the first and the last page. */
    readonly showFirstLast = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty })

    /** Whether the page is loading: the controls are dimmed and ignore changes, but keep focus. */
    readonly loading = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /** `tiny`, `small`, `medium`, `large` or `giant`; the app's default for pagination, or `small`, when unset. */
    readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' })

    /** The size in use: the input's, the app's default, or 'small'. */

    readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'small')

    /**
     * Whether the last button lines up its icon with the end of the row, as text would, its box reaching past it when
     * hovered (`edge="end"` on a button): for a pagination at the end of a card footer or a page. Turn it off where the
     * pagination sits inside a row, e.g. with more content after it. By default, the app's default for pagination, or on.
     */
    readonly edgeInput = input<boolean | undefined, NbBooleanInput | undefined>(undefined, {
        alias: 'edge',
        transform: (value) => (value === undefined ? undefined : convertToBoolProperty(value))
    })

    /** Whether the last button lines up with the end: the input's, the app's default, or on. */
    readonly edge = linkedSignal<boolean>(() => this.edgeInput() ?? this.nbDefaults().edge ?? true)

    /**
     * What the pagination moves through, such as a table's data source, in place of its own `page`, `pageSize` and
     * `length`; its page and size are set too, so `pageChange` and `pageSizeChange` still fire.
     */
    readonly for = input<NbPageable | undefined>(undefined)

    /** The page shown: the `for`'s, or the pagination's own. */
    protected readonly currentPage = computed(() => this.for()?.page() ?? this.page())
    protected readonly perPage = computed(() => this.for()?.pageSize() ?? this.pageSize())
    protected readonly total = computed(() => this.for()?.total() ?? this.length())
    protected readonly busy = computed(() => !!this.for()?.loading?.() || this.loading())

    readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / Math.max(1, this.perPage()))))
    readonly lastPageIndex = computed(() => this.pageCount() - 1)
    readonly hasPrevious = computed(() => this.currentPage() > 0)
    readonly hasNext = computed(() => this.currentPage() < this.lastPageIndex())

    protected readonly range = computed(() => {
        const length = this.total()
        const start = length ? this.currentPage() * this.perPage() + 1 : 0
        const end = Math.min(length, (this.currentPage() + 1) * this.perPage())
        return this.texts().range(this.format(Math.min(start, length)), this.format(end), this.format(length))
    })

    protected readonly pageCountText = computed(() => this.texts().pageCount(this.format(this.pageCount())))

    // The current size is offered even when it isn't one of the options.
    protected readonly sizes = computed(() => {
        const options = this.pageSizeOptions()
        return options.includes(this.perPage()) ? options : [...options, this.perPage()].sort((a, b) => a - b)
    })

    /** Goes to a page, clamped to the existing ones; does nothing while loading. */
    goTo(page: number) {
        if (this.busy()) {
            return
        }
        const target = Math.min(Math.max(0, page), this.lastPageIndex())
        if (target !== this.currentPage()) {
            this.setPage(target)
        }
    }

    first() {
        this.goTo(0)
    }

    previous() {
        this.goTo(this.currentPage() - 1)
    }

    next() {
        this.goTo(this.currentPage() + 1)
    }

    last() {
        this.goTo(this.lastPageIndex())
    }

    protected onPageInput(element: HTMLInputElement) {
        const page = Number(element.value)
        if (Number.isInteger(page) && page >= 1 && page <= this.pageCount()) {
            this.goTo(page - 1)
        }
        // Shows the page in effect, also when the typed one doesn't exist.
        element.value = String(this.currentPage() + 1)
    }

    protected onPageSize(pageSize: number | null) {
        if (pageSize === null || this.busy() || pageSize === this.perPage()) {
            return
        }
        // Keeps the first item of the page in view.
        const firstItem = this.currentPage() * this.perPage()
        this.setPageSize(pageSize)
        this.setPage(Math.floor(firstItem / pageSize))
    }

    /** Sets the page: the `for`'s, and the pagination's own, which tells `pageChange`. */
    protected setPage(page: number) {
        this.for()?.page.set(page)
        this.page.set(page)
    }

    protected setPageSize(pageSize: number) {
        this.for()?.pageSize.set(pageSize)
        this.pageSize.set(pageSize)
    }

    protected format(value: number) {
        return this.numberFormat.format(value)
    }
}
