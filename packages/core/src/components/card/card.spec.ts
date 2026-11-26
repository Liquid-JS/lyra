import { assert } from 'vitest'
import { Component, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { NbCardModule, NbListModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <nb-reveal-card id="outer-reveal" [revealed]="true" [showToggleButton]="false">
      <nb-card-front><nb-card>Front</nb-card></nb-card-front>
      <nb-card-back>
        <nb-card>
          <nb-reveal-card id="inner-reveal" [revealed]="false">
            <nb-card-front><nb-card>Inner front</nb-card></nb-card-front>
            <nb-card-back><nb-card>Inner back</nb-card></nb-card-back>
          </nb-reveal-card>
        </nb-card>
      </nb-card-back>
    </nb-reveal-card>

    <nb-flip-card id="outer-flip" [flipped]="true" [showToggleButton]="false">
      <nb-card-front><nb-card>Front</nb-card></nb-card-front>
      <nb-card-back>
        <nb-card>
          <nb-flip-card id="inner-flip" [flipped]="false">
            <nb-card-front><nb-card>Inner front</nb-card></nb-card-front>
            <nb-card-back><nb-card>Inner back</nb-card></nb-card-back>
          </nb-flip-card>
        </nb-card>
      </nb-card-back>
    </nb-flip-card>
  `,
    imports: [NbCardModule]
})
class NbNestedCardsTestComponent {}

describe('nested reveal and flip cards', () => {
    let element: HTMLElement

    const query = (selector: string) => {
        const el = element.querySelector(selector)
        assert(el, `${selector} not rendered`)
        return el
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbCardModule, NbNestedCardsTestComponent]
        })
        const fixture = TestBed.createComponent(NbNestedCardsTestComponent)
        fixture.detectChanges()
        element = fixture.nativeElement
    })

    it('should keep a nested reveal card hidden while its parent is revealed', () => {
        const innerContainer = query('#inner-reveal .second-card-container')
        const innerButton = query('#inner-reveal .reveal-button')

        // The container sits below the card (`top: 100%`) until the card is revealed.
        expect(getComputedStyle(innerContainer).top).not.toBe('0px')
        expect(getComputedStyle(innerButton).transform).not.toBe('none')
    })

    it('should keep a nested flip card unflipped while its parent is flipped', () => {
        expect(getComputedStyle(query('#outer-flip > .flipcard-body')).transform).not.toBe('none')
        expect(getComputedStyle(query('#inner-flip > .flipcard-body')).transform).toBe('none')
    })

    it('should name the toggle buttons and make them focusable', () => {
        const revealButton = query('#inner-reveal .reveal-button')
        expect(revealButton.getAttribute('role')).toBe('button')
        expect(revealButton.getAttribute('aria-label')).toBe('Reveal card')
        expect(revealButton.getAttribute('aria-expanded')).toBe('false')
        expect(revealButton.getAttribute('tabindex')).toBe('0')

        const [frontButton, backButton] = Array.from(element.querySelectorAll('#inner-flip .flip-button'))
        expect(frontButton.getAttribute('aria-label')).toBe('Flip card')
        expect(frontButton.getAttribute('tabindex')).toBe('0')
        expect(backButton.getAttribute('tabindex')).toBe('-1')
    })
})

@Component({
    template: `
    <nb-card id="list-card">
      <nb-card-header>Availability</nb-card-header>
      <nb-list><nb-list-item>Central</nb-list-item></nb-list>
      <nb-card-body>Any branch</nb-card-body>
    </nb-card>

    <nb-card id="form-card" style="height: 16rem">
      <nb-card-header>Place hold</nb-card-header>
      <form>
        <nb-card-body>Body</nb-card-body>
        <nb-card-footer>Footer</nb-card-footer>
      </form>
    </nb-card>

    <nb-card id="plain-card" style="height: 16rem">
      <nb-card-header>Place hold</nb-card-header>
      <nb-card-body>Body</nb-card-body>
      <nb-card-footer>Footer</nb-card-footer>
    </nb-card>
  `,
    // The default theme's card styles, which specs don't load otherwise.
    styleUrl: './card-actions.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbCardModule, NbListModule]
})
class NbCardContentTestComponent {}

describe('a card\'s content', () => {
    let element: HTMLElement

    const box = (selector: string) => {
        const el = element.querySelector(selector)
        assert(el, `${selector} not rendered`)
        return el.getBoundingClientRect()
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbCardContentTestComponent]
        })
        const fixture = TestBed.createComponent(NbCardContentTestComponent)
        fixture.detectChanges()
        element = fixture.nativeElement
    })

    it('should keep a body after other content where it is', () => {
        const order = Array.from(element.querySelector('#list-card')?.children ?? []).map((child) => child.tagName.toLowerCase())
        expect(order).toEqual(['nb-card-header', 'nb-list', 'nb-card-body'])
    })

    it('should lay a body and footer in a form out as the card\'s own', () => {
        expect(box('#form-card nb-card-body').height).toBe(box('#plain-card nb-card-body').height)
        expect(box('#form-card nb-card-footer').top - box('#form-card').top).toBe(box('#plain-card nb-card-footer').top - box('#plain-card').top)
    })
})
