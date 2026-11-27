import { Component, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbDataTableModule, nbTableDataSource, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <div class="nb-theme-default">
      @for (rules of ['all', 'rows']; track rules) {
        <table nbTable [rules]="$any(rules)" [attr.data-rules]="rules" [dataSource]="source">
          <ng-container nbColumnDef="title">
            <th nbHeaderCell *nbHeaderCellDef>Title</th>
            <td nbCell *nbCellDef="let track; of: source">{{ track.title }}</td>
          </ng-container>
          <ng-container nbColumnDef="time">
            <th nbHeaderCell *nbHeaderCellDef>Time</th>
            <td nbCell *nbCellDef="let track; of: source">{{ track.time }}</td>
          </ng-container>
          <tr nbHeaderRow *nbHeaderRowDef="columns"></tr>
          <tr nbRow *nbRowDef="let track; of: source; columns: columns"></tr>
        </table>
      }
    </div>
  `,
    styleUrl: './table-rules.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbDataTableModule]
})
class TableRulesHostComponent {
    readonly columns = ['title', 'time']
    readonly source = nbTableDataSource({ data: [{ title: 'Opening', time: '0:00' }, { title: 'Second', time: '3:12' }] })
}

describe('nbTable rules', () => {
    it('should draw lines around every cell by default, and only between the rows with rules="rows"', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), TableRulesHostComponent] })
        const fixture = TestBed.createComponent(TableRulesHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()

        const cell = (rules: string) => getComputedStyle(fixture.nativeElement.querySelector(`[data-rules="${rules}"] .nb-cell`))
        expect(cell('all').borderInlineStartWidth).not.toBe('0px')
        expect(cell('all').borderTopWidth).not.toBe('0px')
        expect(cell('rows').borderInlineStartWidth).toBe('0px')
        expect(cell('rows').borderInlineEndWidth).toBe('0px')
        expect(cell('rows').borderTopWidth).not.toBe('0px')
        fixture.destroy()
    })
})
