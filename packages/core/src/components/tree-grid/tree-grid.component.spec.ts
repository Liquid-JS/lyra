import { Component, Type, viewChild, viewChildren } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  NbThemeModule,
  NbTreeGridComponent,
  NbTreeGridDataSource,
  NbTreeGridModule,
  NbTreeGridRowComponent,
  NB_ROW_DOUBLE_CLICK_DELAY,
  NbTreeGridDataSourceBuilder,
  NbTreeGridPresentationNode,
  NbGetters,
  NB_WINDOW,
} from '@liquid-js/lyr-core';

interface TreeNode<T> {
  data: T;
  expanded?: boolean;
  children?: TreeNode<T>[];
}

interface CustomStructure {
  a: string;
  b: string;
  c: string;
  childNodes?: CustomStructure[];
  expanded?: boolean;
}

@Component({
  template: '',
})
class BaseTreeGridTestComponent {
  columns = new Array<string>();
  dataSource?: NbTreeGridDataSource<any>;

  readonly treeGridComponent = viewChild.required(NbTreeGridComponent);
  readonly rowComponents = viewChildren(NbTreeGridRowComponent);
}

@Component({
  template: `
    <table [nbTreeGrid]="dataSource">
      <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: columns"></tr>

      @for (column of columns; track column) {
        <ng-container [nbTreeGridColumnDef]="column">
          <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>{{ column }}</th>
          <td nbTreeGridCell *nbTreeGridCellDef="let row">{{ row.data[column] }}</td>
        </ng-container>
      }
    </table>
  `,
  imports: [NbTreeGridModule],
})
export class TreeGridBasicTestComponent extends BaseTreeGridTestComponent {}

@Component({
  template: `
    <table [nbTreeGrid]="dataSource">
      <tr nbTreeGridHeaderRow *nbTreeGridHeaderRowDef="columns"></tr>
      <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: columns"></tr>

      @for (column of columns; track column) {
        <ng-container [nbTreeGridColumnDef]="column">
          <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>{{ column }}</th>
          <td nbTreeGridCell *nbTreeGridCellDef="let row">{{ row.data[column] }}</td>
        </ng-container>
      }
    </table>
  `,
  imports: [NbTreeGridModule],
})
export class TreeGridWithHeaderTestComponent extends BaseTreeGridTestComponent {}

function setupFixture(componentType: Type<any>, columns: string[], data?: TreeNode<any>[]): ComponentFixture<any> {
  TestBed.configureTestingModule({
    imports: [NbThemeModule.forRoot(), NbTreeGridModule, componentType],
  });

  const fixture = TestBed.createComponent(componentType);
  fixture.componentInstance.columns = columns;
  if (data) {
    fixture.componentInstance.dataSource = data;
  }

  fixture.detectChanges();
  return fixture;
}

const abcColumns: string[] = ['a', 'b', 'c'];
const twoRowsData: TreeNode<any>[] = [{ data: { a: 'a1', b: 'b1', c: 'c1' } }, { data: { a: 'a2', b: 'b2', c: 'c2' } }];
const nestedRowData: TreeNode<any>[] = [
  {
    data: { a: 'a1', b: 'b1', c: 'c1' },
    children: [{ data: { a: 'a2', b: 'b2', c: 'c2' } }],
  },
];
const nestedExpandedRowData: TreeNode<any>[] = [
  {
    data: { a: 'a1', b: 'b1', c: 'c1' },
    expanded: true,
    children: [{ data: { a: 'a2', b: 'b2', c: 'c2' } }],
  },
];
const customStructureChild: CustomStructure = { a: 'a2', b: 'b2', c: 'c2' };
const customStructureData: CustomStructure[] = [
  {
    a: 'a1',
    b: 'b1',
    c: 'c1',
    expanded: true,
    childNodes: [customStructureChild],
  },
];

describe('NbTreeGridComponent', () => {
  it('should convert plain data to NbTreeGridDataSource', () => {
    const fixture: ComponentFixture<TreeGridBasicTestComponent> = setupFixture(
      TreeGridBasicTestComponent,
      abcColumns,
      twoRowsData,
    );
    expect(fixture.componentInstance.treeGridComponent().dataSource instanceof NbTreeGridDataSource).toEqual(true);
  });

  it('should render rows', () => {
    const fixture: ComponentFixture<TreeGridBasicTestComponent> = setupFixture(
      TreeGridBasicTestComponent,
      abcColumns,
      twoRowsData,
    );
    const rows: HTMLElement[] = fixture.nativeElement.querySelectorAll('.nb-tree-grid .nb-tree-grid-row');
    expect(rows.length).toEqual(twoRowsData.length);
  });

  it('should render data in row', () => {
    const fixture: ComponentFixture<TreeGridBasicTestComponent> = setupFixture(
      TreeGridBasicTestComponent,
      abcColumns,
      twoRowsData,
    );
    const rows: HTMLElement[] = fixture.nativeElement.querySelectorAll('.nb-tree-grid-row');

    rows.forEach((row: HTMLElement, rowIndex: number) => {
      const dataCell = row.querySelectorAll<HTMLElement>('.nb-tree-grid-cell');

      dataCell.forEach((cell: HTMLElement, cellIndex: number) => {
        expect(cell.innerText).toEqual(twoRowsData[rowIndex].data[abcColumns[cellIndex]]);
      });
    });
  });

  it('should render header row if provided', () => {
    const fixture: ComponentFixture<TreeGridWithHeaderTestComponent> = setupFixture(
      TreeGridWithHeaderTestComponent,
      abcColumns,
      twoRowsData,
    );
    const headerRow: HTMLElement = fixture.nativeElement.querySelector('.nb-tree-grid-header-row');
    expect(headerRow).not.toBeNull();

    const headerCells = headerRow.querySelectorAll<HTMLElement>('.nb-tree-grid-header-cell');
    expect(headerCells.length).toEqual(abcColumns.length);

    headerCells.forEach((cell: HTMLElement, cellIndex: number) => {
      expect(cell.innerText).toEqual(abcColumns[cellIndex]);
    });
  });

  it('should render column text in header cell', () => {
    const fixture: ComponentFixture<TreeGridWithHeaderTestComponent> = setupFixture(
      TreeGridWithHeaderTestComponent,
      abcColumns,
      twoRowsData,
    );
    const headerRow: HTMLElement = fixture.nativeElement.querySelector('.nb-tree-grid-header-row');
    const headerCells = headerRow.querySelectorAll<HTMLElement>('.nb-tree-grid-header-cell');

    headerCells.forEach((cell: HTMLElement, cellIndex: number) => {
      expect(cell.innerText).toEqual(abcColumns[cellIndex]);
    });
  });

  it('should not render collapsed rows', () => {
    const fixture: ComponentFixture<TreeGridWithHeaderTestComponent> = setupFixture(
      TreeGridBasicTestComponent,
      abcColumns,
      nestedRowData,
    );
    const rows = fixture.nativeElement.querySelectorAll('.nb-tree-grid-row');
    expect(rows.length).toEqual(1);
  });

  it('should render initially expanded row', () => {
    const fixture: ComponentFixture<TreeGridWithHeaderTestComponent> = setupFixture(
      TreeGridBasicTestComponent,
      abcColumns,
      nestedExpandedRowData,
    );
    const rows = fixture.nativeElement.querySelectorAll('.nb-tree-grid-row');
    expect(rows.length).toEqual(2);
  });

  it('should remove collapsed rows', async () => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<TreeGridWithHeaderTestComponent> = setupFixture(
      TreeGridBasicTestComponent,
      abcColumns,
      nestedExpandedRowData,
    );
    const row: HTMLElement = fixture.nativeElement.querySelector('.nb-tree-grid-row');
    row.click();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(NB_ROW_DOUBLE_CLICK_DELAY);
    const rows = fixture.nativeElement.querySelectorAll('.nb-tree-grid-row');
    expect(rows.length).toEqual(1);
  });

  it('should add expanded row children', async () => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<TreeGridWithHeaderTestComponent> = setupFixture(
      TreeGridBasicTestComponent,
      abcColumns,
      nestedRowData,
    );
    const row: HTMLElement = fixture.nativeElement.querySelector('.nb-tree-grid-row');
    row.click();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(NB_ROW_DOUBLE_CLICK_DELAY);
    const rows = fixture.nativeElement.querySelectorAll('.nb-tree-grid-row');
    expect(rows.length).toEqual(2);
  });

  describe('NbTreeGridDataSourceBuilder custom node getters', () => {
    const mockConnectionViewer = { viewChange: EMPTY };
    const getters: NbGetters<CustomStructure, CustomStructure> = {
      dataGetter: (node) => node,
      childrenGetter: (node) => node.childNodes,
      expandedGetter: (node) => !!node.expanded,
    };
    let dataSourceBuilder: NbTreeGridDataSourceBuilder<CustomStructure>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NbThemeModule.forRoot(), NbTreeGridModule],
      });
    });
    beforeEach(inject([NbTreeGridDataSourceBuilder], (builder: NbTreeGridDataSourceBuilder<CustomStructure>) => {
      dataSourceBuilder = builder;
    }));

    it('should use custom data accessor if provided', async () => {
      vi.useFakeTimers();
      const dataGetterSpy = vi.fn(getters.dataGetter);
      const spyGetters = { ...getters, dataGetter: dataGetterSpy };

      const dataSource = dataSourceBuilder.create(customStructureData, spyGetters);
      expect(dataGetterSpy).toHaveBeenCalledTimes(2);

      let presentationNodes = new Array<NbTreeGridPresentationNode<CustomStructure>>();
      dataSource
        .connect(mockConnectionViewer)
        .pipe(take(1))
        .subscribe((nodes) => (presentationNodes = nodes as NbTreeGridPresentationNode<CustomStructure>[]));
      await vi.advanceTimersByTimeAsync(0);

      expect(presentationNodes[0].data).toEqual(customStructureData[0]);
      expect(presentationNodes[1].data).toEqual(customStructureChild);
    });

    it('should use custom children accessor if provided', async () => {
      vi.useFakeTimers();
      const childrenGetterSpy = vi.fn(getters.childrenGetter);
      const spyGetters = { ...getters, childrenGetter: childrenGetterSpy };

      const dataSource = dataSourceBuilder.create(customStructureData, spyGetters);
      expect(childrenGetterSpy).toHaveBeenCalledTimes(2);

      let presentationNodes = new Array<NbTreeGridPresentationNode<CustomStructure>>();
      dataSource
        .connect(mockConnectionViewer)
        .pipe(take(1))
        .subscribe((nodes) => (presentationNodes = nodes as NbTreeGridPresentationNode<CustomStructure>[]));
      await vi.advanceTimersByTimeAsync(0);

      expect(presentationNodes[0].data.childNodes?.[0]).toEqual(customStructureChild);
    });

    it('should use custom expanded accessor if provided', async () => {
      vi.useFakeTimers();
      const expandedGetterSpy = vi.fn(getters.expandedGetter);
      const spyGetters = { ...getters, expandedGetter: expandedGetterSpy };

      const dataSource = dataSourceBuilder.create(customStructureData, spyGetters);
      expect(expandedGetterSpy).toHaveBeenCalledTimes(2);

      let presentationNodes = new Array<NbTreeGridPresentationNode<CustomStructure>>();
      dataSource
        .connect(mockConnectionViewer)
        .pipe(take(1))
        .subscribe((nodes) => (presentationNodes = nodes as NbTreeGridPresentationNode<CustomStructure>[]));
      await vi.advanceTimersByTimeAsync(0);

      expect(presentationNodes[0].expanded).toEqual(true);
    });
  });
});

@Component({
  template: `
    <table [nbTreeGrid]="data">
      <tr nbTreeGridHeaderRow *nbTreeGridHeaderRowDef="columns"></tr>
      <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: columns"></tr>

      <ng-container nbTreeGridColumnDef="a">
        <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>a</th>
        <td nbTreeGridCell *nbTreeGridCellDef="let row">{{ row.data.a }}</td>
      </ng-container>
      <ng-container nbTreeGridColumnDef="b" [hideOn]="600">
        <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>b</th>
        <td nbTreeGridCell *nbTreeGridCellDef="let row">{{ row.data.b }}</td>
      </ng-container>
      <ng-container nbTreeGridColumnDef="c" [showOn]="1200">
        <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>c</th>
        <td nbTreeGridCell *nbTreeGridCellDef="let row">{{ row.data.c }}</td>
      </ng-container>
    </table>
  `,
  imports: [NbTreeGridModule],
})
class TreeGridResponsiveTestComponent {
  readonly columns = ['a', 'b', 'c'];
  readonly data = [{ data: { a: 'a1', b: 'b1', c: 'c1' } }];
}

describe('NbTreeGridComponent responsive columns', () => {
  let width: number;

  const render = () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), TreeGridResponsiveTestComponent],
      providers: [
        {
          provide: NB_WINDOW,
          // The real window, with the width the test sets.
          useFactory: () => new Proxy(window, {
            get: (target, key) => {
              if (key === 'innerWidth') {
                return width;
              }
              const value = Reflect.get(target, key);
              return typeof value === 'function' ? value.bind(target) : value;
            },
          }),
        },
      ],
    });
    const fixture = TestBed.createComponent(TreeGridResponsiveTestComponent);
    fixture.detectChanges();
    return fixture;
  };
  const headers = (fixture: ComponentFixture<TreeGridResponsiveTestComponent>) => Array.from(fixture.nativeElement.querySelectorAll('th'), (th: Element) => th.textContent.trim());
  const cells = (fixture: ComponentFixture<TreeGridResponsiveTestComponent>) => fixture.nativeElement.querySelector('tr[nbTreeGridRow]').querySelectorAll('td').length;

  it('should render only the columns that fit the window', () => {
    width = 500;
    const fixture = render();
    expect(headers(fixture)).toEqual(['a']);
    expect(cells(fixture)).toBe(1);
  });

  it('should show columns again when the window grows', async () => {
    vi.useFakeTimers();
    width = 500;
    const fixture = render();

    width = 1280;
    window.dispatchEvent(new Event('resize'));
    await vi.advanceTimersByTimeAsync(50);
    fixture.detectChanges();

    expect(headers(fixture)).toEqual(['a', 'b', 'c']);
    expect(cells(fixture)).toBe(3);
  });
});
