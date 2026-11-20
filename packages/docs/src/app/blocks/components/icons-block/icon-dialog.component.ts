import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import {
  NB_DOCUMENT,
  NbButtonComponent,
  NbCardBodyComponent,
  NbCardComponent,
  NbCardFooterComponent,
  NbCardHeaderComponent,
  NbDialogRef,
  NbIconComponent,
  NbToastrService,
  NbToggleComponent,
} from '@liquid-js/lyr-core';
import { NB_ICONS } from '@liquid-js/lyr-icons';

/**
 * An icon, large, with its name: filled or outlined where it comes in both, to download as SVG or copy the markup to use
 * it, `<nb-icon icon="…" />`.
 */
@Component({
  selector: 'ngd-icon-dialog',
  templateUrl: './icon-dialog.component.html',
  styleUrls: ['./icon-dialog.component.scss'],
  imports: [
    NbButtonComponent,
    NbCardComponent,
    NbCardBodyComponent,
    NbCardFooterComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbToggleComponent,
  ],
})
export class NgdIconDialogComponent {
  private readonly ref = inject<NbDialogRef<NgdIconDialogComponent>>(NbDialogRef);
  private readonly document = inject(NB_DOCUMENT);
  private readonly toastr = inject(NbToastrService);

  /** The icon's name without its style, e.g. `star`. */
  readonly base = input('');
  /** The style it opens in, as the page shows the icons. */
  readonly fill = input(false);

  protected readonly hasFill = computed(() => this.base() in NB_ICONS);
  protected readonly hasOutline = computed(() => `${this.base()}-outline` in NB_ICONS);
  /** Filled, when it comes filled and that's chosen, or comes only filled. */
  protected readonly filled = linkedSignal(() => (this.fill() ? this.hasFill() : !this.hasOutline()));

  protected readonly name = computed(() => (this.filled() ? this.base() : `${this.base()}-outline`));
  protected readonly snippet = computed(() => `<nb-icon icon="${this.name()}" />`);

  protected close() {
    this.ref.close();
  }

  /** The icon as an SVG file, in the current colour wherever it's used. */
  protected download() {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">` +
      `${NB_ICONS[this.name()]}</svg>\n`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const link = this.document.createElement('a');
    link.href = url;
    link.download = `${this.name()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  protected async copy() {
    try {
      await this.document.defaultView?.navigator.clipboard.writeText(this.snippet());
      this.toastr.success(this.snippet(), 'Copied');
    } catch {
      this.toastr.danger(`The browser didn't allow it. The icon's name is ${this.name()}.`, "Couldn't copy");
    }
  }
}
