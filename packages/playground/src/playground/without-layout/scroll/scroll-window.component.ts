import { Component, inject } from '@angular/core';
import {
  NbLayoutScrollService,
  NbLayoutRulerService,
  NbLayoutComponent,
  NbLayoutColumnComponent,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbButtonComponent,
} from '@liquid-js/lyr-core';

enum LayoutMode {
  WINDOW = 'window',
  LAYOUT = 'layout',
}

@Component({
  selector: 'nb-scroll-window',
  templateUrl: './scroll-window.component.html',
  imports: [
    NbButtonComponent,
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbCardBodyComponent,
  ],
})
export class ScrollWindowComponent {
  private readonly scroll = inject(NbLayoutScrollService);
  private readonly ruler = inject(NbLayoutRulerService);

  mode = LayoutMode.WINDOW;
  text = 'Hello World! '.repeat(1024 * 10);

  constructor() {
    this.scroll.onScroll().subscribe((event) => console.info('Scroll', event));
  }

  changeMode() {
    this.mode = this.mode === LayoutMode.WINDOW ? LayoutMode.LAYOUT : LayoutMode.WINDOW;
  }

  scrollTo(x: number, y: number) {
    this.scroll.scrollTo(x, y);

    this.ruler.getDimensions().subscribe((position) => console.info('Content Dimensions', position));

    this.scroll.getPosition().subscribe((size) => console.info('Scroll Position', size));
  }
}
