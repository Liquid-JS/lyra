import { inject, IterableDiffer, IterableDiffers, Service, signal } from '@angular/core';

@Service({ autoProvided: false })
export class NbColumnsService {
  private readonly differs = inject(IterableDiffers);

  private allColumns = new Array<string>();
  private readonly visibleColumns = signal<string[]>([]);
  private changesDiffer?: IterableDiffer<string>;

  setColumns(columns: Iterable<string>) {
    let changesDiffer = this.changesDiffer;
    if (!changesDiffer) {
      changesDiffer = this.differs.find(columns || []).create<string>();
      this.changesDiffer = changesDiffer;
    }

    if (changesDiffer.diff(columns)) {
      this.allColumns = Array.from(columns || []);
      this.visibleColumns.set(Array.from(columns || []));
    }
  }

  getVisibleColumns(): string[] {
    return this.visibleColumns();
  }

  hideColumn(column: string) {
    const visible = this.visibleColumns();
    if (visible.includes(column)) {
      this.visibleColumns.set(visible.filter((visibleColumn) => visibleColumn !== column));
    }
  }

  showColumn(column: string) {
    const visible = this.visibleColumns();
    if (visible.includes(column)) {
      return;
    }
    const next = [...visible];
    next.splice(this.findInsertIndex(column, visible), 0, column);
    this.visibleColumns.set(next);
  }

  private findInsertIndex(column: string, visibleColumns: string[]): number {
    const initialIndex = this.allColumns.indexOf(column);

    if (initialIndex === 0 || !visibleColumns.length) {
      return 0;
    }
    if (initialIndex === this.allColumns.length - 1) {
      return visibleColumns.length;
    }

    const leftSiblingIndex = initialIndex - 1;
    for (let i = leftSiblingIndex; i >= 0; i--) {
      const leftSibling = this.allColumns[i];
      const index = visibleColumns.indexOf(leftSibling);
      if (index !== -1) {
        return index + 1;
      }
    }

    const rightSiblingIndex = initialIndex + 1;
    for (let i = rightSiblingIndex; i < this.allColumns.length; i++) {
      const rightSibling = this.allColumns[i];
      const index = visibleColumns.indexOf(rightSibling);
      if (index !== -1) {
        return index;
      }
    }

    throw new Error(`Can't restore column position.`);
  }
}
