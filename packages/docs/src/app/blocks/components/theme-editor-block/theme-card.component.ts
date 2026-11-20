import { Component, input, output } from '@angular/core';

import { NgdThemeSwatches } from './theme-export';

/** A theme as a button drawn in its own colours: its backgrounds, text and status colours. */
@Component({
  selector: 'ngd-theme-card',
  template: `
    <button
      type="button"
      tabindex="0"
      [attr.aria-pressed]="pressed()"
      [style.--card-background]="swatches().background"
      [style.--card-border]="swatches().border"
      [style.--card-text]="swatches().text"
      [style.--card-hint]="swatches().hint"
      [style.--card-radius]="swatches().radius"
      [style.--card-accent]="swatches().colors[3]"
      (click)="pick.emit()">
      <span class="title">
        <span class="name">{{ name() }}</span>
        <span class="hint">{{ hint() }}</span>
      </span>
      <span class="swatches" aria-hidden="true">
        @for (color of swatches().colors; track $index) {
          <span [style.background-color]="color"></span>
        }
      </span>
    </button>
  `,
  styleUrls: ['./theme-card.component.scss'],
})
export class NgdThemeCardComponent {
  readonly name = input.required<string>();
  readonly hint = input.required<string>();
  readonly swatches = input.required<NgdThemeSwatches>();
  /** Whether it's the theme being edited; unset for a card that starts a theme. */
  readonly pressed = input<boolean>();
  readonly pick = output();
}
