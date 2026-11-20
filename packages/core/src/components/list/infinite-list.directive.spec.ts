import { Component, DebugElement, signal } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  NbThemeModule,
  NbLayoutModule,
  NbLayoutComponent,
  NbLayoutScrollService,
  NbListModule,
  NbListComponent,
  NbInfiniteListDirective,
} from '@liquid-js/lyr-core';

const CONTENT_PADDING = 20;
const CONTENT_HEIGHT = 10000 + CONTENT_PADDING;
const ELEMENT_HEIGHT = 500;
const THRESHOLD = 200;

let fixture: ComponentFixture<ScrollTestComponent>;
let testComponent: ScrollTestComponent;
let listElementRef: DebugElement;
let layoutComponent: NbLayoutComponent;
let infiniteListDirective: NbInfiniteListDirective;

// First change detection run must take place with fake timers installed,
// so rxjs interval scheduled in the `throttle` (by `interval` observable)
// use the faked `setInterval`. Then we are able to control this interval via
// `vi.advanceTimersByTimeAsync`.
async function setup() {
  fixture.detectChanges();
  await vi.advanceTimersByTimeAsync(0);

  listElementRef = fixture.debugElement.query(By.directive(NbListComponent));
  layoutComponent = fixture.debugElement.query(By.directive(NbLayoutComponent)).componentInstance;
  infiniteListDirective = listElementRef.injector.get(NbInfiniteListDirective);
  testComponent = fixture.componentInstance;
}

@Component({
  template: `
    <nb-layout [withScroll]="withScroll()">
      <nb-layout-column>
        <nb-list
          #scrollingElement
          class="scroller"
          [class.element-scroll]="!listenWindowScroll()"
          nbInfiniteList
          [throttleTime]="throttleTime()"
          [threshold]="threshold()"
          [listenWindowScroll]="listenWindowScroll()"
          (bottomThreshold)="bottomThreshold()"
          (topThreshold)="topThreshold()"
        >
          <nb-list-item class="inner" />
        </nb-list>
      </nb-layout-column>
    </nb-layout>
  `,
  styles: [
        `
      ::ng-deep nb-layout.with-scroll .scrollable-container {
        overflow: auto;
        height: 100vh;
      }
      .scroller {
        background: lightgray;
        padding: ${CONTENT_PADDING}px;
      }
      .element-scroll {
        height: ${ELEMENT_HEIGHT}px;
        overflow-y: auto;
      }
      .inner {
        background: lightgoldenrodyellow;
        height: ${CONTENT_HEIGHT}px;
      }
    `,
  ],
  imports: [NbLayoutModule, NbListModule, RouterModule],
})
class ScrollTestComponent {
  readonly listenWindowScroll = signal(false);
  readonly threshold = signal(THRESHOLD);
  readonly withScroll = signal(false);
  readonly throttleTime = signal(0);

  bottomThreshold() {}
  topThreshold() {}
}

// Setting scrollTop makes the browser fire its own scroll event on the next frame, which can land while a spec
// advances timers and count as an extra scroll. The specs dispatch the scroll events they test, so drop the browser's.
const dropNativeScroll = (event: Event) => {
  if (event.isTrusted) {
    event.stopImmediatePropagation();
  }
};

describe('Directive: NbScrollDirective', () => {
  beforeEach(() => {
    window.addEventListener('scroll', dropNativeScroll, true);
    fixture = TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbLayoutModule, NbListModule, ScrollTestComponent],
      providers: [NbLayoutScrollService, { provide: APP_BASE_HREF, useValue: '/' }],
    }).createComponent(ScrollTestComponent);
  });

  afterEach(async () => {
    vi.useFakeTimers();
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(0);
    fixture.nativeElement.remove();
    window.removeEventListener('scroll', dropNativeScroll, true);
    vi.useRealTimers();
  });

  it('should listen to window scroll', async () => {
    vi.useFakeTimers();
    await setup();
    const checkPositionSpy = vi.spyOn(infiniteListDirective, 'checkPosition').mockImplementation(() => undefined);
    testComponent.listenWindowScroll.set(true);
    fixture.detectChanges();

    window.dispatchEvent(new Event('scroll'));
    expect(checkPositionSpy).toHaveBeenCalledTimes(1);
  });

  it('should listen to layout scroll', async () => {
    vi.useFakeTimers();
    await setup();
    const checkPositionSpy = vi.spyOn(infiniteListDirective, 'checkPosition').mockImplementation(() => undefined);
    testComponent.listenWindowScroll.set(true);
    testComponent.withScroll.set(true);
    fixture.detectChanges();

    layoutComponent.scrollableContainerRef().nativeElement.dispatchEvent(new Event('scroll'));

    expect(checkPositionSpy).toHaveBeenCalledTimes(1);
  });

  it('should listen to element scroll', async () => {
    vi.useFakeTimers();
    await setup();
    const elementScrollHandlerSpy = vi.spyOn(infiniteListDirective, 'onElementScroll').mockImplementation(() => undefined);
    listElementRef.nativeElement.dispatchEvent(new Event('scroll'));
    expect(elementScrollHandlerSpy).toHaveBeenCalledTimes(1);
  });

  it('should ignore window and layout scroll when listening to element scroll', async () => {
    vi.useFakeTimers();
    await setup();
    const checkPositionSpy = vi.spyOn(infiniteListDirective, 'checkPosition').mockImplementation(() => undefined);

    window.dispatchEvent(new Event('scroll'));
    expect(checkPositionSpy).toHaveBeenCalledTimes(0);

    const layoutScrollContainer = layoutComponent.scrollableContainerRef().nativeElement;
    layoutScrollContainer.dispatchEvent(new Event('scroll'));
    expect(checkPositionSpy).toHaveBeenCalledTimes(0);

    listElementRef.nativeElement.dispatchEvent(new Event('scroll'));
    expect(checkPositionSpy).toHaveBeenCalledTimes(1);
  });

  it('should ignore element scroll when listening to window or layout scroll', async () => {
    vi.useFakeTimers();
    await setup();
    testComponent.listenWindowScroll.set(true);
    fixture.detectChanges();

    const checkPositionSpy = vi.spyOn(infiniteListDirective, 'checkPosition').mockImplementation(() => undefined);

    listElementRef.nativeElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(checkPositionSpy).toHaveBeenCalledTimes(0);

    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(checkPositionSpy).toHaveBeenCalledTimes(1);

    testComponent.withScroll.set(true);
    fixture.detectChanges();

    listElementRef.nativeElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(checkPositionSpy).toHaveBeenCalledTimes(1);

    const layoutScrollContainer = layoutComponent.scrollableContainerRef().nativeElement;
    layoutScrollContainer.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(checkPositionSpy).toHaveBeenCalledTimes(2);
  });

  it('should trigger bottomThreshold only when threshold reached (element scroll)', async () => {
    vi.useFakeTimers();
    await setup();
    const scrollingNativeElement = listElementRef.nativeElement;
    const thresholdSpy = vi.spyOn(testComponent, 'bottomThreshold').mockImplementation(() => undefined);

    const positionUnderThreshold = CONTENT_HEIGHT - THRESHOLD - ELEMENT_HEIGHT - 1;
    scrollingNativeElement.scrollTop = positionUnderThreshold;
    scrollingNativeElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(0);

    const positionBelowThreshold = CONTENT_HEIGHT - THRESHOLD / 2;
    scrollingNativeElement.scrollTop = positionBelowThreshold;
    scrollingNativeElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger bottomThreshold only when threshold reached (window scroll)', async () => {
    vi.useFakeTimers();
    await setup();
    const { documentElement } = document;

    testComponent.listenWindowScroll.set(true);
    fixture.detectChanges();

    const thresholdSpy = vi.spyOn(testComponent, 'bottomThreshold').mockImplementation(() => undefined);

    const reporterHeight = 1000;
    const positionUnderThreshold = CONTENT_HEIGHT - THRESHOLD - reporterHeight;
    documentElement.scrollTop = positionUnderThreshold;
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(0);

    const positionBelowThreshold = CONTENT_HEIGHT - THRESHOLD / 2;
    documentElement.scrollTop = positionBelowThreshold;
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger bottomThreshold only when threshold reached (layout scroll)', async () => {
    vi.useFakeTimers();
    await setup();
    const scroller: Element = layoutComponent.scrollableContainerRef().nativeElement;

    testComponent.listenWindowScroll.set(true);
    testComponent.withScroll.set(true);
    fixture.detectChanges();

    const thresholdSpy = vi.spyOn(testComponent, 'bottomThreshold').mockImplementation(() => undefined);

    const positionUnderThreshold = CONTENT_HEIGHT - THRESHOLD - scroller.clientHeight - 1;
    scroller.scrollTop = positionUnderThreshold;
    scroller.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(0);

    const positionBelowThreshold = CONTENT_HEIGHT - THRESHOLD / 2;
    scroller.scrollTop = positionBelowThreshold;
    scroller.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger topThreshold when threshold reached (element)', async () => {
    vi.useFakeTimers();
    await setup();
    const scrollingElement = listElementRef.nativeElement;
    const thresholdSpy = vi.spyOn(testComponent, 'topThreshold').mockImplementation(() => undefined);

    scrollingElement.scrollTop = THRESHOLD + 1;
    scrollingElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(0);

    scrollingElement.scrollTop = THRESHOLD - 1;
    scrollingElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger topThreshold when threshold reached (window)', async () => {
    vi.useFakeTimers();
    await setup();
    testComponent.listenWindowScroll.set(true);
    fixture.detectChanges();

    const { documentElement } = document;
    const thresholdSpy = vi.spyOn(testComponent, 'topThreshold').mockImplementation(() => undefined);

    documentElement.scrollTop = THRESHOLD + 1;
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(0);

    documentElement.scrollTop = THRESHOLD - 1;
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger topThreshold when threshold reached (layout scroll)', async () => {
    vi.useFakeTimers();
    await setup();
    testComponent.listenWindowScroll.set(true);
    testComponent.withScroll.set(true);
    fixture.detectChanges();

    const layoutElement = layoutComponent.scrollableContainerRef().nativeElement;
    const thresholdSpy = vi.spyOn(testComponent, 'topThreshold').mockImplementation(() => undefined);

    layoutElement.scrollTop = THRESHOLD + 1;
    layoutElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(0);

    layoutElement.scrollTop = THRESHOLD - 1;
    layoutElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(infiniteListDirective.throttleTime());
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
  });

  it('should prevent subsequent bottomThreshold emissions for throttleTime duration (window scroll)', async () => {
    vi.useFakeTimers();
    await setup();
    const { documentElement } = document;
    const THROTTLE = 200;

    testComponent.listenWindowScroll.set(true);
    testComponent.throttleTime.set(THROTTLE);
    fixture.detectChanges();

    const thresholdSpy = vi.spyOn(testComponent, 'bottomThreshold').mockImplementation(() => undefined);

    documentElement.scrollTop = CONTENT_HEIGHT - THRESHOLD / 2;

    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(THROTTLE / 2); // 100ms passed
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(THROTTLE / 2 - 1); // 199ms passed, resent scroll event should be throttled
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1); // 200ms passed, throttling has stopped

    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(0);
    expect(thresholdSpy).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(THROTTLE); // waiting for the end of the throttle interval
  });

  it('should prevent subsequent topThreshold emissions for throttleTime duration (window scroll)', async () => {
    vi.useFakeTimers();
    await setup();
    const { documentElement } = document;
    const THROTTLE = 200;

    testComponent.listenWindowScroll.set(true);
    testComponent.throttleTime.set(THROTTLE);

    fixture.detectChanges();

    documentElement.scrollTop = THRESHOLD + 1;
    window.dispatchEvent(new Event('scroll'));

    const thresholdSpy = vi.spyOn(testComponent, 'topThreshold').mockImplementation(() => undefined);

    documentElement.scrollTop -= 1;
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(THROTTLE / 2); // 100ms passed
    documentElement.scrollTop -= 1;
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(THROTTLE / 2 - 1); // 199ms passed, resent scroll event should be throttled
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1); // 200ms passed, throttling has stopped

    documentElement.scrollTop -= 1;
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(0);
    expect(thresholdSpy).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(THROTTLE); // waiting for the end of the throttle interval
  });

  it('should prevent subsequent bottomThreshold emissions for throttleTime duration (element scroll)', async () => {
    vi.useFakeTimers();
    await setup();
    const scrollingNativeElement = listElementRef.nativeElement;
    const THROTTLE = 200;

    testComponent.throttleTime.set(THROTTLE);
    fixture.detectChanges();

    const thresholdSpy = vi.spyOn(testComponent, 'bottomThreshold').mockImplementation(() => undefined);

    scrollingNativeElement.scrollTop = CONTENT_HEIGHT - THRESHOLD / 2;

    scrollingNativeElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(THROTTLE / 2); // 100ms passed
    scrollingNativeElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(THROTTLE / 2 - 1); // 199ms passed, resent scroll event should be throttled
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1); // 200ms passed, throttling has stopped

    scrollingNativeElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(0);
    expect(thresholdSpy).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(THROTTLE); // waiting for the end of the throttle interval
  });

  it('should prevent subsequent topThreshold emissions for throttleTime duration (element scroll)', async () => {
    vi.useFakeTimers();
    await setup();
    const scrollingElement = listElementRef.nativeElement;
    const THROTTLE = 200;

    testComponent.throttleTime.set(THROTTLE);
    fixture.detectChanges();

    scrollingElement.scrollTop = THRESHOLD + 1;
    scrollingElement.dispatchEvent(new Event('scroll'));

    const thresholdSpy = vi.spyOn(testComponent, 'topThreshold').mockImplementation(() => undefined);

    scrollingElement.scrollTop -= 1;
    scrollingElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(THROTTLE / 2); // 100ms passed
    scrollingElement.scrollTop -= 1;
    scrollingElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(THROTTLE / 2 - 1); // 199ms passed, resent scroll event should be throttled
    expect(thresholdSpy).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1); // 200ms passed, throttling has stopped

    scrollingElement.scrollTop -= 1;
    scrollingElement.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(0);
    expect(thresholdSpy).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(THROTTLE); // waiting for the end of the throttle interval
  });
});
