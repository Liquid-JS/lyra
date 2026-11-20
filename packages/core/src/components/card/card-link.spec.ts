import { Component, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { userEvent } from 'vitest/browser'

import { NbButtonModule, NbCardModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" style="width: 30rem">
      <nb-card class="outline">
        <nb-card-header>Outline</nb-card-header>
        <nb-card-body>Body</nb-card-body>
      </nb-card>
      <nb-card class="filled" appearance="filled">
        <nb-card-header>Filled</nb-card-header>
        <nb-card-body>Body</nb-card-body>
        <nb-card-footer>Footer</nb-card-footer>
      </nb-card>
      <nb-card class="interactive">
        <nb-card-header><a nbCardLink class="header-link" href="#team">Team plan</a></nb-card-header>
        <nb-card-body class="interactive-body">For up to 20 people.</nb-card-body>
        <nb-card-footer><button nbButton size="small" class="compare">Compare</button></nb-card-footer>
      </nb-card>
      <nb-card class="body-link">
        <nb-card-header>Business</nb-card-header>
        <nb-card-body><a nbCardLink class="inner-link" href="#business">Business plan</a></nb-card-body>
      </nb-card>
    </div>
  `,
    styleUrl: './card-actions.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbCardModule, NbButtonModule]
})
class CardLinkHostComponent {}

describe('nb-card appearance and nbCardLink', () => {
    let fixture: ComponentFixture<CardLinkHostComponent>

    const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement
    const style = (selector: string) => getComputedStyle(element(selector))
    /** The element a pointer finds at the centre of another one. */
    const hitAt = (selector: string) => {
        const rect = element(selector).getBoundingClientRect()
        return document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(CardLinkHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
    })

    afterEach(() => fixture.destroy())

    it('should tint a filled card, without an outer border but with darker dividers', () => {
        expect(element('.outline').classList).toContain('appearance-outline')
        expect(element('.filled').classList).toContain('appearance-filled')
        expect(style('.filled').backgroundColor).not.toBe(style('.outline').backgroundColor)
        expect(style('.filled').borderTopColor).toBe('rgba(0, 0, 0, 0)')
        // The same size as an outline card.
        expect(style('.filled').borderTopWidth).toBe(style('.outline').borderTopWidth)
        expect(style('.filled nb-card-header').borderBottomColor).not.toBe(style('.outline nb-card-header').borderBottomColor)
        expect(style('.filled nb-card-header').borderBottomColor).toBe(style('.filled nb-card-footer').borderTopColor)
    })

    it('should let the link cover the card, and keep its other controls their own', () => {
        expect(element('.header-link').classList).toContain('card-link')
        expect(hitAt('.interactive-body')).toBe(element('.header-link'))
        expect(hitAt('.compare')).toBe(element('.compare'))
        // Also from inside the body.
        expect(hitAt('.body-link nb-card-header')).toBe(element('.inner-link'))
    })

    it('should show the link\'s hover on the card', async () => {
        const resting = style('.interactive').backgroundColor
        await userEvent.hover(element('.header-link'))
        await expect.poll(() => style('.interactive').backgroundColor).not.toBe(resting)
        await userEvent.hover(element('.compare'))
        await expect.poll(() => style('.interactive').backgroundColor).toBe(resting)
    })
})
