import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbPageIndicatorModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" [attr.dir]="dir()">
      <nb-page-indicator [count]="count()" [(page)]="page" />
    </div>
  `,
    styleUrl: './page-indicator.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbPageIndicatorModule]
})
class PageIndicatorHostComponent {
    readonly dir = signal('ltr')
    readonly count = signal(4)
    readonly page = signal(1)
}

describe('nb-page-indicator', () => {
    let fixture: ComponentFixture<PageIndicatorHostComponent>
    let host: PageIndicatorHostComponent

    const indicator = () => fixture.nativeElement.querySelector('nb-page-indicator') as HTMLElement
    const dots = () => [...indicator().querySelectorAll('button')] as HTMLButtonElement[]
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const key = async (dot: HTMLElement, name: string) => {
        dot.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }))
        await render()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(PageIndicatorHostComponent)
        host = fixture.componentInstance
        document.body.appendChild(fixture.nativeElement)
        await render()
    })

    afterEach(() => fixture.destroy())

    it('should be a named group of a dot per page, the current one marked and long', () => {
        expect(indicator().getAttribute('role')).toBe('group')
        expect(indicator().getAttribute('aria-label')).toBe('Pages')
        expect(dots().map((dot) => dot.getAttribute('aria-label'))).toEqual([
            'Page 1 of 4',
            'Page 2 of 4',
            'Page 3 of 4',
            'Page 4 of 4'
        ])
        expect(dots().map((dot) => dot.getAttribute('aria-current'))).toEqual([null, 'true', null, null])
        // One dot in the tab order.
        expect(dots().map((dot) => dot.tabIndex)).toEqual([-1, 0, -1, -1])
        const width = (dot: HTMLElement) => parseFloat(getComputedStyle(dot, '::before').width)
        expect(width(dots()[1])).toBeGreaterThan(width(dots()[0]) * 2)
        // Big enough to hit.
        expect(dots()[0].getBoundingClientRect().height).toBeGreaterThanOrEqual(24)
    })

    it('should go to a page on a click', async () => {
        dots()[3].click()
        await render()
        expect(host.page()).toBe(3)
        expect(document.activeElement).toBe(dots()[3])
    })

    it('should move with the arrows, Home and End, taking the focus along', async () => {
        dots()[1].focus()
        await key(dots()[1], 'ArrowRight')
        expect(host.page()).toBe(2)
        expect(document.activeElement).toBe(dots()[2])
        await key(dots()[2], 'End')
        expect(host.page()).toBe(3)
        await key(dots()[3], 'ArrowRight')
        expect(host.page()).toBe(3)
        await key(dots()[3], 'Home')
        expect(host.page()).toBe(0)
        expect(document.activeElement).toBe(dots()[0])
    })

    it('should reverse the left and right arrows in right-to-left text', async () => {
        host.dir.set('rtl')
        await render()
        await key(dots()[1], 'ArrowLeft')
        expect(host.page()).toBe(2)
    })

    it('should keep the current dot within the pages there are', async () => {
        host.count.set(2)
        host.page.set(5)
        await render()
        expect(dots().map((dot) => dot.getAttribute('aria-current'))).toEqual([null, 'true'])
    })
})
