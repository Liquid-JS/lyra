import { Component, inject, signal } from '@angular/core';
import { NbButtonComponent, NbToastrService } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-toastr-actions',
  templateUrl: './toastr-actions.component.html',
  styles: [
    `
      ::ng-deep nb-layout-column {
        height: 80vw;
      }
    `,
  ],
  host: { class: 'example-items-rows' },
  imports: [NbButtonComponent],
})
export class ToastrActionsComponent {
  private readonly toastrService = inject(NbToastrService);

  readonly archived = signal(0);

  archive() {
    this.archived.update((count) => count + 1);
    this.toastrService.success('The conversation was moved to the archive.', 'Archived', {
      duration: 6000,
      actions: [
        // Takes a moment, e.g. a request: the button is loading until it's done.
        { text: 'Undo', action: () => new Promise((resolve) => setTimeout(resolve, 1000)).then(() => this.archived.update((count) => count - 1)) },
      ],
    });
  }

  share() {
    this.toastrService.show('Anyone with the link can view the file.', 'Link copied', {
      duration: 0,
      closeButton: true,
      destroyByClick: false,
      actions: [
        { text: 'Settings', close: false, action: () => this.toastrService.info('Opening the sharing settings.') },
        { text: 'Stop sharing', status: 'danger', appearance: 'outline' },
      ],
    });
  }
}
