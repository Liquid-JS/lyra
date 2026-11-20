import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbDataTableModule, NbPaginationComponent, nbTableDataSource, NbThemeModule } from '@liquid-js/lyr-core'

interface User {
    id: number
    name: string
    email: string
}

const users: User[] = ['Jane Doe', 'John Smith', 'Alex Johnson', 'Sam Taylor', 'Chris Brown'].map((name, index) => ({
    id: index + 1,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`
}))

@Component({
    template: `
    <table nbTable [dataSource]="source" [nbSort]="source">
      <nb-select-column />
      <ng-container nbColumnDef="name">
        <th nbHeaderCell *nbHeaderCellDef nbSortHeader>Name</th>
        <td nbCell *nbCellDef="let user; of: source">{{ user.name }}</td>
      </ng-container>
      <ng-container nbColumnDef="details">
        <th nbHeaderCell *nbHeaderCellDef>Details</th>
        <td nbCell *nbCellDef="let user; of: source">
          <button type="button" class="toggle" [nbExpandRow]="user">Details</button>
        </td>
      </ng-container>
      <tr nbHeaderRow *nbHeaderRowDef="columns"></tr>
      <tr nbRow *nbRowDef="let user; of: source; columns: columns"></tr>
      <tr nbDetailRow *nbDetailRowDef="let user; of: source">{{ user.email }}</tr>
      <tr *nbNoDataRow><td nbNoDataCell>No users</td></tr>
    </table>
    <nb-pagination [for]="source" />
  `,
    imports: [NbDataTableModule, NbPaginationComponent]
})
class TableHostComponent {
    readonly data = signal(users)
    readonly columns = ['select', 'name', 'details']
    readonly source = nbTableDataSource({ data: this.data, pageSize: 2, rowId: (user) => user.id })
}

describe('nbTable', () => {
    let fixture: ComponentFixture<TableHostComponent>
    let host: TableHostComponent

    const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement
    const all = (selector: string) => [...fixture.nativeElement.querySelectorAll(selector)] as HTMLElement[]
    const names = () => all('tr.nb-row:not(.nb-detail-row) td.nb-column-name').map((cell) => cell.textContent?.trim())
    const checkbox = (cell: HTMLElement) => cell.querySelector('input[type="checkbox"]') as HTMLInputElement
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), TableHostComponent] })
        fixture = TestBed.createComponent(TableHostComponent)
        host = fixture.componentInstance
        document.body.appendChild(fixture.nativeElement)
        await render()
    })

    afterEach(() => fixture.destroy())

    it('should show a page of rows, sorted by a header, and page with the pagination', async () => {
        expect(names()).toEqual(['Jane Doe', 'John Smith']);
        (element('th.nb-column-name button') as HTMLButtonElement).click()
        await render()
        expect(names()).toEqual(['Alex Johnson', 'Chris Brown'])
        expect(element('th.nb-column-name').getAttribute('aria-sort')).toBe('ascending');

        (element('nb-pagination button[aria-label="Next page"]') as HTMLButtonElement).click()
        await render()
        expect(host.source.page()).toBe(1)
        expect(names()).toEqual(['Jane Doe', 'John Smith'])
        expect(element('nb-pagination').textContent).toContain('3–4 of 5');

        // Sorting again goes back to the first page, and the header follows.
        (element('th.nb-column-name button') as HTMLButtonElement).click()
        await render()
        expect(host.source.page()).toBe(0)
        expect(names()).toEqual(['Sam Taylor', 'John Smith'])
        expect(element('th.nb-column-name').getAttribute('aria-sort')).toBe('descending')
    })

    it('should select rows with their checkboxes, and all of the page with the header\'s', async () => {
        const [headerCell] = all('th.nb-select-cell')
        const rowCells = all('td.nb-select-cell')
        expect(headerCell.textContent).toContain('Select all rows')
        expect(rowCells[0].textContent).toContain('Select row')

        checkbox(rowCells[1]).click()
        await render()
        expect(host.source.selection()).toEqual([users[1]])
        expect(checkbox(headerCell).indeterminate).toBe(true)

        checkbox(headerCell).click()
        await render()
        expect(host.source.selection()).toEqual([users[0], users[1]])
        expect(all('td.nb-select-cell').every((cell) => checkbox(cell).checked)).toBe(true)
    })

    it('should show a row\'s details under it while it\'s expanded, across the columns', async () => {
        const toggle = all('button.toggle')[1]
        expect(toggle.getAttribute('aria-expanded')).toBe('false')
        expect(all('.nb-detail-row')).toEqual([])

        toggle.click()
        await render()
        expect(toggle.getAttribute('aria-expanded')).toBe('true')
        const detail = element('.nb-detail-row')
        expect(detail.previousElementSibling?.textContent).toContain('John Smith')
        expect(detail.textContent?.trim()).toBe('john.smith@example.com')
        expect(element('.nb-detail-cell').getAttribute('colspan')).toBe('3')

        toggle.click()
        await render()
        expect(all('.nb-detail-row')).toEqual([])
    })

    it('should show the no-data row across the columns without rows', async () => {
        host.data.set([])
        await render()
        const cell = element('.nb-no-data-cell')
        expect(cell.textContent).toBe('No users')
        expect(cell.getAttribute('colspan')).toBe('3')
    })
})
