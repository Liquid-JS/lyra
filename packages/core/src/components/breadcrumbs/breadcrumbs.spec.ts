import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbBreadcrumbsModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" dir="ltr" [style.width]="width()">
      <nb-breadcrumbs [aria-label]="label()">
        @if (customSeparator()) {
          <ng-template nbBreadcrumbSeparator><i class="arrow">›</i></ng-template>
        }
        @for (name of trail(); track name; let last = $last) {
          <nb-breadcrumb>
            @if (last) {
              {{ name }}
            } @else {
              <a href="#">{{ name }}</a>
            }
          </nb-breadcrumb>
        }
      </nb-breadcrumbs>
    </div>
  `,
  styleUrl: './breadcrumbs.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbBreadcrumbsModule],
})
class BreadcrumbsHostComponent {
  readonly trail = signal(['Home', 'Orders', 'Order #1042']);
  readonly label = signal('Breadcrumb');
  readonly customSeparator = signal(false);
  readonly width = signal('40rem');
}

describe('NbBreadcrumbsComponent', () => {
  let fixture: ComponentFixture<BreadcrumbsHostComponent>;
  let host: BreadcrumbsHostComponent;

  const all = (selector: string) => [...fixture.nativeElement.querySelectorAll(selector)] as HTMLElement[];
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] });
    fixture = TestBed.createComponent(BreadcrumbsHostComponent);
    host = fixture.componentInstance;
    await render();
  });

  it('should be a navigation landmark with a list of the breadcrumbs', async () => {
    const nav = fixture.nativeElement.querySelector('nb-breadcrumbs') as HTMLElement;
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(nav.querySelector('ol')).toBeTruthy();
    expect(all('ol > nb-breadcrumb').map((crumb) => crumb.getAttribute('role'))).toEqual([
      'listitem',
      'listitem',
      'listitem',
    ]);

    host.label.set('Path');
    await render();
    expect(nav.getAttribute('aria-label')).toBe('Path');
  });

  it('should mark the last breadcrumb as the current page, as the trail changes', async () => {
    expect(all('nb-breadcrumb').map((crumb) => crumb.getAttribute('aria-current'))).toEqual([null, null, 'page']);

    host.trail.set(['Home', 'Orders']);
    await render();
    expect(all('nb-breadcrumb').map((crumb) => crumb.getAttribute('aria-current'))).toEqual([null, 'page']);
  });

  it('should separate the breadcrumbs, hidden from screen readers', async () => {
    expect(all('nb-breadcrumb').map((crumb) => crumb.textContent?.trim().replace(/\s+/g, ' '))).toEqual([
      'Home',
      '/ Orders',
      '/ Order #1042',
    ]);
    expect(all('.separator').every((separator) => separator.getAttribute('aria-hidden') === 'true')).toBe(true);

    host.customSeparator.set(true);
    await render();
    expect(all('.separator').map((separator) => separator.textContent?.trim())).toEqual(['›', '›']);
    expect(all('.separator .arrow').length).toBe(2);
  });

  it('should show the current page in the basic text colour and the links in the hint colour', () => {
    const [link] = all('nb-breadcrumb a');
    const current = all('nb-breadcrumb').at(-1) as HTMLElement;
    expect(getComputedStyle(link).color).not.toBe(getComputedStyle(current).color);
    expect(getComputedStyle(link).textDecorationLine).toBe('none');
    expect(getComputedStyle(all('.separator')[0]).color).toBe(getComputedStyle(link).color);
  });

  it('should make the links reachable with Tab in Safari, also ones added later', async () => {
    expect(all('nb-breadcrumb a').map((link) => link.getAttribute('tabindex'))).toEqual(['0', '0']);

    host.trail.set(['Home', 'Orders', 'Order #1042', 'Items']);
    await render();
    expect(all('nb-breadcrumb a').map((link) => link.getAttribute('tabindex'))).toEqual(['0', '0', '0']);
  });

  it('should wrap a long trail onto more lines, keeping each breadcrumb whole', async () => {
    host.width.set('8rem');
    await render();

    const crumbs = all('nb-breadcrumb').map((crumb) => crumb.getBoundingClientRect());
    const nav = (fixture.nativeElement.querySelector('nb-breadcrumbs') as HTMLElement).getBoundingClientRect();
    expect(new Set(crumbs.map((crumb) => Math.round(crumb.top))).size).toBeGreaterThan(1);
    expect(crumbs.every((crumb) => crumb.right <= nav.right + 0.5)).toBe(true);
  });
});
