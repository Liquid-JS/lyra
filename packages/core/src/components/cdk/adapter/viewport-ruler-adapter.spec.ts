import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbSelectModule, NbThemeModule, NbViewportRulerAdapter } from '@liquid-js/lyr-core'

@Component({
    template: '<nb-select placeholder="Fruit"><nb-option value="apple">Apple</nb-option></nb-select>',
    imports: [NbSelectModule]
})
class SelectWithoutLayoutComponent {}

describe('NbViewportRulerAdapter without a layout', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
    })

    it('should measure the window', () => {
        const ruler = TestBed.inject(NbViewportRulerAdapter)

        expect(ruler.getViewportSize()).toEqual({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        })
        expect(ruler.getViewportScrollPosition()).toEqual({ top: window.scrollY, left: window.scrollX })
    })

    it('should let a select open its options', async () => {
        const fixture = TestBed.createComponent(SelectWithoutLayoutComponent)
        fixture.detectChanges()
        await fixture.whenStable();

        (fixture.nativeElement.querySelector('nb-select button') as HTMLElement).click()
        fixture.detectChanges()
        await fixture.whenStable()

        expect(document.querySelector('nb-option')?.textContent?.trim()).toBe('Apple')
    })
})
