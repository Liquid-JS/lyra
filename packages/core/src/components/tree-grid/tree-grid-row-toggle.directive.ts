import { Directive, inject, input } from '@angular/core';
import { NbTreeGridCellDirective } from './tree-grid-cell.component';

/**
 * A custom row toggle: a click on the element toggles the cell's row. Put it on a `<button>`, which Enter and Space
 * click; it's in the Tab order in every browser, Safari included.
 */
@Directive({
  selector: '[nbTreeGridRowToggle]',
  host: {
    '[attr.tabindex]': 'tabindex()',
    '(click)': 'toggleRow($event)',
  },
})
export class NbTreeGridRowToggleDirective {
  private readonly cell = inject(NbTreeGridCellDirective);

  /** The toggle's place in the Tab order; Safari leaves out a button without one. */
  readonly tabindex = input<number | string>(0);

  toggleRow($event: Event) {
    this.cell.toggleRow();
    $event.stopPropagation();
  }
}
