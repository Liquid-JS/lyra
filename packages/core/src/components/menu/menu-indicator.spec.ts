import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'

import { NbMenuItem, NbMenuModule, NbMenuOrientation, NbThemeModule } from '@liquid-js/lyr-core'

@Component({ template: '' })
class PageComponent {}

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" [attr.dir]="dir()" style="width: 40rem">
      <nb-menu [orientation]="orientation()" [items]="items" />
    </div>
  `,
    styleUrl: './menu-horizontal.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbMenuModule]
})
class MenuHostComponent {
    readonly dir = signal('ltr')
    readonly orientation = signal<NbMenuOrientation>('vertical')
    readonly items: NbMenuItem[] = [
        { title: 'Home', link: '/home' },
        { title: 'Products', children: [{ title: 'Phones', link: '/phones' }] }
    ]
}

describe('NbMenuComponent selected item', () => {
    let fixture: ComponentFixture<MenuHostComponent>
    let host: MenuHostComponent

    const link = (title: string) => fixture.nativeElement.querySelector(`a[title="${title}"]`) as HTMLElement
    const bar = (title: string) => getComputedStyle(link(title), '::before')
    const hasBar = (title: string) => bar(title).content !== 'none'
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbMenuModule.forRoot()],
            providers: [provideRouter(['home', 'phones'].map((path) => ({ path, component: PageComponent })))]
        })
        fixture = TestBed.createComponent(MenuHostComponent)
        host = fixture.componentInstance
        await render()
        await TestBed.inject(Router).navigateByUrl('/phones')
        await render()
    })

    it('should mark the selected item with a bar on its start edge, not its open parent', () => {
        expect(link('Phones').classList).toContain('active')
        expect(link('Products').classList).toContain('active')
        expect(hasBar('Phones')).toBe(true)
        expect(bar('Phones').width).toBe('4px')
        expect(bar('Phones').left).toBe('0px')
        expect(parseFloat(bar('Phones').height)).toBeCloseTo(link('Phones').getBoundingClientRect().height, 0)
        expect(hasBar('Products')).toBe(false)
        expect(hasBar('Home')).toBe(false)
    })

    it('should move the bar to the parent while its submenu is closed', async () => {
        link('Products').click()
        await render()
        expect(host.items[1].expanded).toBe(false)
        expect(hasBar('Products')).toBe(true)
    })

    it('should put the bar on the right in right-to-left text', async () => {
        host.dir.set('rtl')
        await render()
        expect(bar('Phones').right).toBe('0px')
    })

    it('should mark the selected items of a horizontal menu by colour alone', async () => {
        host.orientation.set('horizontal')
        await render()
        expect(hasBar('Products')).toBe(false)
        expect(hasBar('Phones')).toBe(false)
    })
})
