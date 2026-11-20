import { assert } from 'vitest';
import {
  ApplicationRef,
  Component,
  ElementRef,
  NgModule,
  TemplateRef,
  inject as inject_1,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NbWindowService,
  NbWindowModule,
  NbViewportRulerAdapter,
  NbOverlayContainerAdapter,
  NB_DOCUMENT,
  NbThemeModule,
  NbWindowOpenConfig,
  NbWindowState,
  NbOverlayService,
  NbComponentPortal,
  NbLayoutDirection,
  NbLayoutDirectionService,
} from '@liquid-js/lyr-core';

const WINDOW_CONTENT = 'window content';
@Component({
  selector: 'nb-test-window',
  template: WINDOW_CONTENT,
  imports: [NbWindowModule],
})
class NbTestWindowComponent {}

@Component({
  selector: 'nb-test-window-with-template',
  template: `
    <ng-template #contentTemplate let-data>
      <p>Static text: {{ data.text }}</p>
    </ng-template>
  `,
  imports: [NbWindowModule],
})
class NbTestWindowWithTemplateComponent {
  private ws = inject_1(NbWindowService);

  readonly contentTemplate = viewChild.required<TemplateRef<any>>('contentTemplate');

  openWindow() {
    return this.ws.open(this.contentTemplate(), {
      title: 'Window content from template',
      context: { text: 'hello world' },
    });
  }
}

@Component({
  selector: 'nb-test-window-with-component',
  template: `<p id="window-content">window content {{ componentInput }}</p>
    <p></p>`,
  imports: [NbWindowModule],
})
export class TestWindowComponent {
  componentInput?: string;
}

@NgModule({
  imports: [NbTestWindowComponent, NbTestWindowWithTemplateComponent, TestWindowComponent],
})
class NbTestWindowModule {}

let overlayContainerService: NbOverlayContainerAdapter;
let overlayContainer: HTMLElement;
let document: Document;
// Hidden, or inert while it fades out.
const backdropHidden = () => queryBackdrop().hasAttribute('hidden') || queryBackdrop().hasAttribute('inert');
const queryBackdrop = () => {
  const backdrop = overlayContainer.querySelector('.cdk-overlay-backdrop');
  assert(backdrop, 'backdrop not rendered');
  return backdrop;
};
let windowService: NbWindowService;

class NbViewportRulerAdapterMock {
  getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1000, height: 1000 };
  }

  getViewportScrollPosition(): { left: number; top: number } {
    return { left: 0, top: 0 };
  }
}

describe('window-service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbWindowModule.forRoot(), NbTestWindowModule],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerAdapterMock }],
    });
    windowService = TestBed.inject(NbWindowService);
    overlayContainerService = TestBed.inject(NbOverlayContainerAdapter);
    document = TestBed.inject(NB_DOCUMENT);
  });

  beforeEach(() => {
    overlayContainer = document.createElement('div');
    overlayContainerService.setContainer(overlayContainer);
    document.body.appendChild(overlayContainer);
  });

  afterEach(() => {
    overlayContainerService.clearContainer();
    document.body.removeChild(overlayContainer);
  });

  it('should render window', () => {
    const windowRef = windowService.open(NbTestWindowComponent);
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(windowRef.windowComponentRef).toBeDefined();
    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);

    expect(windowElement.nativeElement.innerText).toContain(WINDOW_CONTENT);
  });

  // At the bottom end: on the left in right-to-left layouts, where the wrapper's own direction flips flex-end.
  it('should keep windows at the bottom end of the page', async () => {
    TestBed.inject(NbLayoutDirectionService).setDirection(NbLayoutDirection.RTL);
    windowService.open(NbTestWindowComponent);
    TestBed.tick();
    await Promise.resolve();

    const wrapper = overlayContainer.querySelector<HTMLElement>('.cdk-global-overlay-wrapper');
    assert(wrapper, 'overlay wrapper not rendered');
    expect(wrapper.getAttribute('dir')).toBe('rtl');
    expect(wrapper.style.justifyContent).toBe('flex-end');
    expect(wrapper.style.alignItems).toBe('flex-end');
  });

  it('should set title', () => {
    const title = 'Window title';
    const windowRef = windowService.open(NbTestWindowComponent, { title });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);

    const titleElement = windowElement.nativeElement.querySelector('.title');
    assert(titleElement);
    expect(titleElement.textContent).toEqual(title);
    // The title takes its own direction, without changing how it's aligned in the header.
    expect(titleElement.hasAttribute('dir')).toBe(false);
    expect(titleElement.querySelector('[dir="auto"]')?.textContent).toEqual(title);
  });

  it('should move focus to its title once it renders', async () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const windowRef = windowService.open(NbTestWindowComponent, { title: 'Window title' });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.inject(ApplicationRef).tick();

    const windowElement: HTMLElement = windowRef.windowComponentRef.injector.get(ElementRef).nativeElement;
    expect(document.activeElement).toBe(windowElement.querySelector('.title'));
    opener.remove();
  });

  it('should set class if provided', () => {
    const windowClass = 'my-window-class';
    const windowRef = windowService.open(NbTestWindowComponent, { windowClass });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);

    expect(windowElement.nativeElement.classList).toContain(windowClass);
  });

  it('should share one backdrop, shown while any window is full screen', () => {
    const first = windowService.open(NbTestWindowComponent);
    const second = windowService.open(NbTestWindowComponent);
    expect(overlayContainer.querySelectorAll('.cdk-overlay-backdrop').length).toBe(1);
    expect(backdropHidden()).toBeFalsy();

    first.minimize();
    expect(backdropHidden()).toBeFalsy();
    // Docked, it leaves the page uncovered.
    second.dock();
    expect(backdropHidden()).toBeTruthy();
    first.fullScreen();
    expect(backdropHidden()).toBeFalsy();
  });

  it('should offer to restore a minimized window, in place of minimizing it', () => {
    const windowRef = windowService.open(NbTestWindowComponent);
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const button = () => overlayContainer.querySelector('nb-window .buttons button');
    expect(button()?.getAttribute('aria-label')).toBe('Minimize');

    windowRef.minimize();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(button()?.getAttribute('aria-label')).toBe('Restore');

    windowRef.toPreviousState();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(button()?.getAttribute('aria-label')).toBe('Minimize');
  });

  it('should render with backdrop if hasBackdrop is true', () => {
    const windowRef = windowService.open(NbTestWindowComponent, { hasBackdrop: true });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();

    expect(queryBackdrop()).toBeTruthy();
  });

  it('should render without backdrop if hasBackdrop is false', () => {
    const windowRef = windowService.open(NbTestWindowComponent, { hasBackdrop: false });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();

    expect(backdropHidden()).toBeTruthy();
  });

  it('should close every open window on a backdrop click by default', async () => {
    const first = windowService.open(NbTestWindowComponent);
    const second = windowService.open(NbTestWindowComponent, { title: 'second' });
    const closed = vi.fn();
    first.onClose.subscribe(() => closed('first'));
    second.onClose.subscribe(() => closed('second'));
    queryBackdrop().dispatchEvent(new Event('click'));
    // A window fades out before it's closed.
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(closed).toHaveBeenCalledWith('first');
    expect(closed).toHaveBeenCalledWith('second');
  });

  it('should open a window above the windows already open', () => {
    const first = windowService.open(NbTestWindowComponent);
    const second = windowService.open(NbTestWindowComponent, { title: 'second' });
    TestBed.tick();

    const element = (ref: typeof first): HTMLElement => ref.windowComponentRef.location.nativeElement;
    const zIndex = (ref: typeof first) => Number(getComputedStyle(element(ref)).zIndex);
    expect(zIndex(second)).toBeGreaterThan(zIndex(first));
  });

  it('should bring a window to the top when it is clicked or focused', () => {
    const first = windowService.open(NbTestWindowComponent);
    const second = windowService.open(NbTestWindowComponent, { title: 'second' });
    TestBed.tick();
    const element = (ref: typeof first): HTMLElement => ref.windowComponentRef.location.nativeElement;
    const zIndex = (ref: typeof first) => Number(getComputedStyle(element(ref)).zIndex);

    element(first).dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    TestBed.tick();
    expect(zIndex(first)).toBeGreaterThan(zIndex(second));

    element(second).dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    TestBed.tick();
    expect(zIndex(second)).toBeGreaterThan(zIndex(first));
  });

  it('should be a dialog named by its title, modal while its backdrop covers the page', () => {
    const windowRef = windowService.open(NbTestWindowComponent, { title: 'Invoice' });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const element: HTMLElement = windowRef.windowComponentRef.location.nativeElement;

    expect(element.getAttribute('role')).toBe('dialog');
    expect(document.getElementById(element.getAttribute('aria-labelledby') ?? '')?.textContent?.trim()).toBe('Invoice');
    expect(element.getAttribute('aria-modal')).toBe('true');

    windowRef.dock();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(element.getAttribute('aria-modal')).toBe('false');
  });

  it('should keep Tab in the window only while it is modal, not docked or minimized', async () => {
    const windowRef = windowService.open(NbTestWindowComponent, { title: 'Invoice' });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    TestBed.tick();
    const element: HTMLElement = windowRef.windowComponentRef.location.nativeElement;
    // The trap's anchors, before and after the window, are Tab stops while it traps.
    const anchors = () =>
      [element.previousElementSibling, element.nextElementSibling].map((anchor) => anchor?.getAttribute('tabindex'));
    expect(anchors()).toEqual(['0', '0']);

    windowRef.dock();
    TestBed.tick();
    expect(anchors()).toEqual([null, null]);

    windowRef.minimize();
    TestBed.tick();
    expect(anchors()).toEqual([null, null]);
  });

  it('should close on escape press if closeOnEsc is true', async () => {
    const closeSpy = vi.fn();
    const windowRef = windowService.open(NbTestWindowComponent, { closeOnEsc: true });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    windowRef.onClose.subscribe(closeSpy);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should stay open for an escape press a control in it handled, e.g. to close a picker', () => {
    const closeSpy = vi.fn();
    const windowRef = windowService.open(NbTestWindowComponent, { closeOnEsc: true });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    windowRef.onClose.subscribe(closeSpy);
    const control = document.createElement('input');
    document.body.appendChild(control);
    control.addEventListener('keydown', (event) => event.preventDefault());
    control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    control.remove();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not close on escape press if closeOnEsc is false', () => {
    const closeSpy = vi.fn();
    const windowRef = windowService.open(NbTestWindowComponent, { closeOnEsc: false });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    windowRef.onClose.subscribe(closeSpy);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should hide backdrop when window not in a full screen', () => {
    const windowRef = windowService.open(NbTestWindowComponent, { closeOnEsc: false });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(backdropHidden()).toBeFalsy();

    windowRef.minimize();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(backdropHidden()).toBeTruthy();

    windowRef.dock();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(backdropHidden()).toBeTruthy();

    windowRef.fullScreen();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(backdropHidden()).toBeFalsy();
  });

  it('should keep backdrop while at least one full screen window is open', () => {
    const firstWindow = windowService.open(NbTestWindowComponent);
    const secondWindow = windowService.open(NbTestWindowComponent);
    firstWindow.windowComponentRef.changeDetectorRef.detectChanges();
    secondWindow.windowComponentRef.changeDetectorRef.detectChanges();
    expect(backdropHidden()).toBeFalsy();

    firstWindow.minimize();
    firstWindow.windowComponentRef.changeDetectorRef.detectChanges();
    expect(backdropHidden()).toBeFalsy();

    secondWindow.minimize();
    secondWindow.windowComponentRef.changeDetectorRef.detectChanges();
    expect(backdropHidden()).toBeTruthy();

    firstWindow.fullScreen();
    firstWindow.windowComponentRef.changeDetectorRef.detectChanges();
    expect(backdropHidden()).toBeFalsy();
  });

  it(`should hide window content when minimized and keep it alive`, function () {
    const windowRef = windowService.open(NbTestWindowComponent);
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const content = windowRef.componentRef?.instance;

    windowRef.minimize();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const windowElement: HTMLElement = windowRef.windowComponentRef.location.nativeElement;
    const body = windowElement.querySelector('nb-card-body');
    assert(body);
    expect(getComputedStyle(body).display).toBe('none');

    windowRef.dock();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(content).toBeDefined();
    expect(windowRef.componentRef?.instance).toBe(content);
  });

  it(`should render window content when unminimized`, function () {
    const windowRef = windowService.open(NbTestWindowComponent);
    windowRef.minimize();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    windowRef.dock();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();

    const windowElement: HTMLElement = windowRef.windowComponentRef.location.nativeElement;
    expect(windowElement.querySelector('nb-card-body')).not.toBeNull();
  });

  it(`should render window content from template with context`, function () {
    const fixture = TestBed.createComponent(NbTestWindowWithTemplateComponent);
    fixture.detectChanges();

    const windowRef = fixture.componentInstance.openWindow();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    expect(windowRef.windowComponentRef).toBeDefined();

    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    expect(windowElement.nativeElement.innerText).toContain('Static text: hello world');
  });

  it('should give the rendered component as componentRef, as a dialog does', async function () {
    const windowRef = windowService.open(TestWindowComponent, { context: { componentInput: 'hello world' } });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();

    // Typed by the component it opens.
    const content: TestWindowComponent | undefined = windowRef.componentRef?.instance;
    expect(content).toBeInstanceOf(TestWindowComponent);
    expect(windowRef.componentRef?.location.nativeElement.textContent).toContain('window content hello world');

    windowRef.close();
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(windowRef.componentRef).toBeUndefined();
  });

  it('should have no componentRef for a template', function () {
    const fixture = TestBed.createComponent(NbTestWindowWithTemplateComponent);
    fixture.detectChanges();
    const windowRef = fixture.componentInstance.openWindow();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();

    expect(windowRef.componentRef).toBeUndefined();
  });

  it(`should render window content from component without context`, function () {
    const windowRef = windowService.open(TestWindowComponent);
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();

    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    expect(windowElement.nativeElement.innerText).toEqual('window content');
  });

  it(`should render window content from component with context`, function () {
    const windowRef = windowService.open(TestWindowComponent, { context: { componentInput: 'hello world' } });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();

    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    expect(windowElement.nativeElement.innerText).toEqual('window content hello world');
  });

  it('should create new window container when overlay container changed', async () => {
    const fixture = TestBed.createComponent(NbTestWindowWithTemplateComponent);
    fixture.detectChanges();

    // Show window to force windows container creation
    const windowRef = fixture.componentInstance.openWindow();
    fixture.detectChanges();
    await fixture.whenStable();

    windowRef.close();
    fixture.detectChanges();
    await fixture.whenStable();

    // Change overlay container
    overlayContainerService.ngOnDestroy();
    overlayContainerService.clearContainer();
    overlayContainer = document.createElement('div');
    overlayContainerService.setContainer(overlayContainer);
    document.body.appendChild(overlayContainer);

    windowService.open(TestWindowComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const windowContent = document.getElementById('window-content');
    expect(document.body.contains(windowContent)).toEqual(true);
  });

  it('should render all control buttons by default', () => {
    const windowRef = windowService.open(NbTestWindowComponent);
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    expect(windowElement.nativeElement.querySelectorAll('button').length).toBe(3);
  });

  it('should render only close button', () => {
    const windowRef = windowService.open(NbTestWindowComponent, { states: [NbWindowState.FULL_SCREEN] });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    const labels = Array.from(windowElement.nativeElement.querySelectorAll('button')).map((button) =>
      button.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['Close']);
  });

  it('should render minimize and close button', () => {
    const windowRef = windowService.open(NbTestWindowComponent, {
      states: [NbWindowState.DOCKED, NbWindowState.MINIMIZED],
    });
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    const labels = Array.from(windowElement.nativeElement.querySelectorAll('button')).map((button) =>
      button.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['Minimize', 'Close']);
  });

  // An app may put a window in a state the user can't choose: the buttons take it to the ones they can, not back.
  it('should offer only its states from a state the app set', () => {
    const windowRef = windowService.open(NbTestWindowComponent, {
      states: [NbWindowState.DOCKED, NbWindowState.MINIMIZED],
    });
    windowRef.fullScreen();
    windowRef.windowComponentRef.changeDetectorRef.detectChanges();
    const windowElement: HTMLElement = windowRef.windowComponentRef.injector.get(ElementRef).nativeElement;
    const labels = Array.from(windowElement.querySelectorAll('.buttons button')).map((button) =>
      button.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['Minimize', 'Collapse', 'Close']);
  });

  it('should open in its initial state when it can be in it, or in the first of its states', () => {
    const open = (config: NbWindowOpenConfig) => windowService.open(NbTestWindowComponent, config).state;
    expect(open({})).toBe(NbWindowState.FULL_SCREEN);
    expect(open({ states: [NbWindowState.DOCKED, NbWindowState.MINIMIZED] })).toBe(NbWindowState.DOCKED);
    expect(open({ states: [NbWindowState.MINIMIZED, NbWindowState.FULL_SCREEN] })).toBe(NbWindowState.FULL_SCREEN);
    expect(open({ initialState: NbWindowState.MINIMIZED })).toBe(NbWindowState.MINIMIZED);
    expect(open({ states: [NbWindowState.DOCKED], initialState: NbWindowState.FULL_SCREEN })).toBe(
      NbWindowState.DOCKED,
    );
  });

  // Every set of states: in each, a button to each other one, so none is out of reach.
  it('should move between the states it can be in, and only those', () => {
    const all = [NbWindowState.FULL_SCREEN, NbWindowState.DOCKED, NbWindowState.MINIMIZED];
    const sets = all.flatMap((_, index) => all.slice(index).map((__, end) => all.slice(index, index + end + 1)));
    sets.push([NbWindowState.FULL_SCREEN, NbWindowState.MINIMIZED]);
    for (const states of sets) {
      const windowRef = windowService.open(NbTestWindowComponent, { states });
      const render = () => windowRef.windowComponentRef.changeDetectorRef.detectChanges();
      const windowElement: HTMLElement = windowRef.windowComponentRef.injector.get(ElementRef).nativeElement;
      for (const from of states) {
        for (const to of states.filter((state) => state !== from)) {
          windowRef.state = from;
          render();
          const buttons = Array.from(windowElement.querySelectorAll<HTMLElement>('.buttons button')).slice(0, -1);
          expect(buttons.length, `${states} in ${from}`).toBe(states.length - 1);
          const before = windowRef.state;
          const button = buttons.find((candidate) => {
            candidate.click();
            render();
            const reached = windowRef.state === to;
            windowRef.state = before;
            render();
            return reached;
          });
          expect(button, `${states}: ${from} to ${to}`).toBeDefined();
        }
      }
      windowRef.close();
    }
  });

  it('should leave the page uncovered when a window opens docked', () => {
    windowService.open(NbTestWindowComponent, { initialState: NbWindowState.DOCKED });
    expect(backdropHidden()).toBe(true);
  });

  it('should name the window buttons', () => {
    const windowRef = windowService.open(NbTestWindowComponent);
    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    const labels = Array.from(windowElement.nativeElement.querySelectorAll('.buttons button')).map((button) =>
      button.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['Minimize', 'Collapse', 'Close']);
  });

  it('should render close button by default', () => {
    const windowRef = windowService.open(NbTestWindowComponent);

    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    const windowButtonIcons = Array.from<HTMLElement>(windowElement.nativeElement.querySelectorAll('.buttons nb-icon'));
    const iconNames = windowButtonIcons.map((buttonIcon: HTMLElement) => buttonIcon.getAttribute('icon'));
    expect(iconNames).toContain('close-outline');
  });

  it('should not render close button if disabled from config', () => {
    const windowRef = windowService.open(NbTestWindowComponent, { closeButton: false });

    const windowElement: ElementRef<HTMLElement> = windowRef.windowComponentRef.injector.get(ElementRef);
    const windowButtonIcons = Array.from<HTMLElement>(windowElement.nativeElement.querySelectorAll('.buttons nb-icon'));
    const iconNames = windowButtonIcons.map((buttonIcon: HTMLElement) => buttonIcon.getAttribute('icon'));
    expect(iconNames).not.toContain('close-outline');
  });
});

describe('window-service with backdrop clicks off', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbWindowModule.forRoot({ closeOnBackdropClick: false }), NbTestWindowModule],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerAdapterMock }],
    });
    windowService = TestBed.inject(NbWindowService);
    overlayContainerService = TestBed.inject(NbOverlayContainerAdapter);
    document = TestBed.inject(NB_DOCUMENT);
    overlayContainer = document.createElement('div');
    overlayContainerService.setContainer(overlayContainer);
    document.body.appendChild(overlayContainer);
  });

  afterEach(() => {
    overlayContainerService.clearContainer();
    document.body.removeChild(overlayContainer);
  });

  it('should close no window on a backdrop click', () => {
    const first = windowService.open(NbTestWindowComponent);
    const second = windowService.open(NbTestWindowComponent, { title: 'second' });
    const closed = vi.fn();
    first.onClose.subscribe(closed);
    second.onClose.subscribe(closed);
    queryBackdrop().dispatchEvent(new Event('click'));

    expect(closed).not.toHaveBeenCalled();
  });
});

describe('window-service with other overlays', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbWindowModule.forRoot(), NbTestWindowModule],
      providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerAdapterMock }],
    });
    windowService = TestBed.inject(NbWindowService);
    overlayContainerService = TestBed.inject(NbOverlayContainerAdapter);
    document = TestBed.inject(NB_DOCUMENT);
    overlayContainer = document.createElement('div');
    overlayContainerService.setContainer(overlayContainer);
    document.body.appendChild(overlayContainer);
  });

  afterEach(() => {
    overlayContainerService.clearContainer();
    document.body.removeChild(overlayContainer);
  });

  it('should show a new window above an overlay opened after the first window', () => {
    windowService.open(NbTestWindowComponent);

    // e.g. a dialog with a backdrop covering the page
    const dialogOverlay = TestBed.inject(NbOverlayService).create({ hasBackdrop: true });
    dialogOverlay.attach(new NbComponentPortal(NbTestWindowComponent));

    const secondWindow = windowService.open(NbTestWindowComponent, { title: 'second' });
    const windowElement: HTMLElement = secondWindow.windowComponentRef.location.nativeElement;
    const rect = windowElement.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);

    expect(windowElement.contains(hit)).toBe(true);
    dialogOverlay.dispose();
  });
});
