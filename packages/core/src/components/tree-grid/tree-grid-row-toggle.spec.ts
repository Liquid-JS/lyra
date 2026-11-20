import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbThemeModule, NbTreeGridModule } from '@liquid-js/lyr-core'

interface Entry {
    name: string
}

@Component({
    template: `
    <table [nbTreeGrid]="rows">
      <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: ['name']" [clickToToggle]="false"></tr>
      <ng-container nbTreeGridColumnDef="name">
        <td nbTreeGridCell *nbTreeGridCellDef="let row">
          <button nbTreeGridRowToggle [tabindex]="tabindex()">Toggle</button>
          {{ row.data.name }}
        </td>
      </ng-container>
    </table>
  `,
    imports: [NbTreeGridModule]
})
class RowToggleHostComponent {
    readonly rows = [{ data: { name: 'Projects' } as Entry, children: [{ data: { name: 'Report' } as Entry }] }]
    readonly tabindex = signal<number | string>(0)
}

describe('NbTreeGridRowToggleDirective', () => {
    it('should be in the Tab order, which Safari leaves a button out of without a tabindex, and toggle its row', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        const fixture = TestBed.createComponent(RowToggleHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
        const toggle = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement
        expect(toggle.getAttribute('tabindex')).toBe('0')

        toggle.click()
        fixture.detectChanges()
        await fixture.whenStable()
        expect(fixture.nativeElement.querySelectorAll('tr[nbTreeGridRow]').length).toBe(2)

        // A tabindex of the app's own is kept.
        fixture.componentInstance.tabindex.set(-1)
        fixture.detectChanges()
        const toggles = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'))
        expect(toggles.map((button) => button.getAttribute('tabindex'))).toEqual(['-1', '-1'])
    })
})
