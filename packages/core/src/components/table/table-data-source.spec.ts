import { ApplicationRef, computed, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Observable, of, Subject } from 'rxjs'

import { NbSortDirection, nbTableDataSource, NbTablePage, NbTableQuery } from '@liquid-js/lyr-core'

interface User {
    id: number
    name: string
    age: number | null
}

const users: User[] = [
    { id: 1, name: 'Jane Doe', age: 34 },
    { id: 2, name: 'John Smith', age: null },
    { id: 3, name: 'alex Johnson', age: 28 },
    { id: 4, name: 'Sam Taylor', age: 41 },
    { id: 5, name: 'Chris Brown', age: 28 }
]

const create = <T>(factory: () => T) => TestBed.runInInjectionContext(factory)
/** Lets effects and observables of signals run. */
const settle = async () => {
    TestBed.inject(ApplicationRef).tick()
    await new Promise((resolve) => setTimeout(resolve))
}

describe('nbTableDataSource with rows in the browser', () => {
    it('should page the rows, and show the last page past the end', () => {
        const data = signal(users)
        const source = create(() => nbTableDataSource({ data, pageSize: 2 }))
        expect(source.rows().map((user) => user.id)).toEqual([1, 2])
        expect(source.total()).toBe(5)
        source.page.set(2)
        expect(source.rows().map((user) => user.id)).toEqual([5])
        data.set(users.slice(0, 3))
        expect(source.rows().map((user) => user.id)).toEqual([3])
    })

    it('should sort text in the user\'s order and numbers by value, with empty values last either way', () => {
        const source = create(() => nbTableDataSource({ data: users, pageSize: 10 }))
        source.sort.set({ column: 'name', direction: 'asc' })
        expect(source.rows().map((user) => user.name)).toEqual([
            'alex Johnson',
            'Chris Brown',
            'Jane Doe',
            'John Smith',
            'Sam Taylor'
        ])
        source.sort.set({ column: 'age', direction: 'desc' })
        // Equal values keep their order.
        expect(source.rows().map((user) => user.id)).toEqual([4, 1, 3, 5, 2])
        source.sort.set({ column: 'age', direction: 'asc' })
        expect(source.rows().map((user) => user.id)).toEqual([3, 5, 1, 4, 2])
    })

    it('should filter by text it includes, or by equal values, and go back to the first page', () => {
        const source = create(() => nbTableDataSource({ data: users, pageSize: 2 }))
        source.page.set(1)
        source.setFilter('name', 'JO')
        expect(source.page()).toBe(0)
        expect(source.rows().map((user) => user.id)).toEqual([2, 3])
        source.filters.set({ age: 28 })
        expect(source.total()).toBe(2)
        // Empty filters filter nothing.
        source.filters.set({ name: '', age: null })
        expect(source.total()).toBe(5)
    })

    it('should start in the order it\'s given', () => {
        const source = TestBed.runInInjectionContext(() =>
            nbTableDataSource({ data: [{ name: 'Bea' }, { name: 'Al' }], sort: { column: 'name', direction: 'asc' } })
        )
        expect(source.sort()).toEqual({ column: 'name', direction: 'asc' })
    })

    it('should take sort requests from sort headers, and tell each column its direction', () => {
        const source = create(() => nbTableDataSource({ data: users }))
        source.page.set(1)
        source.sortBy({ column: 'name', direction: NbSortDirection.DESCENDING })
        expect(source.sort()).toEqual({ column: 'name', direction: 'desc' })
        expect(source.page()).toBe(0)
        expect(source.sortDirection('name')).toBe(NbSortDirection.DESCENDING)
        expect(source.sortDirection('age')).toBe(NbSortDirection.NONE)
        source.sortBy({ column: 'name', direction: NbSortDirection.NONE })
        expect(source.sort()).toBeUndefined()
    })

    it('should select rows of the page, all of them, and clear them on another page', () => {
        const source = create(() => nbTableDataSource({ data: users, pageSize: 2, rowId: (user) => user.id }))
        source.select(users[1])
        expect(source.isSelected({ ...users[1] })).toBe(true)
        expect(source.someSelected()).toBe(true)
        source.selectAll()
        expect(source.selection().map((user) => user.id)).toEqual([1, 2])
        expect(source.allSelected()).toBe(true)
        source.selectAll()
        expect(source.selection()).toEqual([])
        source.select(users[0])
        source.page.set(1)
        expect(source.selection()).toEqual([])
    })

    it('should expand rows of the page, and collapse them on another order', () => {
        const source = create(() => nbTableDataSource({ data: users, rowId: (user) => user.id }))
        source.expand(users[0])
        expect(source.isExpanded(users[0])).toBe(true)
        expect(source.expanded()).toEqual([users[0]])
        source.sort.set({ column: 'age', direction: 'asc' })
        expect(source.expanded()).toEqual([])
    })
})

describe('nbTableDataSource with rows from a server', () => {
    it('should load a page for the query with its params, and go back to the first page for new params', async () => {
        const queries = new Array<NbTableQuery<{ customer: string }>>()
        const customer = signal('acme')
        const source = create(() =>
            nbTableDataSource({
                load: (query: NbTableQuery<{ customer: string }>) => {
                    queries.push(query)
                    return of({ rows: users.slice(query.page * 2, query.page * 2 + 2), total: 5 })
                },
                params: computed(() => ({ customer: customer() })),
                pageSize: 2
            })
        )
        await settle()
        expect(queries.at(-1)).toEqual({ page: 0, pageSize: 2, sort: undefined, filters: {}, params: { customer: 'acme' } })
        expect(source.rows().map((user) => user.id)).toEqual([1, 2])
        expect(source.total()).toBe(5)

        source.page.set(2)
        await settle()
        expect(queries.at(-1)?.page).toBe(2)
        expect(source.rows().map((user) => user.id)).toEqual([5])

        customer.set('globex')
        await settle()
        expect(queries.at(-1)).toEqual(expect.objectContaining({ page: 0, params: { customer: 'globex' } }))
    })

    it('should be loading until the page comes, drop an earlier load, and keep the error of a failed one', async () => {
        const pending = new Array<Subject<NbTablePage<User>>>()
        const source = create(() =>
            nbTableDataSource({
                load: (): Observable<NbTablePage<User>> => {
                    const page = new Subject<NbTablePage<User>>()
                    pending.push(page)
                    return page
                }
            })
        )
        await settle()
        expect(source.loading()).toBe(true)

        source.setFilter('name', 'Jo')
        await settle()
        // The first load's late answer doesn't show.
        pending[0].next({ rows: users, total: 5 })
        expect(source.rows()).toEqual([])
        pending[1].next({ rows: users.slice(1, 3), total: 2 })
        expect(source.loading()).toBe(false)
        expect(source.rows().map((user) => user.id)).toEqual([2, 3])

        source.reload()
        await settle()
        pending[2].error(new Error('Offline'))
        expect(source.loading()).toBe(false)
        expect(source.error()).toEqual(new Error('Offline'))
        // The rows stay.
        expect(source.total()).toBe(2)
    })
})
