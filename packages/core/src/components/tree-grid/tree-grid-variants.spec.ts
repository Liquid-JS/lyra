import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
    NB_WINDOW,
    NbCardModule,
    NbThemeModule,
    NbTreeGridDataSource,
    NbTreeGridDataSourceBuilder,
    NbTreeGridModule
} from '@liquid-js/lyr-core'

interface Entry {
    a: string
    b: string
    c: string
}

const entries = [{ data: { a: 'a1', b: 'b1', c: 'c1' } }, { data: { a: 'a2', b: 'b2', c: 'c2' } }]

// The columns' cells, and a no-data row; `b` hides on a narrow window.
const columns = `
  <tr nbTreeGridHeaderRow *nbTreeGridHeaderRowDef="columns"></tr>
  <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: columns"></tr>
  <tr *nbTreeGridNoDataRowDef>
    <td nbTreeGridNoDataCell>Nothing here</td>
  </tr>
  <ng-container nbTreeGridColumnDef="a">
    <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>a</th>
    <td nbTreeGridCell *nbTreeGridCellDef="let row">{{ row.data.a }}</td>
  </ng-container>
  <ng-container nbTreeGridColumnDef="b" [hideOn]="600">
    <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>b</th>
    <td nbTreeGridCell *nbTreeGridCellDef="let row">{{ row.data.b }}</td>
  </ng-container>
  <ng-container nbTreeGridColumnDef="c">
    <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>c</th>
    <td nbTreeGridCell *nbTreeGridCellDef="let row">{{ row.data.c }}</td>
  </ng-container>
`

// The theme applies in an element with its class.
const template = `
  <div class="nb-theme-default" dir="ltr">
    <table class="plain" [nbTreeGrid]="source" [compact]="compact()" [striped]="striped()">${columns}</table>
    <nb-card>
      <nb-card-header>Card</nb-card-header>
      <table class="in-card" [nbTreeGrid]="data()">${columns}</table>
    </nb-card>
  </div>
`

@Component({
    template,
    styleUrl: './tree-grid-variants.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbTreeGridModule, NbCardModule]
})
class TreeGridVariantsHostComponent {
    readonly columns = ['a', 'b', 'c']
    readonly data = signal(entries)
    readonly source: NbTreeGridDataSource<Entry> = TestBed.inject(NbTreeGridDataSourceBuilder<Entry>).create(entries)
    readonly compact = signal(false)
    readonly striped = signal(false)
}

describe('NbTreeGridComponent no-data row and variants', () => {
    let fixture: ComponentFixture<TreeGridVariantsHostComponent>
    let host: TreeGridVariantsHostComponent
    let width: number

    const grid = (name: string) => fixture.nativeElement.querySelector(`table.${name}`) as HTMLTableElement
    const noDataCell = (name: string) => grid(name).querySelector('td[nbTreeGridNoDataCell]') as HTMLTableCellElement | null
    const style = (element: Element) => getComputedStyle(element)
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }

    beforeEach(async () => {
        width = 1280
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [
                {
                    provide: NB_WINDOW,
                    // The real window, with the width the test sets.
                    useFactory: () => new Proxy(window, {
                        get: (target, key) => {
                            if (key === 'innerWidth') {
                                return width
                            }
                            const value = Reflect.get(target, key)
                            return typeof value === 'function' ? value.bind(target) : value
                        }
                    })
                }
            ]
        })
        fixture = TestBed.createComponent(TreeGridVariantsHostComponent)
        host = fixture.componentInstance
        await render()
    })

    describe('no-data row', () => {
        it('should not show while there are rows', () => {
            expect(noDataCell('in-card')).toBeNull()
        })

        it('should show without data, across the columns, in a row of the grid', async () => {
            host.data.set([])
            await render()
            const cell = noDataCell('in-card')

            expect(cell?.textContent?.trim()).toBe('Nothing here')
            expect(cell?.colSpan).toBe(3)
            expect(cell?.classList).toContain('nb-tree-grid-no-data-cell')
            expect(cell?.parentElement?.classList).toContain('nb-tree-grid-row')
            expect(cell?.parentElement?.getAttribute('role')).toBe('row')
            expect(style(cell as Element).textAlign).toBe('center')
        })

        it('should show when a filter matches no rows, and go when one does', async () => {
            host.source.filter('nothing')
            await render()
            expect(noDataCell('plain')).not.toBeNull()

            host.source.filter('a2')
            await render()
            expect(noDataCell('plain')).toBeNull()
            expect(grid('plain').querySelectorAll('tr[nbTreeGridRow]').length).toBe(1)
        })

        it('should span only the columns that fit the window', async () => {
            vi.useFakeTimers()
            host.data.set([])
            width = 500
            window.dispatchEvent(new Event('resize'))
            await vi.advanceTimersByTimeAsync(50)
            fixture.detectChanges()
            vi.useRealTimers()

            expect(noDataCell('in-card')?.colSpan).toBe(2)
        })
    })

    describe('variants', () => {
        const cell = (name: string, selector = 'td') => grid(name).querySelector(selector) as HTMLElement

        it('should take less padding when compact', async () => {
            // tree-grid-cell-padding, then tree-grid-compact-cell-padding.
            expect(style(cell('plain')).paddingTop).toBe('14px')

            host.compact.set(true)
            await render()

            expect(style(cell('plain')).paddingTop).toBe('6px')
            expect(style(cell('plain', 'th')).paddingTop).toBe('6px')
        })

        it('should give every other row a background when striped', async () => {
            const rows = () => Array.from(grid('plain').querySelectorAll('tr[nbTreeGridRow]'), (row) => style(row).backgroundColor)
            const [odd, even] = rows()
            expect(even).toBe(odd)

            host.striped.set(true)
            await render()

            expect(rows()[1]).not.toBe(rows()[0])
        })

        it('should leave its border to the card, and line up with the card header', () => {
            const card = fixture.nativeElement.querySelector('nb-card-header') as HTMLElement
            const first = cell('in-card', 'th')
            const last = grid('in-card').querySelector('tr[nbTreeGridRow] td:last-child') as HTMLElement

            expect(style(first).borderTopStyle).toBe('none')
            expect(style(first).borderLeftStyle).toBe('none')
            expect(style(last).borderRightStyle).toBe('none')
            expect(style(last).borderTopStyle).toBe('solid')
            expect(style(first).paddingLeft).toBe(style(card).paddingLeft)
            expect(style(last).paddingRight).toBe(style(card).paddingRight)
            // On its own, a grid keeps its lines, and its text starts as a list's items do.
            const plain = cell('plain')
            expect(style(plain).borderLeftStyle).toBe('solid')
            expect(style(plain).borderTopStyle).toBe('solid')
            const probe = document.createElement('div')
            probe.style.paddingLeft = 'var(--list-item-padding-inline)'
            plain.append(probe)
            expect(style(plain).paddingLeft).toBe(style(probe).paddingLeft)
            probe.remove()
        })
    })
})

@Component({
    template: `
    <div [attr.dir]="dir()">
      <table [nbTreeGrid]="data">
        <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: ['a']"></tr>
        <ng-container nbTreeGridColumnDef="a">
          <td nbTreeGridCell *nbTreeGridCellDef="let row">
            <nb-tree-grid-row-toggle [expanded]="row.expanded" />
            {{ row.data.a }}
          </td>
        </ng-container>
      </table>
    </div>
  `,
    imports: [NbTreeGridModule]
})
class TreeGridToggleHostComponent {
    readonly dir = signal('ltr')
    readonly data = [{ data: { a: 'parent' }, children: [{ data: { a: 'child' } }] }]
}

describe('NbTreeGridRowToggleComponent', () => {
    it("should point a collapsed row's arrow to the row's end in RTL", async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        const fixture = TestBed.createComponent(TreeGridToggleHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
        const transform = () => getComputedStyle(fixture.nativeElement.querySelector('nb-tree-grid-row-toggle nb-icon')).transform

        // A quarter turn anticlockwise points the chevron right, the end of a row read left to right.
        expect(transform()).toBe('matrix(0, -1, 1, 0, 0, 0)');

        // The turn is a transition, which a computed style would catch at its start.
        (fixture.nativeElement.querySelector('nb-tree-grid-row-toggle nb-icon') as HTMLElement).style.transition = 'none'
        fixture.componentInstance.dir.set('rtl')
        fixture.detectChanges()

        expect(transform()).toBe('matrix(0, 1, -1, 0, 0, 0)')
    })
})
