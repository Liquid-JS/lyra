import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'

import { NbRouteTab, NbRouteTabsetModule } from '@liquid-js/lyr-core'

@Component({
    template: '<nb-route-tabset [tabs]="tabs" />',
    imports: [NbRouteTabsetModule]
})
class RouteTabsetTestComponent {
    readonly tabs: NbRouteTab[] = [
        { title: 'Orders', route: '/orders' },
        { title: 'Archive', route: '/archive', disabled: true }
    ]
}

@Component({
    template: '<nb-route-tabset [tabs]="tabs" outlet="false" />',
    imports: [NbRouteTabsetModule]
})
class RouteNavigationTestComponent {
    readonly tabs: NbRouteTab[] = [
        { title: 'Orders', route: '/orders' },
        { title: 'Archive', route: '/archive' }
    ]
}

describe('nb-route-tabset', () => {
    it('should isolate the direction of the tab titles', () => {
        TestBed.configureTestingModule({ providers: [provideRouter([])] })
        const fixture = TestBed.createComponent(RouteTabsetTestComponent)
        fixture.detectChanges()

        const element: HTMLElement = fixture.nativeElement
        const titles = Array.from(element.querySelectorAll<HTMLElement>('.tab-text'))
        expect(titles.map((title) => [title.textContent, title.getAttribute('dir')])).toEqual([
            ['Orders', 'auto'],
            ['Archive', 'auto']
        ])
    })

    it('should say the tab of the current route is the current page', async () => {
        TestBed.configureTestingModule({
            providers: [provideRouter([{ path: 'orders', component: RouteTabsetTestComponent }])]
        })
        const fixture = TestBed.createComponent(RouteTabsetTestComponent)
        fixture.detectChanges()
        await TestBed.inject(Router).navigateByUrl('/orders')
        fixture.detectChanges()

        const link = fixture.nativeElement.querySelector('.route-tab:not(.disabled) a') as HTMLAnchorElement
        expect(link.getAttribute('aria-current')).toBe('page')
    })

    it('should leave out its outlet when the tabs are navigation alone', () => {
        TestBed.configureTestingModule({ providers: [provideRouter([])] })
        const fixture = TestBed.createComponent(RouteNavigationTestComponent)
        fixture.detectChanges()

        const element: HTMLElement = fixture.nativeElement
        expect(element.querySelector('router-outlet')).toBeNull()
        expect(element.querySelectorAll('.route-tab')).toHaveLength(2)
    })

    it('should show the active route in its outlet by default', () => {
        TestBed.configureTestingModule({ providers: [provideRouter([])] })
        const fixture = TestBed.createComponent(RouteTabsetTestComponent)
        fixture.detectChanges()

        expect((fixture.nativeElement as HTMLElement).querySelector('router-outlet')).not.toBeNull()
    })
})
