import { Service } from '@angular/core';

import { NbOverlayContainer } from '../overlay/mapping';

/**
 * Puts the overlays in `nb-layout`, or in the document body without a layout (overlays aren't themed then).
 *
 * The layout registers itself with `setContainer` and must clear itself with `clearContainer` when it's destroyed,
 * or the overlays would keep going into its element, which is no longer in the DOM. The last container set holds
 * the overlays, unless it is inside another one: a layout nested in another layout (e.g. in a tab) doesn't, so it
 * doesn't take the overlays with it when it goes away.
 */
@Service({ autoProvided: false })
export class NbOverlayContainerAdapter extends NbOverlayContainer {
  protected containers = new Array<HTMLElement>();

  protected get container(): HTMLElement | undefined {
    return [...this.containers]
      .reverse()
      .find((container) => !this.containers.some((other) => other !== container && other.contains(container)));
  }

  setContainer(container: HTMLElement) {
    this.containers = [...this.containers.filter((c) => c !== container), container];
    // Overlays opened before there was a layout are in the document body; new ones go to the layout.
    this.resetContainerElementOutsideLayouts();
  }

  /** Removes the given container, or all of them. */
  clearContainer(container?: HTMLElement) {
    this.containers = container ? this.containers.filter((c) => c !== container) : [];
    // A new overlay container is created in the layout that remains, if any.
    this.resetContainerElementOutsideLayouts();
  }

  protected resetContainerElementOutsideLayouts() {
    const containerElement = this._containerElement;
    if (containerElement && !this.containers.some((c) => c.contains(containerElement))) {
      this._containerElement = undefined;
    }
  }

  protected override _createContainer() {
    const container = this._document.createElement('div');
    container.classList.add('cdk-overlay-container');
    (this.container ?? this._document.body).appendChild(container);
    this._containerElement = container;
  }
}
