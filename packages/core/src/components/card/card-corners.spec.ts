import { assert } from 'vitest'
import { Component, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbCardModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" style="--card-border-radius: 1rem; --card-border-width: 2px">
      <nb-card class="cover">
        <nb-card-body class="first"><img alt="" /></nb-card-body>
        <nb-card-body class="middle">Text</nb-card-body>
        <nb-card-footer class="last">Footer</nb-card-footer>
      </nb-card>
      <nb-card accent="primary" class="accent-card">
        <nb-card-body class="accent-first">Text</nb-card-body>
      </nb-card>
      <nb-card status="primary" class="status-card">
        <nb-card-header>Status</nb-card-header>
        <nb-card-body>Text</nb-card-body>
      </nb-card>
      <nb-card status="primary" accent="info" class="status-accent-card">
        <nb-card-header>Status</nb-card-header>
        <nb-card-body>Text</nb-card-body>
      </nb-card>
      <nb-card class="media-card">
        <nb-card-body>Text</nb-card-body>
        <div nbCardMedia class="top" style="height: 40px"></div>
        <div nbCardMedia="bottom" class="bottom" style="height: 40px"></div>
      </nb-card>
      <nb-card class="inset-card">
        <div nbCardMedia inset class="inset" style="height: 40px"></div>
        <nb-card-body>Text</nb-card-body>
      </nb-card>
    </div>
  `,
    styleUrl: './card-actions.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbCardModule]
})
class CardCornersHostComponent {}

describe('NbCardComponent corners', () => {
    // Images and backgrounds in a card's first or last row stay within its rounded corners.
    it('should round its first and last rows to the corners inside its border', () => {
        const fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), CardCornersHostComponent]
        }).createComponent(CardCornersHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        const style = (selector: string) => getComputedStyle(fixture.nativeElement.querySelector(selector))

        // 1rem (16px) less the 2px border.
        expect(style('.first').borderTopLeftRadius).toBe('14px')
        expect(style('.first').borderTopRightRadius).toBe('14px')
        expect(style('.first').borderBottomLeftRadius).toBe('0px')
        expect(style('.middle').borderTopLeftRadius).toBe('0px')
        expect(style('.last').borderBottomLeftRadius).toBe('14px')
        expect(style('.last').borderBottomRightRadius).toBe('14px')
        // Under an accent card's band, the first row is square.
        expect(style('.accent-first').borderTopLeftRadius).toBe('0px')
        fixture.nativeElement.remove()
    })

    // Media reaches the card's edges, in front of its border: no border shows around it, or next to the content.
    it('should put media at the edges, in front of the border', () => {
        const fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), CardCornersHostComponent]
        }).createComponent(CardCornersHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        const card: HTMLElement = fixture.nativeElement.querySelector('.media-card')
        const top = card.querySelector<HTMLElement>('.top')
        const bottom = card.querySelector<HTMLElement>('.bottom')
        assert(top && bottom, 'media not rendered')

        // Written after the body, it still goes first; the bottom one last.
        expect(card.firstElementChild).toBe(top)
        expect(card.lastElementChild).toBe(bottom)
        expect(top.getBoundingClientRect().width).toBe(card.getBoundingClientRect().width)
        expect(top.getBoundingClientRect().top).toBe(card.getBoundingClientRect().top)
        expect(getComputedStyle(top).borderTopLeftRadius).toBe('16px')
        expect(getComputedStyle(top).borderBottomWidth).toBe('0px')
        expect(getComputedStyle(bottom).borderTopWidth).toBe('0px')
        expect(getComputedStyle(bottom).borderBottomRightRadius).toBe('16px')
        fixture.nativeElement.remove()
    })

    // Inset, media stays inside the border, which frames it, rounded to the corners within it.
    it('should keep inset media inside the border', () => {
        const fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), CardCornersHostComponent]
        }).createComponent(CardCornersHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        const card: HTMLElement = fixture.nativeElement.querySelector('.inset-card')
        const media = card.querySelector<HTMLElement>('.inset')
        assert(media, 'media not rendered')

        const outer = card.getBoundingClientRect()
        const inner = media.getBoundingClientRect()
        expect(inner.width).toBe(outer.width - 4)
        expect(inner.top).toBe(outer.top + 2)
        expect(getComputedStyle(media).borderTopLeftRadius).toBe('14px')
        fixture.nativeElement.remove()
    })

    // A coloured header covers the border: none shows around it or below it; under an accent, it meets the band.
    it('should put a coloured header in front of the border', () => {
        const fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), CardCornersHostComponent]
        }).createComponent(CardCornersHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        const parts = (selector: string) => {
            const host: HTMLElement = fixture.nativeElement
            const card = host.querySelector<HTMLElement>(selector)
            const header = card?.querySelector<HTMLElement>('nb-card-header')
            assert(card && header, 'card not rendered')
            return {
                card: card.getBoundingClientRect(),
                header: header.getBoundingClientRect(),
                style: getComputedStyle(header)
            }
        }

        const plain = parts('.status-card')
        expect(plain.header.width).toBe(plain.card.width)
        expect(plain.header.top).toBe(plain.card.top)
        expect(plain.style.borderBottomWidth).toBe('0px')

        const accented = parts('.status-accent-card')
        expect(accented.header.width).toBe(accented.card.width)
        // Right below the 4px band.
        expect(accented.header.top - accented.card.top).toBe(4)
        expect(accented.style.borderBottomWidth).toBe('0px')
        fixture.nativeElement.remove()
    })

    // The band is a layer of its own, shaped like the card: the borders stay the card's, so a hover can change them.
    it('should draw an accent as a band over the top, apart from the borders', () => {
        const fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), CardCornersHostComponent]
        }).createComponent(CardCornersHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        const card: HTMLElement = fixture.nativeElement.querySelector('.accent-card')
        const style = getComputedStyle(card)
        const band = getComputedStyle(card, '::before')

        expect(style.borderTopColor).toBe(style.borderLeftColor)
        expect(style.borderTopWidth).toBe('2px')
        expect(band.backgroundImage).toContain('linear-gradient')
        expect(band.borderTopLeftRadius).toBe('16px')
        // The content starts below the band (4px), less the top border it covers.
        expect(style.paddingTop).toBe('2px')
        expect(band.backgroundImage).toContain('4px')
        fixture.nativeElement.remove()
    })
})
