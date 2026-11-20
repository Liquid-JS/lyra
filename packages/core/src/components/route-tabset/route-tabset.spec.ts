import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { NbRouteTab, NbRouteTabsetModule } from '@liquid-js/lyr-core';

@Component({
  template: `<nb-route-tabset [tabs]="tabs" />`,
  imports: [NbRouteTabsetModule],
})
class RouteTabsetTestComponent {
  readonly tabs: NbRouteTab[] = [
    { title: 'Orders', route: '/orders' },
    { title: 'Archive', route: '/archive', disabled: true },
  ];
}

describe('nb-route-tabset', () => {
  it('should isolate the direction of the tab titles', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(RouteTabsetTestComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const titles = Array.from(element.querySelectorAll<HTMLElement>('.tab-text'));
    expect(titles.map((title) => [title.textContent, title.getAttribute('dir')])).toEqual([
      ['Orders', 'auto'],
      ['Archive', 'auto'],
    ]);
  });

  it('should say the tab of the current route is the current page', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'orders', component: RouteTabsetTestComponent }])],
    });
    const fixture = TestBed.createComponent(RouteTabsetTestComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/orders');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.route-tab:not(.disabled) a') as HTMLAnchorElement;
    expect(link.getAttribute('aria-current')).toBe('page');
  });
});
