import { Component, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbBadgeModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" dir="ltr" style="position: relative; font-size: 1rem; line-height: 1.5rem">
      <p class="status" style="font-size: 2rem; line-height: 3rem">
        <span class="before">Order</span>&ngsp;<nb-badge dotMode status="success" position="inline" />&ngsp;<span
          class="after">Paid</span>
      </p>
      <p class="label">
        <span class="before">Orders</span>&ngsp;<nb-badge text="3 new" status="primary" position="inline" />&ngsp;<span
          class="after">today</span>
      </p>
    </div>
  `,
    styleUrl: './badge-inline.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbBadgeModule]
})
class BadgeInlineHostComponent {}

describe('NbBadgeComponent inline', () => {
    let fixture: ComponentFixture<BadgeInlineHostComponent>

    const rect = (selector: string) =>
        (fixture.nativeElement.querySelector(selector) as HTMLElement).getBoundingClientRect()

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(BadgeInlineHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
    })

    it('should show a dot between the text around it, centred on the text', () => {
        const dot = rect('.status nb-badge')
        const before = rect('.status .before')
        const after = rect('.status .after')

        expect(dot.width).toBeGreaterThan(0)
        expect(dot.width).toBe(dot.height)
        expect(dot.left).toBeGreaterThan(before.right)
        expect(dot.right).toBeLessThan(after.left)
        // Centred on lowercase letters, which sit a little below the line's centre, at any size of text.
        const centre = dot.top + dot.height / 2
        const textCentre = after.top + after.height / 2
        expect(centre).toBeGreaterThan(textCentre - 1)
        expect(centre).toBeLessThan(textCentre + 4)
    })

    it('should show text between the text around it, on its baseline', () => {
        const badge = rect('.label nb-badge')
        const before = rect('.label .before')
        const after = rect('.label .after')

        expect(badge.left).toBeGreaterThan(before.right)
        expect(badge.right).toBeLessThan(after.left)
        expect(badge.top).toBeLessThan(after.bottom)
        expect(badge.bottom).toBeGreaterThan(after.top)
    })
})
