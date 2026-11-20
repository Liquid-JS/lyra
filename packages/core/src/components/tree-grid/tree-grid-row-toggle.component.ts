import { Component, inject, input } from '@angular/core';
import { NbTreeGridCellDirective } from './tree-grid-cell.component';
import { NbIconComponent } from '@liquid-js/lyr-core/icon';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';
import { ɵconvertToOptionalBoolProperty as convertToOptionalBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/**
 * A chevron button in a cell that toggles the cell's row. It points down while the row is open, else towards the
 * row's end, and its label says whether it expands or collapses.
 */
@Component({
  selector: 'nb-tree-grid-row-toggle',
  templateUrl: './tree-grid-row-toggle.component.html',
  styles: [
    `
      button {
        background: transparent;
        border: none;
        padding: 0;
      }

      /* The chevron turns as the row opens and closes: down while it's open, else towards the row's end. */
      nb-icon {
        transition: transform 0.15s ease-in;
        transform: rotate(-90deg);
      }
      :host-context([dir='rtl']) nb-icon {
        transform: rotate(90deg);
      }
      nb-icon.expanded {
        transform: none;
      }
      @media (prefers-reduced-motion: reduce) {
        nb-icon {
          transition: none;
        }
      }
    `,
  ],
  imports: [NbIconComponent],
  host: {
    '(click)': 'toggleRow($event)',
  },
})
export class NbTreeGridRowToggleComponent {
  protected readonly texts = injectNbTexts('treeGrid', () => ({
    collapse: $localize`:@@nb.treeGrid.collapse:collapse`,
    expand: $localize`:@@nb.treeGrid.expand:expand`,
  }));

  private readonly cell = inject(NbTreeGridCellDirective);

  /** Whether the row is open, which turns the chevron and sets the label. */
  readonly expanded = input<boolean | undefined, NbBooleanInput>(undefined, {
    transform: convertToOptionalBoolProperty,
  });

  toggleRow($event: Event) {
    this.cell.toggleRow();
    $event.stopPropagation();
  }
}
