import { Component, inject, input } from '@angular/core'
import {
    NbButtonComponent,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbDialogRef
} from '@liquid-js/lyr-core'

/** What to do with a theme's unsaved changes before leaving it: save them, drop them, or stay (closing it). */
export type NgdUnsavedThemeChoice = 'save' | 'discard' | undefined

/** Asks whether to save a theme's changes before the editor moves to another theme. */
@Component({
    selector: 'ngd-unsaved-theme-dialog',
    template: `
    <nb-card>
      <nb-card-header>Save changes to {{ name() }}?</nb-card-header>
      <nb-card-body>Your changes are lost if you don't save them.</nb-card-body>
      <nb-card-footer class="buttons">
        <button nbButton ghost type="button" (click)="close()">Cancel</button>
        <button nbButton ghost status="danger" type="button" (click)="close('discard')">Don't save</button>
        <button nbButton status="primary" type="button" (click)="close('save')">Save</button>
      </nb-card-footer>
    </nb-card>
  `,
    styles: `
    nb-card {
      margin: 0;
      max-width: 28rem;
    }

    .buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `,
    imports: [NbButtonComponent, NbCardComponent, NbCardBodyComponent, NbCardFooterComponent, NbCardHeaderComponent]
})
export class NgdUnsavedThemeDialogComponent {
    protected readonly ref = inject<NbDialogRef<NgdUnsavedThemeDialogComponent, NgdUnsavedThemeChoice>>(NbDialogRef)
    readonly name = input('')

    protected close(choice?: NgdUnsavedThemeChoice) {
        this.ref.close(choice)
    }
}
