import { Directive, Input, input, OnChanges } from '@angular/core';
import { ɵNbCdkColumnDef as NbCdkColumnDef } from '@liquid-js/lyr-core/cdk-table';
import { NB_SORT_HEADER_COLUMN_DEF, NbColumnDefDirective } from '@liquid-js/lyr-core/cdk-table';

function parseViewportWidth(value?: number | string | null): number | undefined {
  return !value && value !== 0 ? undefined : parseInt(value as string, 10);
}

/**
 * Defines a column: its name, which row definitions list, and its header, data and footer cell definitions.
 */
@Directive({
  selector: '[nbTreeGridColumnDef]',
  providers: [
    { provide: NbCdkColumnDef, useExisting: NbTreeGridColumnDefDirective },
    // Cells inject NbColumnDefDirective after CDK 22's inject()-based constructors.
    { provide: NbColumnDefDirective, useExisting: NbTreeGridColumnDefDirective },
    { provide: NB_SORT_HEADER_COLUMN_DEF, useExisting: NbTreeGridColumnDefDirective },
  ],
})
export class NbTreeGridColumnDefDirective extends NbColumnDefDirective implements OnChanges {
  // The CDK table reads the name as a plain property of its base class, so it stays a decorated input.
  @Input('nbTreeGridColumnDef')
  override get name(): string {
    return this._name;
  }
  override set name(value: string) {
    this._setNameInput(value);
  }

  /**
   * The window width, in px, at or below which the column is hidden. Not together with `showOn`.
   */
  readonly hideOn = input<number | undefined, number | string | null | undefined>(undefined, {
    transform: parseViewportWidth,
  });

  /**
   * The window width, in px, from which the column is shown; it's hidden below. Not together with `hideOn`.
   */
  readonly showOn = input<number | undefined, number | string | null | undefined>(undefined, {
    transform: parseViewportWidth,
  });

  ngOnChanges() {
    if (this.hideOn() !== undefined && this.showOn() !== undefined) {
      throw new Error(`hideOn and showOn are mutually exclusive and can't be used simultaneously.`);
    }
  }

  shouldHide(width: number): boolean {
    return !this.shouldShow(width);
  }

  shouldShow(width: number): boolean {
    const hideOn = this.hideOn();
    const showOn = this.showOn();
    if (hideOn !== undefined) {
      return width > hideOn;
    }

    if (showOn !== undefined) {
      return width >= showOn;
    }

    return true;
  }
}
