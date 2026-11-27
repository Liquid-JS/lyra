import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'

import {
    NbActionsModule,
    NbDialogModule,
    NbDialogService,
    NbIconLibraries,
    NbLayoutModule,
    NbRouteTab,
    NbRouteTabsetModule,
    NbSidebarModule,
    NbThemeModule,
    NbThemeService
} from '@liquid-js/lyr-core'

const tabs: NbRouteTab[] = [
    { title: 'Today', route: '/today', icon: 'home-outline' },
    { title: 'Inbox', route: '/inbox', icon: 'email-outline', badgeText: '3', badgeStatus: 'danger' }
]

@Component({
    template: `
        <nb-route-tabset class="header-tabs" [tabs]="tabs" outlet="false" collapse="menu" below="md" (tabChange)="picked.set($event.title)" />
        <nb-route-tabset class="bar" [tabs]="tabs" outlet="false" appearance="bar" />
        <nb-actions collapse="menu" below="md">
            <nb-action class="search" icon="search-outline" title="Search" (click)="searched.set(true)" />
            <nb-action class="own"><span>JD</span></nb-action>
        </nb-actions>
    `,
    imports: [NbRouteTabsetModule, NbActionsModule]
})
class NavigationHostComponent {
    readonly tabs = tabs
    readonly searched = signal(false)
    readonly picked = signal<string | undefined>(undefined)
}

@Component({
    template: `
        <nb-layout>
            <nb-sidebar responsive drawer [collapsedBreakpoints]="['xs', 'is', 'sm']">Menu</nb-sidebar>
            <nb-layout-column>Page</nb-layout-column>
            <nb-layout-footer fixed *nbShownBelow="'md'">Tabs</nb-layout-footer>
            <nb-layout-header><span class="wide" *nbShownAbove="'md'">Tabs</span></nb-layout-header>
        </nb-layout>
    `,
    imports: [NbLayoutModule, NbSidebarModule]
})
class LayoutHostComponent {}

@Component({ template: '<div class="sheet-content">Details</div>' })
class SheetContentComponent {}

describe('responsive navigation', () => {
    const width = (pixels: number) => TestBed.inject(NbThemeService).changeWindowWidth(pixels)

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbSidebarModule.forRoot(), NbDialogModule.forRoot()],
            providers: [provideRouter([])]
        })
        TestBed.inject(NbIconLibraries).setDefaultPack('essentials')
    })

    it('should fold header tabs and titled actions into menus below their breakpoint', () => {
        const fixture = TestBed.createComponent(NavigationHostComponent)
        const element: HTMLElement = fixture.nativeElement
        width(1200)
        fixture.detectChanges()
        expect(element.querySelector('.header-tabs .route-tabset')).not.toBeNull()
        expect(element.querySelector('.header-tabs .menu-button')).toBeNull()
        expect(element.querySelector('nb-action.search')?.classList.contains('folded')).toBe(false)
        expect(element.querySelector('nb-action.more')).toBeNull()

        width(400)
        fixture.detectChanges()
        expect(element.querySelector('.header-tabs .route-tabset')).toBeNull()
        expect(element.querySelector('.header-tabs .menu-button')?.getAttribute('aria-label')).toBe('Menu')
        expect(element.querySelector('nb-action.search')?.classList.contains('folded')).toBe(true)
        expect(element.querySelector('nb-action.own')?.classList.contains('folded')).toBe(false)
        expect(element.querySelector('nb-action.more')).not.toBeNull()
    })

    it('should tell which tab was picked from the menu the tabs fold into, as for a tab clicked', async () => {
        // The tabs' pages aren't routes here.
        vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true)
        const fixture = TestBed.createComponent(NavigationHostComponent)
        const element: HTMLElement = fixture.nativeElement
        width(400)
        fixture.detectChanges()
        ;(element.querySelector('.header-tabs .menu-button') as HTMLElement).click()
        fixture.detectChanges()
        await fixture.whenStable()
        const item = [...document.querySelectorAll<HTMLElement>('nb-context-menu .menu-title')].find((title) => title.textContent?.trim() === 'Inbox')
        ;(item?.closest('a') as HTMLElement).click()
        fixture.detectChanges()
        expect(fixture.componentInstance.picked()).toBe('Inbox')
    })

    it('should show a bar with its tabs sharing the width and a badge on the icon', () => {
        const fixture = TestBed.createComponent(NavigationHostComponent)
        width(400)
        fixture.detectChanges()
        const bar = (fixture.nativeElement as HTMLElement).querySelector('nb-route-tabset.bar') as HTMLElement
        expect(bar.classList.contains('appearance-bar')).toBe(true)
        expect(bar.querySelectorAll('.route-tab')).toHaveLength(2)
        expect(bar.querySelector('.tab-icon nb-badge')?.textContent?.trim()).toBe('3')
    })

    it('should show a footer only below its breakpoint, and a drawer with a backdrop that closes it', () => {
        const fixture = TestBed.createComponent(LayoutHostComponent)
        width(1200)
        fixture.detectChanges()
        const element: HTMLElement = fixture.nativeElement
        expect(element.querySelector('nb-layout-footer')).toBeNull()
        expect(element.querySelector('.wide')).not.toBeNull()

        width(400)
        fixture.detectChanges()
        expect(element.querySelector('nb-layout-footer')).not.toBeNull()
        expect(element.querySelector('.wide')).toBeNull()
        const sidebar = element.querySelector('nb-sidebar') as HTMLElement
        expect(sidebar.querySelector('.drawer-backdrop')).toBeNull()

        ;(fixture.debugElement.query((debug) => debug.name === 'nb-sidebar').componentInstance as { expand(): void }).expand()
        fixture.detectChanges()
        const backdrop = sidebar.querySelector('.drawer-backdrop') as HTMLElement
        expect(backdrop).not.toBeNull()
        backdrop.click()
        fixture.detectChanges()
        expect(sidebar.querySelector('.drawer-backdrop')).toBeNull()
    })

    it('should open a sheet at the bottom, as wide as the screen up to its limit', async () => {
        const ref = TestBed.inject(NbDialogService).open(SheetContentComponent, { sheet: true })
        await new Promise((resolve) => setTimeout(resolve))
        const container = document.querySelector('nb-dialog-container') as HTMLElement
        expect(container.classList.contains('sheet')).toBe(true)
        expect(container.getBoundingClientRect().bottom).toBeCloseTo(window.innerHeight, 0)
        ref.close()
    })
})
