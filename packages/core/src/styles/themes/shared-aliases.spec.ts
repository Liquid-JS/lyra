import { Component, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbButtonModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <div class="nb-theme-default default">
      <button nbButton status="primary" class="primary">Primary</button>
      <button nbButton status="info" class="info">Info</button>
    </div>
    <div class="nb-theme-shared-changed changed">
      <button nbButton status="primary" class="primary">Primary</button>
      <div class="nb-theme-default nested">
        <button nbButton status="primary" class="primary">Primary</button>
      </div>
    </div>
  `,
    styleUrl: './shared-aliases.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbButtonModule]
})
class SharedAliasesHostComponent {}

// The variables the enabled themes have alike are written once, for all of them; each theme's own values after, so
// every variable reads the same on each theme's element as it would with the theme on its own.
describe('theme variables shared between themes', () => {
    let fixture: ComponentFixture<SharedAliasesHostComponent>

    const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement
    const background = (selector: string) => getComputedStyle(element(selector)).backgroundColor
    /** A variable's colour where the element is, as the browser shows it. */
    const color = (selector: string, name: string) => {
        const probe = document.createElement('span')
        probe.style.color = `var(--${name})`
        element(selector).appendChild(probe)
        const value = getComputedStyle(probe).color
        probe.remove()
        return value
    }
    const variable = (selector: string, name: string) =>
        getComputedStyle(element(selector)).getPropertyValue(`--${name}`).trim()

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), SharedAliasesHostComponent] })
        fixture = TestBed.createComponent(SharedAliasesHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
    })

    it('should write a variable the themes share on each theme, as what it follows', () => {
        expect(variable('.default', 'button-filled-info-background-color')).toBe(variable('.default', 'color-info-default'))
        expect(variable('.changed', 'button-filled-info-background-color')).toBe(variable('.changed', 'color-info-default'))
        expect(variable('.default', 'color-info-default')).not.toBe('')
        expect(background('.default .info')).toBe(color('.default', 'color-info-default'))
    })

    it('should give a variable a theme sets apart its own value there, also in a part of the page', () => {
        expect(background('.changed > .primary')).toBe(color('.changed', 'color-success-default'))
        expect(background('.default > .primary')).toBe(color('.default', 'color-primary-default'))
        expect(background('.nested > .primary')).toBe(color('.nested', 'color-primary-default'))
    })
})
