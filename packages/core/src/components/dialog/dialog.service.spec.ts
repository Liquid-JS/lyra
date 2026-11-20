import { assert } from 'vitest';
import { ApplicationRef, Component, computed, input, NgModule, Service, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  NbOverlayContainerAdapter,
  NbViewportRulerAdapter,
  NbOverlayService,
  NbDialogService,
  NbDialogModule,
  NbThemeModule,
  NB_DOCUMENT,
  NbLayoutDirection,
  NbLayoutDirectionService,
} from '@liquid-js/lyr-core';

@Service({ autoProvided: false })
export class NbViewportRulerMockAdapter extends NbViewportRulerAdapter {
  override getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1600, height: 900 };
  }
  override getViewportScrollPosition(): { left: number; top: number } {
    return { left: 0, top: 0 };
  }
}

@Component({
  selector: 'nb-test-dialog',
  template: '<button class="test-focusable-button"></button>',
  imports: [NbDialogModule],
})
class NbTestDialogComponent {}

// Content that renders with change detection, as most dialogs' does, not as the component is created.
@Component({
  selector: 'nb-rendered-content-test-dialog',
  template: `@if (shown()) {
    <button class="test-rendered-button"></button>
  }`,
})
class NbRenderedContentTestDialogComponent {
  readonly shown = signal(true);
}

@Component({
  selector: 'nb-signal-input-test-dialog',
  template: `
    <span class="test-input">{{ value }}</span>
    <span class="test-input-signal"> {{ number() }}</span>
    <span class="test-computed-signal">{{ squared() }}</span>
  `,
  imports: [NbDialogModule],
})
class NbSignalInputTestDialogComponent {
  value?: number;
  number = input<number>(0);
  squared = computed(() => this.number() * this.number());
}

@NgModule({
  imports: [NbTestDialogComponent, NbSignalInputTestDialogComponent, NbRenderedContentTestDialogComponent],
})
class NbTestDialogModule {}

describe('dialog-service', () => {
  let dialog: NbDialogService;
  let overlayContainerService: NbOverlayContainerAdapter;
  let overlayContainer: HTMLElement;
  let overlayService: NbOverlayService;
  let document: Document;

  const queryBackdrop = () => overlayContainer.querySelector('.overlay-backdrop');
  const backdrop = () => {
    const el = queryBackdrop();
    assert(el, 'backdrop not rendered');
    return el;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbTestDialogModule, NbThemeModule.forRoot(), NbDialogModule.forRoot()],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }],
    });

    dialog = TestBed.inject(NbDialogService);
    overlayContainerService = TestBed.inject(NbOverlayContainerAdapter);
    document = TestBed.inject(NB_DOCUMENT);
    overlayService = TestBed.inject(NbOverlayService);
  });

  beforeEach(() => {
    overlayContainer = document.createElement('div');
    overlayContainerService.setContainer(overlayContainer);
  });

  afterAll(() => {
    overlayContainerService.clearContainer();
  });

  it('should render dialog', () => {
    const ref = dialog.open(NbTestDialogComponent);
    expect(ref.componentRef).toBeTruthy();
    expect(ref.componentRef?.instance instanceof NbTestDialogComponent).toBeTruthy();
  });

  it('should fade in as it opens, and be removed only once it has faded out', async () => {
    document.body.appendChild(overlayContainer);
    const ref = dialog.open(NbTestDialogComponent, { autoFocus: false });
    const pane = overlayContainer.querySelector('nb-dialog-container')?.parentElement as HTMLElement;
    expect(pane.getAnimations().length).toBe(1);

    const closed = vi.fn();
    ref.onClose.subscribe(closed);
    ref.close('done');
    ref.close('again');
    expect(overlayContainer.querySelector('nb-dialog-container')).not.toBeNull();
    expect(closed).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(overlayContainer.querySelector('nb-dialog-container')).toBeNull();
    expect(closed).toHaveBeenCalledExactlyOnceWith('done');
    overlayContainer.remove();
  });

  it('should assign default backdropClass', () => {
    dialog.open(NbTestDialogComponent);
    expect(queryBackdrop()).toBeTruthy();
  });

  it('should assign backdropClass if provided', () => {
    dialog.open(NbTestDialogComponent, { backdropClass: 'nb-overlay-test-backdrop-class' });
    expect(overlayContainer.querySelector('.nb-overlay-test-backdrop-class')).toBeTruthy();
  });

  it('should assign dialogClass if provided', () => {
    dialog.open(NbTestDialogComponent, { dialogClass: 'nb-overlay-test-dialog-class' });
    expect(overlayContainer.querySelector('.nb-overlay-test-dialog-class')).toBeTruthy();
  });

  it('should render with backdrop if hasBackdrop is true', () => {
    dialog.open(NbTestDialogComponent, { hasBackdrop: true });
    expect(queryBackdrop()).toBeTruthy();
  });

  it('should render without backdrop if hasBackdrop is false', () => {
    dialog.open(NbTestDialogComponent, { hasBackdrop: false });
    expect(queryBackdrop()).toBeFalsy();
  });

  it('should leave capability scroll content under dialog if hasScroll is true', () => {
    const noopSpy = vi.spyOn(overlayService.scrollStrategies, 'noop');
    const blockSpy = vi.spyOn(overlayService.scrollStrategies, 'block');

    dialog.open(NbTestDialogComponent, { hasScroll: true });

    expect(noopSpy).toHaveBeenCalledTimes(1);
    expect(blockSpy).toHaveBeenCalledTimes(0);
  });

  it('should disable scroll under dialog if hasScroll is false', () => {
    const noopSpy = vi.spyOn(overlayService.scrollStrategies, 'noop');
    const blockSpy = vi.spyOn(overlayService.scrollStrategies, 'block');

    dialog.open(NbTestDialogComponent, { hasScroll: false });

    expect(noopSpy).toHaveBeenCalledTimes(0);
    expect(blockSpy).toHaveBeenCalledTimes(1);
  });

  it('should fire onBackdropClick if backdrop was clicked', () => new Promise<void>((done) => {
    const ref = dialog.open(NbTestDialogComponent, { closeOnBackdropClick: false });
    const backdropElement = backdrop();

    ref.onBackdropClick.subscribe((e) => {
      expect(e.target).toBe(backdropElement);
      done();
    });

    backdropElement.dispatchEvent(new Event('click'));
  }));

  it("should not fire onBackdropClick if backdrop wasn't clicked", () => {
    const ref = dialog.open(NbTestDialogComponent, { closeOnBackdropClick: false });
    const spy = vi.fn();
    ref.onBackdropClick.subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should close on backdrop click if closeOnBackdropClick is true', async () => {
    vi.useFakeTimers();
    dialog.open(NbTestDialogComponent, { closeOnBackdropClick: true, autoFocus: false });
    backdrop().dispatchEvent(new Event('click'));
    await vi.advanceTimersByTimeAsync(500);
    expect(queryBackdrop()).toBeFalsy();
  });

  it('should not close on backdrop click if closeOnBackdropClick is false', async () => {
    vi.useFakeTimers();
    dialog.open(NbTestDialogComponent, { closeOnBackdropClick: false });
    backdrop().dispatchEvent(new Event('click'));
    await vi.advanceTimersByTimeAsync(500);
    expect(queryBackdrop()).toBeTruthy();
  });

  it('should close on escape press if closeOnEsc is true', async () => {
    vi.useFakeTimers();
    dialog.open(NbTestDialogComponent, { closeOnEsc: true });
    document.dispatchEvent(new KeyboardEvent('keydown', <any>{ key: 'Escape', keyCode: 27 }));
    await vi.advanceTimersByTimeAsync(500);
    expect(queryBackdrop()).toBeFalsy();
  });

  it('should stay open for an escape press a control in it handled, e.g. to close a picker', async () => {
    vi.useFakeTimers();
    dialog.open(NbTestDialogComponent, { closeOnEsc: true });
    const control = document.createElement('input');
    document.body.appendChild(control);
    control.addEventListener('keydown', (event) => event.preventDefault());
    control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await vi.advanceTimersByTimeAsync(500);
    expect(queryBackdrop()).toBeTruthy();
    control.remove();
  });

  it('should not close on escape press if closeOnEsc is false', async () => {
    vi.useFakeTimers();
    dialog.open(NbTestDialogComponent, { closeOnEsc: false });
    document.dispatchEvent(new KeyboardEvent('keydown', <any>{ key: 'Escape', keyCode: 27 }));
    await vi.advanceTimersByTimeAsync(500);
    expect(queryBackdrop()).toBeTruthy();
  });

  it("should focus the first focusable element of a component's content once it has rendered", async () => {
    document.body.appendChild(overlayContainer);
    dialog.open(NbRenderedContentTestDialogComponent);
    await TestBed.inject(ApplicationRef).whenStable();
    expect(document.activeElement?.classList).toContain('test-rendered-button');
    overlayContainer.remove();
  });

  it('should close with a result of the type it was opened with', async () => {
    const ref = dialog.open<NbTestDialogComponent, { saved: boolean }>(NbTestDialogComponent, { autoFocus: false });
    const result = new Promise<{ saved: boolean } | undefined>((resolve) => ref.onClose.subscribe(resolve));
    ref.close({ saved: true });
    vi.useFakeTimers();
    await vi.advanceTimersByTimeAsync(500);
    expect(await result).toEqual({ saved: true });
  });

  it('should display regular inputs', async () => {
    vi.useFakeTimers();
    const ref = dialog.open(NbSignalInputTestDialogComponent, {
      context: {
        value: 10,
      },
    });
    await vi.advanceTimersByTimeAsync(0);
    const el = ref.componentRef?.location.nativeElement.querySelector('.test-input');
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toEqual('10');
  });

  it('should display signal inputs', async () => {
    vi.useFakeTimers();
    const ref = dialog.open(NbSignalInputTestDialogComponent, {
      context: {
        number: 10,
      },
    });
    await vi.advanceTimersByTimeAsync(0);
    const el = ref.componentRef?.location.nativeElement.querySelector('.test-input-signal');
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toEqual('10');
  });

  it('should derive computed signals from input signals', async () => {
    vi.useFakeTimers();
    const ref = dialog.open(NbSignalInputTestDialogComponent, {
      context: {
        number: 10,
      },
    });
    await vi.advanceTimersByTimeAsync(0);
    const el = ref.componentRef?.location.nativeElement.querySelector('.test-computed-signal');
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toEqual('100');
  });

  describe('position', () => {
    const pane = async () => {
      TestBed.tick();
      await Promise.resolve();
      const element = overlayContainer.querySelector('.cdk-overlay-pane') as HTMLElement | null;
      assert(element, 'pane not rendered');
      return { pane: element.style, wrapper: (element.parentElement as HTMLElement).style };
    };

    it('should be modal only with a backdrop', async () => {
      dialog.open(NbTestDialogComponent);
      dialog.open(NbTestDialogComponent, { hasBackdrop: false });
      await pane();

      const containers = overlayContainer.querySelectorAll('nb-dialog-container');
      expect(containers[0].getAttribute('aria-modal')).toBe('true');
      expect(containers[1].getAttribute('aria-modal')).toBe('false');
      expect(containers[1].getAttribute('role')).toBe('dialog');
    });

    it('should center dialogs by default', async () => {
      dialog.open(NbTestDialogComponent);
      const { wrapper } = await pane();

      expect(wrapper.justifyContent).toBe('center');
      expect(wrapper.alignItems).toBe('center');
    });

    it('should place dialogs at the top, centered horizontally', async () => {
      dialog.open(NbTestDialogComponent, { position: 'top', positionOffset: '1rem' });
      const { pane: style, wrapper } = await pane();

      expect(style.marginTop).toBe('1rem');
      expect(wrapper.alignItems).toBe('flex-start');
      expect(wrapper.justifyContent).toBe('center');
    });

    it('should place dialogs in a corner', async () => {
      dialog.open(NbTestDialogComponent, { position: 'bottom-start', positionOffset: '1rem' });
      const { pane: style, wrapper } = await pane();

      expect(style.marginBottom).toBe('1rem');
      expect(style.marginLeft).toBe('1rem');
      expect(wrapper.alignItems).toBe('flex-end');
      expect(wrapper.justifyContent).toBe('flex-start');
    });

    it('should resolve start and end for right-to-left layouts', async () => {
      TestBed.inject(NbLayoutDirectionService).setDirection(NbLayoutDirection.RTL);
      dialog.open(NbTestDialogComponent, { position: 'bottom-start', positionOffset: '1rem' });
      const { pane: style } = await pane();

      expect(style.marginRight).toBe('1rem');
    });
  });
});
