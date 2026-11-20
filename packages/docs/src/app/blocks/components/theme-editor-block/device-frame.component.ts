import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type NgdDevice = 'laptop' | 'phone';

// The viewport each device shows an example at, in CSS pixels.
const VIEWPORTS: Record<NgdDevice, { width: number; height: number }> = {
  laptop: { width: 1280, height: 800 },
  phone: { width: 390, height: 844 },
};

/**
 * An example in a laptop or phone, at the device's own viewport size and scaled down to fit, so a page lays out as it
 * would on it. The page loads once; a later `url` replaces it in the frame's history, so the docs' Back button isn't
 * taken.
 */
@Component({
  selector: 'ngd-device-frame',
  template: `
    <div class="device" [class.phone]="device() === 'phone'" [style.--scale]="scale()">
      <div class="screen" [style.width.px]="viewport().width * scale()" [style.height.px]="viewport().height * scale()">
        <iframe
          #frame
          [title]="label()"
          [style.width.px]="viewport().width"
          [style.height.px]="viewport().height"
          [style.transform]="'scale(' + scale() + ')'"
          (load)="loaded.emit()"></iframe>
      </div>
    </div>
  `,
  styleUrls: ['./device-frame.component.scss'],
})
export class NgdDeviceFrameComponent {
  readonly url = input.required<string>();
  readonly device = input<NgdDevice>('laptop');
  readonly label = input.required<string>();
  /** The viewport's height in CSS pixels instead of the device's own, e.g. to fit a window. */
  readonly height = input<number>();
  /** The frame loaded a page; it says it's listening once it reports its height. */
  readonly loaded = output();

  protected readonly frame = viewChild.required<ElementRef<HTMLIFrameElement>>('frame');
  protected readonly viewport = computed(() => {
    const viewport = VIEWPORTS[this.device()];
    return { width: viewport.width, height: this.height() ?? viewport.height };
  });
  protected readonly available = signal(0);
  // The bezel takes this much of the width, the same on either device at any scale.
  protected readonly bezel = 24;
  protected readonly scale = computed(() => {
    const available = this.available() - this.bezel;
    return available > 0 ? Math.min(1, available / this.viewport().width) : 1;
  });

  /** The page in the frame, to send messages to. */
  get window(): Window | null {
    return this.frame().nativeElement.contentWindow;
  }

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new ResizeObserver(([entry]) => this.available.set(entry.contentRect.width));
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });

    afterRenderEffect(() => {
      const url = this.url();
      // Marked as shown in a device, whose screen the page fills, rather than a frame as tall as the page.
      const src = `${url}${url.includes('?') ? '&' : '?'}frame=device`;
      const frame = this.frame().nativeElement;
      if (!frame.getAttribute('src')) {
        frame.src = src;
      } else if (frame.contentWindow && frame.contentWindow.location.pathname !== url.split('?')[0]) {
        frame.contentWindow.location.replace(src);
      }
    });
  }
}
