import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'

import { NbMenuItem, NbMenuModule, NbMenuOrientation, NbThemeModule } from '@liquid-js/lyr-core'

@Component({ template: '' })
class PageComponent {}

const menuItems = (): NbMenuItem[] => [
    { title: 'Home', link: '/home' },
    {
        title: 'Products',
        children: [
            { title: 'Phones', link: '/phones' },
            { title: 'Accessories', children: [{ title: 'Cases', link: '/cases' }] }
        ]
    },
    { title: 'Support', children: [{ title: 'Contact', link: '/contact' }] }
]

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" dir="ltr" style="width: 40rem">
      <nb-menu [orientation]="orientation()" [items]="items" />
      <button class="outside">Outside</button>
    </div>
  `,
    styleUrl: './menu-horizontal.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbMenuModule]
})
class HorizontalMenuHostComponent {
    readonly orientation = signal<NbMenuOrientation>('horizontal')
    readonly items = menuItems()
}

describe('NbMenuComponent horizontal', () => {
    let fixture: ComponentFixture<HorizontalMenuHostComponent>
    let host: HorizontalMenuHostComponent

    const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement
    const topItems = () => [...fixture.nativeElement.querySelectorAll('nb-menu > .menu-items > .menu-item')] as HTMLElement[]
    const toggle = (index: number) => topItems()[index].querySelector(':scope > a') as HTMLElement
    const dropdown = (index: number) => topItems()[index].querySelector(':scope > .menu-items') as HTMLElement
    const link = (title: string) => fixture.nativeElement.querySelector(`a[title="${title}"]`) as HTMLElement
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const open = () => host.items.filter((item) => item.expanded).map((item) => item.title)

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbMenuModule.forRoot()],
            providers: [provideRouter(['home', 'phones', 'cases', 'contact'].map((path) => ({ path, component: PageComponent })))]
        })
        fixture = TestBed.createComponent(HorizontalMenuHostComponent)
        host = fixture.componentInstance
        await render()
    })

    it('should show the top-level items in a row, with closed dropdowns that take no room', () => {
        const tops = topItems().map((item) => item.getBoundingClientRect())
        expect(new Set(tops.map((rect) => Math.round(rect.top))).size).toBe(1)
        expect(tops[1].left).toBeGreaterThan(tops[0].right - 1)
        expect(element('nb-menu').getBoundingClientRect().height).toBe(tops[0].height)
        expect(dropdown(1).getBoundingClientRect().height).toBe(0)
    })

    it('should open a dropdown below its item, over what follows, one at a time', async () => {
        toggle(1).click()
        await render()
        expect(open()).toEqual(['Products'])
        expect(toggle(1).getAttribute('aria-expanded')).toBe('true')
        const item = topItems()[1].getBoundingClientRect()
        const list = dropdown(1).getBoundingClientRect()
        expect(list.top).toBeCloseTo(item.bottom, 0)
        expect(list.left).toBeCloseTo(item.left, 0)
        expect(list.height).toBeGreaterThan(0)
        // It doesn't push the content after the menu down.
        expect(element('nb-menu').getBoundingClientRect().height).toBe(item.height)

        toggle(2).click()
        await render()
        expect(open()).toEqual(['Support'])

        toggle(2).click()
        await render()
        expect(open()).toEqual([])
    })

    it('should expand deeper levels inside the dropdown and keep it open', async () => {
        toggle(1).click()
        await render()
        link('Accessories').click()
        await render()

        expect(open()).toEqual(['Products'])
        expect(host.items[1].children?.[1].expanded).toBe(true)
    })

    it('should close the dropdown when an item in it is picked', async () => {
        toggle(1).click()
        await render()
        link('Phones').click()
        await render()

        expect(open()).toEqual([])
        expect(TestBed.inject(Router).url).toBe('/phones')
    })

    it('should close the dropdown on a click elsewhere, but not on one inside it', async () => {
        toggle(1).click()
        await render()
        dropdown(1).click()
        await render()
        expect(open()).toEqual(['Products'])

        element('.outside').click()
        await render()
        expect(open()).toEqual([])
    })

    it('should close the dropdown on Escape and focus its item', async () => {
        toggle(1).click()
        await render()
        link('Phones').focus()
        link('Phones').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        await render()

        expect(open()).toEqual([])
        expect(document.activeElement).toBe(toggle(1))
    })

    it('should close the dropdown when focus moves out of it, but not within it', async () => {
        toggle(1).click()
        await render()
        toggle(1).focus()
        link('Phones').focus()
        await render()
        expect(open()).toEqual(['Products'])

        element('.outside').focus()
        await render()
        expect(open()).toEqual([])
    })

    it('should leave the dropdown of the selected item closed when the URL selects it', async () => {
        await TestBed.inject(Router).navigateByUrl('/cases')
        await render()

        expect(open()).toEqual([])
        expect(host.items[1].selected).toBe(true)
        // Levels inside the dropdown show the way to the selected item when it opens.
        expect(host.items[1].children?.[1].expanded).toBe(true)
    })

    it('should keep a vertical menu as it was', async () => {
        host.orientation.set('vertical')
        await render()
        toggle(1).click()
        await render()
        element('.outside').click()
        await render()

        expect(open()).toEqual(['Products'])
        const tops = topItems().map((item) => item.getBoundingClientRect())
        expect(tops[1].top).toBeGreaterThan(tops[0].top)
    })
})
