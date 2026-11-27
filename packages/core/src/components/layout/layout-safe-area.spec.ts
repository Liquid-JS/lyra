import { Component, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbLayoutModule, NbSidebarModule, NbThemeModule, NbToastrModule, NbToastrService } from '@liquid-js/lyr-core'

@Component({
    template: `
    <div class="nb-theme-default">
      <nb-layout>
        <nb-layout-header fixed><span class="brand">Acme</span></nb-layout-header>
        <nb-sidebar fixed drawer tag="drawer" [state]="state()"><span class="menu">Menu</span></nb-sidebar>
        <nb-layout-column><p class="page">Page</p></nb-layout-column>
        <nb-layout-footer fixed><span class="tabs">Tabs</span></nb-layout-footer>
      </nb-layout>
    </div>
  `,
    styleUrl: './layout-safe-area.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbLayoutModule, NbSidebarModule]
})
class PhoneHostComponent {
    readonly state = signal<'expanded' | 'collapsed'>('collapsed')
}

// A phone held upright with a notch, as `viewport-fit=cover` gives it, and then sideways.
const INSETS = { top: 47, right: 0, bottom: 34, left: 0 }
const SIDEWAYS = { top: 0, right: 47, bottom: 21, left: 47 }

describe('A layout on a phone that draws under its notch and home bar', () => {
    const setInsets = (insets: Record<string, number>) => {
        for (const [side, value] of Object.entries(insets)) {
            document.documentElement.style.setProperty(`--nb-safe-area-${side}`, `${value}px`)
        }
    }
    afterEach(() => {
        for (const side of ['top', 'right', 'bottom', 'left']) {
            document.documentElement.style.removeProperty(`--nb-safe-area-${side}`)
        }
    })

    const create = async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbSidebarModule.forRoot(), NbToastrModule.forRoot(), PhoneHostComponent] })
        const fixture = TestBed.createComponent(PhoneHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
        const element = fixture.nativeElement as HTMLElement
        const box = (selector: string) => (element.querySelector(selector) as HTMLElement).getBoundingClientRect()
        return { fixture, element, box }
    }

    it('should keep the header\'s bar, the page and the footer\'s bar clear of them', async () => {
        setInsets(INSETS)
        const { fixture, box } = await create()
        // The header's colour reaches the top of the screen; its bar is below the notch.
        expect(box('nb-layout-header').top).toBe(0)
        expect(box('nb-layout-header > nav').top).toBe(INSETS.top)
        expect(box('.page').top).toBeGreaterThanOrEqual(box('nb-layout-header').bottom)
        // The footer's bar is above the home bar, its colour below it.
        expect(box('nb-layout-footer > nav').bottom).toBeCloseTo(innerHeight - INSETS.bottom, 0)
        expect(box('nb-layout-footer').bottom).toBeCloseTo(innerHeight, 0)
        fixture.destroy()
    })

    it('should keep an open drawer\'s content clear of them, its panel reaching the screen\'s edges', async () => {
        setInsets(INSETS)
        const { fixture, box } = await create()
        fixture.componentInstance.state.set('expanded')
        fixture.detectChanges()
        await fixture.whenStable()
        expect(box('nb-sidebar .main-container').top).toBe(0)
        expect(box('.menu').top).toBeGreaterThanOrEqual(INSETS.top)
        expect(box('nb-sidebar .main-container').bottom).toBeCloseTo(innerHeight, 0)
        fixture.destroy()
    })

    it('should keep the page and the header\'s bar clear of them held sideways', async () => {
        setInsets(SIDEWAYS)
        const { fixture, box } = await create()
        expect(box('nb-layout-header').left).toBe(0)
        expect(box('nb-layout-header > nav').left).toBe(SIDEWAYS.left)
        expect(box('nb-layout-header > nav').right).toBeCloseTo(innerWidth - SIDEWAYS.right, 0)
        expect(box('.page').left).toBeGreaterThanOrEqual(SIDEWAYS.left)
        expect(box('nb-layout-footer > nav').right).toBeLessThanOrEqual(innerWidth - SIDEWAYS.right + 0.5)
        fixture.destroy()
    })

    it('should show toasts below the notch', async () => {
        setInsets(INSETS)
        const { fixture } = await create()
        TestBed.inject(NbToastrService).show('Saved', 'Done', { duration: 0 })
        fixture.detectChanges()
        await fixture.whenStable()
        const toast = document.querySelector('nb-toast') as HTMLElement
        expect(toast.getBoundingClientRect().top).toBeGreaterThanOrEqual(INSETS.top)
        fixture.destroy()
    })

    it('should change nothing without them', async () => {
        const { fixture, box } = await create()
        expect(box('nb-layout-header > nav').top).toBe(0)
        expect(box('nb-layout-footer > nav').bottom).toBeCloseTo(innerHeight, 0)
        expect(box('.page').left).toBeLessThan(47)
        fixture.destroy()
    })
})
