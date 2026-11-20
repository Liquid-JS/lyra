import {
  afterRenderEffect,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { NbSelectedTimeModel } from './model';
import { NbPlatform } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

@Component({
  selector: 'nb-timepicker-cell',
  template: `<div #valueContainer>{{ value() }}</div>`,
  styleUrls: ['./timepicker-cell.component.scss'],
  // An option of its column's listbox; the keyboard reaches its column's selected one, or else its first, with Tab.
  host: {
    role: 'option',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'tabbable() ? 0 : -1',
    '(click)': 'onClick()',
    '(keydown.enter)': 'pick($event)',
    '(keydown.space)': 'pick($event)',
  },
})
export class NbTimePickerCellComponent {
  protected readonly ngZone = inject(NgZone);
  protected readonly platformService = inject(NbPlatform);

  readonly selected = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });
  /** Out of the timepicker's range: shown, but not picked. */
  readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });
  readonly value = input.required<string>();
  /** Whether Tab reaches it in its column. */
  readonly tabbable = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });
  readonly select = output<NbSelectedTimeModel>();

  readonly valueContainerElement = viewChild<ElementRef<HTMLElement>>('valueContainer');

  constructor() {
    // The timepicker renders in an overlay that may not be placed yet when the cell renders, so a selected cell
    // scrolls into view after the render.
    afterRenderEffect(() => {
      if (this.selected()) {
        untracked(() => this.scrollToElement());
      }
    });
  }

  /** Enter and Space pick it, as a click does. */
  protected pick(event: Event) {
    event.preventDefault();
    this.onClick();
  }

  onClick() {
    if (this.disabled()) {
      return;
    }
    this.select.emit({ value: this.value() });
  }

  protected scrollToElement() {
    const element = this.valueContainerElement()?.nativeElement;
    if (element && this.platformService.isBrowser) {
      this.ngZone.runOutsideAngular(() => element.scrollIntoView({ block: 'center' }));
    }
  }
}
