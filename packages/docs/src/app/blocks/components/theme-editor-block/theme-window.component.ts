import { Location } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import {
    NbButtonComponent,
    NbOptionComponent,
    NbSelectComponent,
    NbWindowRef,
    NbWindowState
} from '@liquid-js/lyr-core'

import { NgdThemeControlsComponent } from './theme-controls.component'
import { NgdThemeDrafts, themeLabel } from './theme-drafts.service'

/** The theme editor's controls in a window over a full-screen example, which shows the changes as they're made. */
@Component({
    selector: 'ngd-theme-window',
    template: `
    <div class="picker">
      <!-- Drawn again when switching is cancelled, so it shows the theme still being edited. -->
      @for (key of [pickerKey()]; track key) {
        <nb-select
          fullWidth
          aria-label="Theme"
          [selected]="themes.draft().id"
          (selectedChange)="$event && pick($event)">
          @for (item of themes.drafts(); track item.id) {
            <nb-option [value]="item.id">{{ item.name }}</nb-option>
          }
          @if (!themes.isSaved()) {
            <nb-option [value]="themes.draft().id">{{ themes.draft().name }} (not saved)</nb-option>
          }
        </nb-select>
      }
    </div>
    <ngd-theme-controls />
    <div class="actions">
      <button nbButton outline size="small" type="button" [disabled]="!themes.changed()" (click)="themes.reset()">
        Back to {{ label(themes.draft().base) }}
      </button>
      <button
        nbButton
        size="small"
        status="primary"
        type="button"
        [disabled]="themes.isSaved() && !themes.dirty()"
        (click)="themes.save()">
        Save
      </button>
    </div>
    <p class="editor-link"><a [href]="editorUrl" target="_blank">Open the theme editor</a></p>
  `,
    styles: `
    // It scrolls out to the window's edge, so a scrollbar shown there leaves the fields' borders and focus rings be.
    :host {
      display: block;
      // 20rem of fields, and the padding: a column, as docked at the side.
      width: 21.75rem;
      max-height: 70vh;
      overflow: auto;
      margin-block: -0.25rem;
      margin-inline: -0.25rem -1.5rem;
      padding-block: 0.25rem;
      padding-inline: 0.25rem 1.5rem;
    }

    // Expanded in the middle of the screen, wide enough for the controls' columns: the theme picker and the actions
    // share the top row, over the controls.
    :host(.wide) {
      display: grid;
      grid-template-columns: minmax(0, 20rem) minmax(0, 1fr);
      grid-template-areas:
        'picker actions'
        'controls controls'
        'link link';
      column-gap: 2rem;
      align-items: start;
      width: min(66rem, calc(100vw - 6rem));

      .picker {
        grid-area: picker;
      }

      ngd-theme-controls {
        grid-area: controls;
      }

      .actions {
        grid-area: actions;
        justify-content: flex-end;
        margin-top: 0;
      }

      .editor-link {
        grid-area: link;
      }
    }

    .picker {
      margin-bottom: 1rem;
    }

    .editor-link {
      margin: 1rem 0 0;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
  `,
    host: { '[class.wide]': 'wide()' },
    imports: [NbButtonComponent, NbOptionComponent, NbSelectComponent, NgdThemeControlsComponent]
})
export class NgdThemeWindowComponent {
    protected readonly themes = inject(NgdThemeDrafts)
    protected readonly label = themeLabel
    protected readonly editorUrl = inject(Location).prepareExternalUrl('theme/theme-editor')
    protected readonly pickerKey = signal(0)
    private readonly windowRef = inject(NbWindowRef, { optional: true })
    /** Expanded in the middle of the screen, not docked or minimized. */
    protected readonly wide = computed(() => this.windowRef?.state === NbWindowState.FULL_SCREEN)

    protected async pick(id: string) {
        await this.themes.select(id)
        if (this.themes.draft().id !== id) {
            this.pickerKey.update((key) => key + 1)
        }
    }
}
