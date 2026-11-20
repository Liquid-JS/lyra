import { ComponentRef, signal, WritableSignal } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { NbWindowComponent } from './window.component';
import { NbWindowConfig, NbWindowState, NbWindowStateChange } from './window.options';
import { ɵanimatePane as animatePane } from '@liquid-js/lyr-core/base';

/**
 * Controls an open window: its state, its place among the others and its closing. The content rendered in the
 * window can inject it. As in `NbDialogRef`, `componentRef` is the component rendered in the window, and
 * `windowComponentRef` is the window around it.
 */
export class NbWindowRef<T = unknown, R = unknown> {
  protected windowComponentRefValue?: ComponentRef<NbWindowComponent>;
  /**
   * The window component around the content, which `NbWindowService` sets as it opens the window.
   */
  get windowComponentRef(): ComponentRef<NbWindowComponent> {
    if (!this.windowComponentRefValue) {
      throw new Error('NbWindowRef: the window component is not created yet.');
    }
    return this.windowComponentRefValue;
  }
  set windowComponentRef(windowComponentRef: ComponentRef<NbWindowComponent>) {
    this.windowComponentRefValue = windowComponentRef;
  }

  /**
   * The rendered component, for a window opened with a component (not a template), once the window renders it.
   */
  componentRef?: ComponentRef<T>;

  /**
   * The instance of the rendered component.
   * @deprecated Use `componentRef?.instance`, as with `NbDialogRef`.
   */
  get componentInstance(): T | undefined {
    return this.componentRef?.instance;
  }

  protected prevStateValue?: NbWindowState;
  protected readonly stateValue: WritableSignal<NbWindowState>;
  /**
   * The window's state. Setting it moves the window and emits `stateChange`.
   */
  get state(): NbWindowState {
    return this.stateValue();
  }
  set state(newState: NbWindowState | undefined) {
    if (newState && this.stateValue() !== newState) {
      this.prevStateValue = this.stateValue();
      this.stateValue.set(newState);
      this.stateChange$.next({ oldState: this.prevStateValue, newState });
    }
  }

  protected stateChange$ = new ReplaySubject<NbWindowStateChange>(1);
  /**
   * Emits each change of state, and the current state on subscription.
   */
  get stateChange(): Observable<NbWindowStateChange> {
    return this.stateChange$.asObservable();
  }

  /**
   * Where the window is in the stack of open windows, as its z-index: the window used last is on top.
   */
  readonly layer = signal(0);

  protected readonly toFront$ = new Subject<void>();
  /**
   * Emits when the window asks to come to the top, e.g. as it's clicked or focused.
   */
  get frontRequests(): Observable<void> {
    return this.toFront$.asObservable();
  }

  protected _closed = false;
  protected closed$ = new Subject<R | undefined>();
  /**
   * Emits once, with the result passed to `close`, after the window has faded out and been removed.
   */
  get onClose() {
    return this.closed$.asObservable();
  }

  constructor(public config: NbWindowConfig) {
    this.stateValue = signal(config.initialState);
    this.stateChange$.next({ oldState: undefined, newState: config.initialState });
  }

  /**
   * Minimizes the window to its header, docked at the bottom of the page.
   */
  minimize() {
    this.state = NbWindowState.MINIMIZED;
  }

  /**
   * Docks the window at the bottom of the page, open.
   */
  dock() {
    this.state = NbWindowState.DOCKED;
  }

  /**
   * Opens the window in the middle of the page, over the content.
   */
  fullScreen() {
    this.state = NbWindowState.FULL_SCREEN;
  }

  /** Goes back to the state before the current one. */
  toPreviousState() {
    this.state = this.prevStateValue;
  }

  /**
   * Brings the window above the other open windows.
   */
  toFront() {
    if (!this._closed) {
      this.toFront$.next();
    }
  }

  /**
   * Closes window: it fades out, then it's removed and `onClose` emits, as a dialog does.
   * */
  close(res?: R) {
    if (this._closed) {
      return;
    }

    this._closed = true;
    const windowComponentRef = this.windowComponentRefValue;
    const card = windowComponentRef?.location.nativeElement.querySelector('nb-card');
    const faded = card instanceof HTMLElement ? animatePane(card, false) : Promise.resolve();
    void faded.then(() => {
      windowComponentRef?.destroy();
      this.componentRef = undefined;
      this.stateChange$.complete();
      this.toFront$.complete();
      this.closed$.next(res);
      this.closed$.complete();
    });
  }
}
